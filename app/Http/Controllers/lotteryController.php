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
        ['prize_id' => 0, 'prize_name' => '未中奖',   'rate' => 0, 'stock' => 99999999],
        ['prize_id' => 1, 'prize_name' => '开业好礼', 'rate' => 20, 'stock' => 200],
        ['prize_id' => 2, 'prize_name' => '美食好礼', 'rate' => 20, 'stock' => 100],
        ['prize_id' => 3, 'prize_name' => '亲子好礼', 'rate' => 20, 'stock' => 100],
        ['prize_id' => 4, 'prize_name' => '生活好礼', 'rate' => 20, 'stock' => 100],
        ['prize_id' => 5, 'prize_name' => '休闲好礼', 'rate' => 20, 'stock' => 100],
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
            $stock = Redis::get($key);
            if(is_null($stock)) {
                Redis::set($key, $prize['stock']);
                Redis::expireat($key, $this->end_time);
            }
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

            if($userWinNum > 0 || ($prizeId > 0 && $lotteryStock <=0)) {
                $prizeInfo = $this->prizeList[0];
            } else {
                //用户中奖次数加+1
                $res = Redis::incrby($userWinKey, 1);
                $prizeInfo= $this->prizeList[$prizeId];
            }
            // 商品库存减一
            Redis::decrby($lotteryStockKey, 1);
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
     * 没有库存的不参与抽奖
     *
     * @return void
     * @author
     **/
    private function getRand(){
        $proArr = [];
        foreach ($this->prizeList as $key => $prize) {
            $lotteryStockKey = $this->today.':lottery-stock:'.$prize['prize_id'];
            $stock = Redis::get($lotteryStockKey);
            if($stock > 0) {
                $proArr[$key] = $prize['rate'];
            }
        }
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
