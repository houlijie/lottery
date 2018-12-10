(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};!function(o,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):("object"!==Object.prototype.toString.call(window.zhf).slice(8,-1).toLowerCase()&&(window.zhf={}),window.zhf.randomNum=t())}(0,function(){return function(o,t){return t||(t=o,o=0),Math.round(Math.random()*(t-o)+o)}});
},{}],2:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};!function(o,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):("object"!==Object.prototype.toString.call(window.zhf).slice(8,-1).toLowerCase()&&(window.zhf={}),window.zhf.sku=t())}(0,function(){return function(o){var t=o.length,n=0,e=[];return 0!==t&&(o[0].forEach(function(o){e.push([o])}),function o(f){if(++n<t){var i=[];e.forEach(function(o){f[n].forEach(function(t){i.push(o.concat(t))})}),e=i,o(f)}}(o)),e}});
},{}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var randomNum = require('zhf.random-num');

var sku = require('zhf.sku');

function px2rem(px) {
  return px / 37.5 + 'rem';
}

var Game =
/*#__PURE__*/
function () {
  function Game() {
    _classCallCheck(this, Game);

    this.init();
  }

  _createClass(Game, [{
    key: "init",
    value: function init() {
      var domItems = document.querySelectorAll('.prize-item');
      var domLamp = document.querySelector('.lamp');
      var domHandle = document.querySelector('.handle');
      var $remainderNum = $('.btn-remainder-num');
      var $message = $('.message');
      var $luck = $('.luck');
      var $luckGift = $('.luck-gift');
      var $luckNum = $('.luck-num');
      var $btn = $('.btn');
      var $transparent = $('.transparent');
      var $tel = $('.tel');
      var $rule = $('.rule');
      var prizeH = 267 / 2; // 一个奖品的高度

      var prizeNum = 5; // 奖品数量

      var prizeAllH = prizeH * prizeNum; // 奖品总高度

      var prizeScroll = 15; // 奖品滚动基数

      var handleMoveTime = 200; // 摇杆的动画间隔时间

      var remainder = 3; // 剩余抽奖次数

      var timer = null;
      var isClick = false; // 防止重复点击

      var noPrize = sku([[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]]);
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
      $('.handle-btn,.btn').on('click', function (ev) {
        ev.stopPropagation();

        if (remainder === 0) {
          messageShow('留一点运气，明天再来吧!');
          return;
        }

        if (!/1\d{10}/.test($tel.val())) {
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
              mobile: $tel.val()
            },
            dataType: 'json',
            success: function success(response) {
              if (response.status === 'failure') {
                messageShow(response.message);
                isClick = false;
                transparentHide();
                return;
              }

              var no = response.no;
              var prizeInfo = response.prizeInfo;
              var level = prizeInfo.prize_id;
              var levelName = prizeInfo.prize_name;
              remainder = response.left_lottery_count;
              var levelResult = [];

              if (level === 0) {
                // 没中奖
                var noPrizeRandomOne = noPrize[randomNum(0, noPrize.length - 1)];
                levelResult = levelResult.concat(noPrizeRandomOne);
              } else {
                for (var i = 0; i < 3; i++) {
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

                  if (level === 0) {
                    // 未中奖
                    messageShow('抱歉，未中奖!');
                  } else {
                    luckShow();
                    $luckGift.html(levelName);
                    $luckNum.html(no);
                  }
                }, 3400);
              }, 200);
            }
          });
        }
      });
      $(document).on('click', function () {
        messageHide();
      });
      $('.message-close').on('click', function () {
        messageHide();
      });
      $('.luck-close').on('click', function () {
        luckHide();
      });
      $tel.on('focus', function () {
        this.scrollIntoViewIfNeeded();
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
        if ($message.hasClass('message_show')) {
          return;
        }

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
          v.style.backgroundPosition = "0 ".concat(px2rem(-((3 - remainder + 1) * prizeScroll * prizeAllH + prizeH * (levelResult[i] - 1))));
        });
      }

      function fnLampMove() {
        timer = setInterval(function () {
          domLamp.classList.toggle('lamp_selected');
        }, 160);
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
  }]);

  return Game;
}();

new Game();
},{"zhf.random-num":1,"zhf.sku":2}]},{},[3])