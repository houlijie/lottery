!function r(c,i,s){function u(t,e){if(!i[t]){if(!c[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(a)return a(t,!0);throw new Error("Cannot find module '"+t+"'")}var o=i[t]={exports:{}};c[t][0].call(o.exports,function(e){var n=c[t][1][e];return u(n||e)},o,o.exports,r,c,i,s)}return i[t].exports}for(var a="function"==typeof require&&require,e=0;e<s.length;e++)u(s[e]);return u}({1:[function(e,n,t){"use strict";var o,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};o=function(){return function(e,n){return n||(n=e,e=0),Math.round(Math.random()*(n-e)+e)}},"object"===(void 0===t?"undefined":r(t))&&void 0!==n?n.exports=o():"function"==typeof define&&define.amd?define(o):("object"!==Object.prototype.toString.call(window.zhf).slice(8,-1).toLowerCase()&&(window.zhf={}),window.zhf.randomNum=o())},{}],2:[function(e,n,t){"use strict";var o,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};o=function(){return function(e){var n=e.length,r=0,c=[];return 0!==n&&(e[0].forEach(function(e){c.push([e])}),function e(t){if(++r<n){var o=[];c.forEach(function(n){t[r].forEach(function(e){o.push(n.concat(e))})}),c=o,e(t)}}(e)),c}},"object"===(void 0===t?"undefined":r(t))&&void 0!==n?n.exports=function(e){var n=e.length,r=0,c=[];return 0!==n&&(e[0].forEach(function(e){c.push([e])}),function e(t){if(++r<n){var o=[];c.forEach(function(n){t[r].forEach(function(e){o.push(n.concat(e))})}),c=o,e(t)}}(e)),c}:"function"==typeof define&&define.amd?define(o):("object"!==Object.prototype.toString.call(window.zhf).slice(8,-1).toLowerCase()&&(window.zhf={}),window.zhf.sku=function(e){var n=e.length,r=0,c=[];return 0!==n&&(e[0].forEach(function(e){c.push([e])}),function e(t){if(++r<n){var o=[];c.forEach(function(n){t[r].forEach(function(e){o.push(n.concat(e))})}),c=o,e(t)}}(e)),c})},{}],3:[function(e,n,t){"use strict";function r(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}e("zhf.random-num");var w=e("zhf.sku");new(function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.init()}var n,t,o;return n=e,(t=[{key:"init",value:function(){var c=document.querySelectorAll(".prize-item"),i=document.querySelector(".lamp"),s=document.querySelector(".handle"),u=$(".btn-remainder-num"),n=$(".message"),a=$(".luck"),l=$(".luck-gift"),f=$(".btn"),e=$(".transparent"),t=$(".tel"),o=$(".rule"),d=3,m=null,h=!1,r=w([[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]]);function p(){e.addClass("transparent_show")}function y(){e.removeClass("transparent_show")}function v(e){n.addClass("message_show"),n.find(".message-info").html(e),clearTimeout(v.timer),v.timer=setTimeout(function(){b()},3e3)}function b(){n.removeClass("message_show")}r.forEach(function(e,n,t){e[0]===e[1]&&e[0]===e[2]&&t.splice(n,1)}),$(".rule-btn").on("click",function(){o.addClass("rule_show")}),$(".rule-close").on("click",function(){o.removeClass("rule_show")}),$(".handle-btn,.btn").on("click",function(){0!==d?/1\d{10}/.test(t.val())?(setTimeout(function(){s.classList.remove("handle_selected1"),s.classList.add("handle_selected2")},200),setTimeout(function(){s.classList.remove("handle_selected2"),s.classList.add("handle_selected3")},400),p(),h||(h=!0,$.ajax({url:"/luck-draw_scroll/dist/views/index.html",method:"get",data:{tel:t.val()},success:function(e){if(0===d)return v("您今天的抽奖次数用完了!"),h=!1,void y();for(var t,o,n=[],r=0;r<3;r++)n.push(3);t=n,o=d,c.forEach(function(e,n){e.style.backgroundPosition="0 ".concat(-(15*(3-o+1)*667.5+133.5*(t[n]-1))/37.5+"rem")}),m=setInterval(function(){i.classList.toggle("lamp_selected")},80),setTimeout(function(){h=!1,y(),f.addClass("btn_active"),a.addClass("luck_show"),p(),l.html("开业好礼"),clearInterval(m),i.classList.remove("lamp_selected"),s.classList.remove("handle_selected3"),s.classList.add("handle_selected2"),setTimeout(function(){s.classList.remove("handle_selected2"),s.classList.add("handle_selected1")},200)},3400),d--,u.html(d)}}))):v("请输入正确的11位手机号码!"):v("您今天的抽奖次数用完了!")}),$(".message-close").on("click",function(){b()}),$(".luck-close").on("click",function(){a.removeClass("luck_show"),y()})}}])&&r(n.prototype,t),o&&r(n,o),e}())},{"zhf.random-num":1,"zhf.sku":2}]},{},[3]);