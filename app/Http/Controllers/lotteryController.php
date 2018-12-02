<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use DB;
use Illuminate\Validation\Validator;

use App\Models\UserLotteryCount;
use App\Models\LotteryResultCount;
use App\Models\LotteryResultDetail;
use App\Exceptions\Exception;

class lotteryController extends Controller
{
    private $prizeList = [
        ['prize_id' => 0, 'prize_name' => '未中奖', 'rate' => 0, 'stock' => -1],
        ['prize_id' => 1, 'prize_name' => '一等奖', 'rate' => 80, 'stock' => 100],
        ['prize_id' => 2, 'prize_name' => '二等奖', 'rate' => 0, 'stock' => 100],
        ['prize_id' => 3, 'prize_name' => '三等奖', 'rate' => 10, 'stock' => 100],
        ['prize_id' => 4, 'prize_name' => '四等奖', 'rate' => 10, 'stock' => 100],
        ['prize_id' => 5, 'prize_name' => '五等奖', 'rate' => 0, 'stock' => 100],
    ];

    private $lottery_joint_limit = 3; //抽奖限定时间内次数限制

    /**
     * 获取奖励
     * 需求： 每人每天3次抽奖机会
     *
     * @return void
     * @author 
     **/
    public function getPrize(Request $request)
    {
        $start_time = strtotime(date('Y-m-d',time()));
        $end_time = $start_time + 24*60*60;
        $date = date('Ymd');
        $mobile = 18817505922;//$request->input('mobile');
        $filter = [
            'mobile' => $mobile ,
            'created_time|bthan' => $start_time,
            'created_time|sthan' => $end_time
        ];
        try {
            DB::beginTransaction();
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
                throw new \Exception($errmsg);
            }

            // 用户抽奖次数校验
            $userLotteryCountMdl = new UserLotteryCount();
            $userLotteryCount = $userLotteryCountMdl->getRow(['count_date'=>$date,'mobile'=>$mobile]);
            if($userLotteryCount && $userLotteryCount['total_count'] >=3) {
                throw new \Exception("抽奖次数已用完！");
            }

            $rateArr = array_column($this->prizeList, 'rate');
            $prizeId = $this->getRand($rateArr);
            $prizeInfo= $this->prizeList[$prizeId];

            if($prizeId > 0) {
                // 库存校验
                $lotteryCountMdl = new LotteryResultCount();
                $lotteryCount = $lotteryCountMdl->getRow(['count_date'=>$date,'prize_id'=>$prizeId]);
                if($lotteryCount && $lotteryCount['total_win_count'] >= $prizeInfo['stock']) {
                    $prizeInfo = $this->prizeList[0];
                }
                if($userLotteryCount && $userLotteryCount['total_win_count'] > 1) {
                    $prizeInfo = $this->prizeList[0];
                }
                $lotteryDetailMdl = new LotteryResultDetail();

            }

            // updateOrCreate


            DB::commit();
            $userLotteryCount['total_count'] = 0;
            $result['prizeInfo'] = $prizeInfo;
            $left_lottery_count = $this->lottery_joint_limit - $userLotteryCount['total_count'] - 1;
            $result['left_lottery_count'] =  ($left_lottery_count > 0) ? $left_lottery_count : 0;

            return response()->json(json_encode($result));

        } catch(\Exception $e) {
            DB::rollBack();
            $msg = $e->getMessage();
            return response()->json(['msg' => $msg, 'status' => 'failure']);
        }
    }



    /**
     * undocumented function
     *
     * @return void
     * @author 
     **/
     //获取奖项id算法
    public function getRand($proArr){
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

    //
}
