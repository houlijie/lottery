<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLotteryResultCountTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lottery_result_count', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->unsignedTinyInteger('prize_id')->nullable(false)->comment('奖项id');
            $table->json('prize_info')->nullable(false)->comment('奖项内容');
            $table->unsignedBigInteger('total_count')->nullable(false)->comment('总抽奖次数');
            $table->unsignedBigInteger('total_win_count')->nullable(false)->comment('总中奖次数');
            $table->unsignedBigInteger('count_date')->nullable(false)->comment('统计日期');
            $table->primary(['prize_id', 'count_date']);
            $table->index('total_win_count');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lottery_result_count');
    }
}
