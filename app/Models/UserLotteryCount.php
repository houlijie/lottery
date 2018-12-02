<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;

class UserLotteryCount extends Model
{
    protected $table = 'user_lottery_count'; // 抽奖统计

    public function getRow($filter)
    {
        $data = $this->getListBy($filter);
        $res = ($data['count'] >0) ? $data['list'][0] : [];

        return $res;
    }

    public function getListBy($filter)
    {
        if(!$filter) return [];
        $res = $this->where(function ($query) use ($filter) {
            foreach ($filter as $field => $value) {
                if(!is_null($value) && $value != '' && $field) {
                    $list = explode('|', $field);
                    if (count($list) > 1) {
                        list($k,$op) = $list;
                        switch ($op) {
                            case 'bthan':
                                $operator = '>=';
                                break;
                            case 'sthan':
                                $operator = '<';
                                break;
                        }
                        $query->where($k, $operator, $value);
                        continue;
                    } else {
                        $query->where($field,$value);
                    }
                }
            }
        })->get();
        $result['list'] = [];
        if($res) {
            foreach ($res as $entity) {
                $result['list'][] = $this->getData($entity);
            }
        }
        $result['count'] = isset($result['list']) ? count($result['list']) : 0;
        return $result;
    }

    private function getData($entity)
    {
        $result = [];
        if($entity) {
            $result = [
                'mobile' => $entity->mobile,
                'total_count' => $entity->total_count,
                'total_win_count' => $entity->total_win_count,
                'count_date' => $entity->count_date,
            ];
        }
        return $result;
    }
}
