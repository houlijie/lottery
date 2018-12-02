<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Validator;

use App\Models\LotteryResultDetail;
use App\Exceptions\Exception;

class lotteryController extends Controller
{
    private $prizeList = [
        ['prize_id' => 0, 'prize_name' => '未中奖', 'rate' => 20, 'stock' => 9999999],
        ['prize_id' => 1, 'prize_name' => '一等奖', 'rate' => 16, 'stock' => 100],
        ['prize_id' => 2, 'prize_name' => '二等奖', 'rate' => 16, 'stock' => 100],
        ['prize_id' => 3, 'prize_name' => '三等奖', 'rate' => 16, 'stock' => 100],
        ['prize_id' => 4, 'prize_name' => '四等奖', 'rate' => 16, 'stock' => 100],
        ['prize_id' => 5, 'prize_name' => '五等奖', 'rate' => 16, 'stock' => 100],
    ];

    private $lottery_joint_limit = 3; //抽奖限定时间内次数限制

    private $start_time = '';

    private $end_time = '';

    private $today = '';

    public function __construct()
    {
        $this->today =  date('Ymd');
        $this->start_time = strtotime(date('Y-m-d',time()));
        $this->end_time = $this->start_time + 24*60*60;
        foreach ($this->prizeList as $prize) {
            $key = $this->today.':lottery-stock:'.$prize['prize_id'];
            Redis::set($key, $prize['stock']);
            Redis::expireat($key, $this->end_time);
        }
    }

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

        $mobile = $request->input('mobile');

        $userJoinKey = $this->today.':joinNum:'. $mobile;
        $userJoinNum = Redis::get($userJoinKey);
        if(!is_null($userJoinNum) && $userJoinNum >= $this->lottery_joint_limit) {
            $msg = '抽奖次数已用完！';
            return response()->json(['message' => $msg, 'status' => 'failure']);
        }

        try {

            // 用户抽奖次数校验
            $prizeId = $this->getRand();
            $lotteryStockKey = $this->today.':lottery-stock:'.$prizeId;
            $userWinKey = $this->today.':WinNum:'. $mobile;

            $userWinNum = Redis::get($userWinKey);
            $lotteryStock = Redis::get($lotteryStockKey);

            if($prizeId > 0 && $lotteryStock <=0 && $userWinNum > 0) {
                $prizeInfo = $this->prizeList[0];
            } else {
                // 商品库存减一
                Redis::decrby($lotteryStockKey, 1);
                //用户中奖次数加+1
                $userLotteryCount = Redis::incrby($userWinNum, 1);
                $prizeInfo= $this->prizeList[$prizeId];
            }
            //用户参与次数
            Redis::incrby($userJoinKey, 1);

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
            $result = [
                'status' => 'success',
                'prizeInfo' => [
                    'prize_id' => $prizeInfo['prize_id'],
                    'prize_name' => $prizeInfo['prize_name']
                ],
                'left_lottery_count' => ($left_lottery_count > 0) ? $left_lottery_count : 0,
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
     * @return void
     * @author
     **/
     //获取奖项id算法
    private function getRand(){
        $proArr = array_column($this->prizeList, 'rate');
        $result = "";
        $proSum = array_sum($proArr);
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
        return $result;
    }
}
