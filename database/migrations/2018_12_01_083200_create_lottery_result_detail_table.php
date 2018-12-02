<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLotteryResultDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lottery_result_detail', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id')->comment('抽奖id');
            $table->string('mobile', 12)->nullable(false)->comment('抽奖手机号');
            $table->bigInteger('prize_id')->nullable(false)->comment('奖项id');
            $table->string('prize_name')->nullable(false)->comment('奖项名称');
            $table->json('prize_info')->nullable(false)->comment('奖项详情');
            $table->bigInteger('created_time')->nullable(false)->comment('抽奖时间');
            $table->index('mobile');
            $table->index('prize_id');
            $table->index('created_time');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lottery_result_detail');
    }
}
