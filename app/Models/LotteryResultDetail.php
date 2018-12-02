<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;

class LotteryResultDetail extends Model
{
    protected $table = 'lottery_result_detail';


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
        foreach ($res as $entity) {
            $result['list'][] = $this->getData($entity);
        }
        $result['count'] = isset($result['list']) ? count($result['list']) : 0;
        return $result;
    }

    private function getData($entity)
    {
        $result = [];
        if($entity) {
            $result = [
                'id' => $entity->id,
                'mobile' => $entity->mobile,
            ];
        }
        return $result;
    }
}
