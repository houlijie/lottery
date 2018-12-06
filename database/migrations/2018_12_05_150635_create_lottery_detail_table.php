<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLotteryDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lottery_detail', function (Blueprint $table) {
            $table->unsignedBigInteger('prize_id')->nullable(false)->comment('奖项id');
            $table->string('prize_name')->nullable(false)->comment('奖项名称');
            $table->unsignedBigInteger('rate')->nullable(false)->comment('中奖率（正整数，总和为100）');
            $table->unsignedBigInteger('total_stock')->nullable(false)->comment('总库存');
            $table->unsignedBigInteger('stock')->nullable(false)->comment('库存');
            $table->unsignedBigInteger('lottery_date')->nullable(false)->comment('抽奖日期');
            $table->primary(['prize_id', 'lottery_date']);
            $table->index('stock');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lottery_detail');
    }
}
