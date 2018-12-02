const randomNum = require('zhf.random-num');
const sku = require('zhf.sku');

function px2rem(px) {
    return px / 37.5 + 'rem';
}

class Game {
    constructor() {
        this.init();
    }

    init() {
        const domItems = document.querySelectorAll('.prize-item');
        const domLamp = document.querySelector('.lamp');
        const domHandle = document.querySelector('.handle');
        const $remainderNum = $('.btn-remainder-num');
        const $message = $('.message');
        const $luck = $('.luck');
        const $luckGift = $('.luck-gift');
        const $btn = $('.btn');
        const $transparent = $('.transparent');
        const $tel = $('.tel');
        const $rule = $('.rule');
        const prizeH = 267 / 2; // 一个奖品的高度
        const prizeNum = 5; // 奖品数量
        const prizeAllH = prizeH * prizeNum; // 奖品总高度
        const prizeScroll = 15; // 奖品滚动基数
        const handleMoveTime = 200; // 摇杆的动画间隔时间
        let remainder = 3; // 剩余抽奖次数
        let timer = null;
        let isClick = false; // 防止重复点击
        const noPrize = sku([[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]]);
        noPrize.forEach(function (v, i, a) {
            if (v[0] === v[1] && v[0] === v[2]) {
                a.splice(i, 1);
            }
        });
        $('.rule-btn').on('click', function () {
            $rule.addClass('rule_show');
        });
        $('.rule-close').on('click', function () {
            $rule.removeClass('rule_show');
        });
        $('.handle-btn,.btn').on('click', function () {
            if (remainder === 0) {
                messageShow('您今天的抽奖次数用完了!');
                return;
            }
            if (!(/1\d{10}/.test($tel.val()))) {
                messageShow('请输入正确的11位手机号码!');
                return;
            }
            transparentShow(); // 防止抽奖的时候点击到其他区域(也可以防止重复点击试试手气)。如果滚动中可以点击其他区域，则就注释掉这里以及下面的两处transparentHide()。
            if (!isClick) {
                isClick = true; // 防止重复点击试试手气，此处和transparentShow()功能重叠了，没删掉的原因是担心不需要transparentShow()这个功能。
                $.ajax({
                    url: '/lottery/getPrize',
                    method: 'get',
                    data: {
                        mobile: $tel.val(),
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (response.status === 'failure') {
                            messageShow(response.message);
                            isClick = false;
                            transparentHide();
                            return;
                        }
                        const prizeInfo = response.prizeInfo;
                        const level = prizeInfo.prize_id;
                        const levelName = prizeInfo.prize_name;
                        remainder = response.left_lottery_count;
                        let levelResult = [];
                        if (level === 0) { // 没中奖
                            const noPrizeRandomOne = noPrize[randomNum(0, noPrize.length - 1)];
                            levelResult = levelResult.concat(noPrizeRandomOne);
                        } else {
                            for (let i = 0; i < 3; i++) {
                                levelResult.push(level);
                            }
                        }
                        fnHandleMove();
                        setTimeout(function () {
                            selected(levelResult, remainder);
                            fnLampMove();
                            setTimeout(function () {
                                isClick = false;
                                transparentHide();
                                fnLampStop();
                                fnHandleStop();
                                $remainderNum.html(remainder);
                                $btn.addClass('btn_active');
                                if (level === 0) { // 未中奖
                                    messageShow('未中奖!');
                                } else {
                                    luckShow();
                                    $luckGift.html(levelName);
                                }
                            }, 3400);
                        }, 200);
                    },
                });
            }
        });
        $('.message-close').on('click', function () {
            messageHide();
        });
        $('.luck-close').on('click', function () {
            luckHide();
        });

        function luckShow() {
            $luck.addClass('luck_show');
            transparentShow();
        }

        function luckHide() {
            $luck.removeClass('luck_show');
            transparentHide();
        }

        function transparentShow() {
            $transparent.addClass('transparent_show');
        }

        function transparentHide() {
            $transparent.removeClass('transparent_show');
        }

        function messageShow(text) {
            $message.addClass('message_show');
            $message.find('.message-info').html(text);
            clearTimeout(messageShow.timer);
            messageShow.timer = setTimeout(function () {
                messageHide();
            }, 3000);
        }

        function messageHide() {
            $message.removeClass('message_show');
        }

        function selected(levelResult, remainder) {
            domItems.forEach(function (v, i) {
                v.style.backgroundPosition = `0 ${px2rem(-((3 - remainder + 1) * prizeScroll * prizeAllH + prizeH * (levelResult[i] - 1)))}`;
            });
        }

        function fnLampMove() {
            timer = setInterval(function () {
                domLamp.classList.toggle('lamp_selected');
            }, 80);
        }

        function fnLampStop() {
            clearInterval(timer);
            domLamp.classList.remove('lamp_selected');
        }

        function fnHandleMove() {
            domHandle.classList.remove('handle_selected1');
            domHandle.classList.add('handle_selected2');
            setTimeout(function () {
                domHandle.classList.remove('handle_selected2');
                domHandle.classList.add('handle_selected3');
            }, handleMoveTime);
        }

        function fnHandleStop() {
            domHandle.classList.remove('handle_selected3');
            domHandle.classList.add('handle_selected2');
            setTimeout(function () {
                domHandle.classList.remove('handle_selected2');
                domHandle.classList.add('handle_selected1');
            }, handleMoveTime);
        }
    }
}

new Game();
