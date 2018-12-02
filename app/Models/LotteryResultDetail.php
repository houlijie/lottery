<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;

class LotteryResultDetail extends Model
{
    protected $table = 'lottery_result_detail';

    public function updateBy($filter, $update)
    {
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
        foreach ($res as $entity) {
            $result['list'][] = $this->getData($entity);
        }
        $result['count'] = isset($result['list']) ? count($result['list']) : 0;
        return $result;
    }

    public function getUserCollection($where){
      $user = $this->model;
      if(count($where)){
          $user = $user->where(function ($query) use ($where) {
              foreach($where as $key => $value){
                  if($key=='你需要查询的字段'){
                      $query->where($key,$value);
                  }
              }
           }); 
      }
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
