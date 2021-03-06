<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Validator;

use \DB;
use App\Models\LotteryDetail;
use App\Models\LotteryResultDetail;
use App\Exceptions\Exception;

class lotteryController extends Controller
{
    private $lottery_joint_limit = 3; //抽奖限定时间内次数限制

    public function index()
    {
        return view('index');
    }

    /**
     * 获取奖励
     * 需求： 每人每天3次抽奖机会
     *
     * @return void
     * @author
     **/
    public function getPrize(Request $request)
    {
        $lotteryDate = date('Ymd');
        $startTime = strtotime(date('Y-m-d',time()));
        $endTime = $startTime + 24*60*60;
        $mobile = $request->input('mobile');
        $validator = app('validator')->make($request->all(), [
            'mobile' => 'required|numeric|digits:11',
        ],[
            'mobile.*' => '请输入正确的11位手机号',
        ]);
        if ($validator->fails()) {
            $errorsMsg = $validator->errors()->toArray();
            $errmsg = '';
            foreach ($errorsMsg as $v) {
                $msg = implode("，", $v);
                $errmsg .= $msg;
            }
            return response()->json(['message' => $errmsg, 'status' => 'failure']);
        }


        $userJoinKey = $lotteryDate.':joinNum:'. $mobile;
        $userJoinNum = Redis::get($userJoinKey);
        if(!is_null($userJoinNum) && $userJoinNum >= $this->lottery_joint_limit) {
            $msg = '抽奖次数已用完！';
            return response()->json(['message' => $msg, 'status' => 'failure']);
        }

        try {

            $lotteryDetail = new LotteryDetail();
            $prizeData = $lotteryDetail->getListBy(['lottery_date'=>$lotteryDate]);
            if(!$prizeData || $prizeData['count'] <=0) {
                throw new \Exception("活动暂未开启");
            }
            $prizeList = $prizeData['list'];
            $hasStockPrizes = array_filter($prizeList, function($v, $k) {
                return $v['stock'] > 0;
            }, ARRAY_FILTER_USE_BOTH);
            // 用户抽奖次数校验
            $prizeId = $this->getRand($hasStockPrizes);
            $userWinKey = $lotteryDate.':WinNum:'. $mobile;
            $userWinNum = Redis::get($userWinKey);

            if($hasStockPrizes && !$userWinNum && $userJoinNum >=2) {
                $data = array_filter(array_column($hasStockPrizes, 'prize_id'));
                if($data) {
                    $rn = array_rand($data);
                    $prizeId = $data[$rn];
                }
            }

            $prizeInfo = $prizeList[$prizeId];
            if($userWinNum > 0 || ($prizeId > 0 && $prizeInfo['stock'] <=0)) {
                $prizeId = 0;
                $prizeInfo= $prizeList[$prizeId];
            }
            //用户中奖次数加+1
            if($prizeId > 0) {
                $res = Redis::incrby($userWinKey, 1);
            }
            // 商品库存减一
            $a = DB::table('lottery_detail')->where('lottery_date', $lotteryDate)
                                            ->where('prize_id', $prizeId)
                                            ->decrement('stock');
            //用户参与次数
            $userLotteryCount = Redis::incrby($userJoinKey, 1);

            //抽奖记录
            $detailData = [
                'mobile' => $mobile,
                'prize_id' => $prizeId,
                'prize_name' => $prizeInfo['prize_name'],
                'prize_info' => json_encode($prizeInfo),
                'created_time' => time(),
            ];
            LotteryResultDetail::create($detailData);

            $left_lottery_count = $this->lottery_joint_limit - $userLotteryCount;

            $lotteryResMdl = new LotteryResultDetail();
            $resultList = $lotteryResMdl->getListBy(['prize_id' => $prizeId, 'created_time|bthan' => $startTime, 'created_time|sthan' => $endTime]);

            $no = $lotteryDate.str_pad($resultList['count'], 3, "0", STR_PAD_LEFT);
            $result = [
                'status' => 'success',
                'prizeInfo' => [
                    'prize_id' => $prizeInfo['prize_id'],
                    'prize_name' => $prizeInfo['prize_name']
                ],
                'left_lottery_count' => ($left_lottery_count > 0) ? $left_lottery_count : 0,
                'no' => $no,
            ];

            return response()->json($result);

        } catch(\Exception $e) {
            $msg = $e->getMessage();
            return response()->json(['message' => $msg, 'status' => 'failure']);
        }
    }

    /**
     * 抽奖函数
     *
     * 没有库存的不参与抽奖
     *
     * @return void
     * @author
     **/
    private function getRand($prizeList){
        $proArr = array_column($prizeList, 'rate');
        $proSum = array_sum($proArr);
        $result = 0;
        if($proArr && $proSum > 0) {
            foreach ($proArr as $key => $proCur) {
                $randNum = mt_rand(1, $proSum);
                if ($randNum <= $proCur) {
                    $result = $key;
                    break;
                } else {
                    $proSum -= $proCur;
                }
            }
            unset ($proArr);
        }
        return $result;
    }
}
