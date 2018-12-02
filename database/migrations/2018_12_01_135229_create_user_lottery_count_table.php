<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserLotteryCountTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_lottery_count', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->string('mobile', 12)->nullable(false)->comment('抽奖手机号');
            $table->unsignedTinyInteger('total_count')->nullable(false)->comment('总抽奖次数');
            $table->unsignedTinyInteger('total_win_count')->nullable(false)->comment('总中奖次数');
            $table->unsignedBigInteger('count_date')->nullable(false)->comment('统计日期');
            $table->primary(['mobile', 'count_date']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_lottery_count');
    }
}
