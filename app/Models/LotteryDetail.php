<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotteryDetail extends Model
{
    protected $table = 'lottery_detail';

    protected $guarded = [];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    // protected $fillable = ['mobile'];

    public $timestamps = false;

    public function getListBy($filter)
    {
        if(!$filter) return [];
        $res = $this->where(function ($query) use ($filter) {
            foreach ($filter as $field => $value) {
                if(!is_null($value) && $value != '' && $field) {
                    $query->where($field,$value);
                }
            }
        })->get();
        $result['list'] = [];
        foreach ($res as $entity) {
            $prizeInfo = $this->getData($entity);
            $result['list'][$prizeInfo['prize_id']] = $prizeInfo;
        }
        $result['count'] = isset($result['list']) ? count($result['list']) : 0;
        return $result;
    }

    private function getData($entity)
    {
        $result = [];
        if($entity) {
            $result = [
                'prize_id' => $entity->prize_id,
                'prize_name' => $entity->prize_name,
                'rate' => $entity->rate,
                'total_stock' => $entity->total_stock,
                'stock' => $entity->stock,
                'lottery_date' => $entity->lottery_date,
            ];
        }
        return $result;
    }
}
