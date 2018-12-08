<!doctype html>
<html lang="en">
    <head>
        <!-- 字符编码 -->
        <meta charset="UTF-8">
        <!-- 窗口宽度等于设备宽度以及禁止缩放(手机) -->
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <!-- 是否需要默认的工具栏和菜单栏(手机, safari浏览器, 默认值yes, 需要) -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <!-- 控制状态栏的样式(手机, safari浏览器, 黑色) -->
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <!-- 禁止把数字转化为电话号码(手机, safari浏览器) -->
        <meta name="format-detection" content="telephone=no">
        <!-- 禁止浏览器自动放大字体(手机, uc浏览器) -->
        <meta name="wap-font-scale" content="no">
        <!-- uc浏览器强制竖屏(手机, uc浏览器) -->
        <meta name="screen-orientation" content="portrait">
        <!-- qq浏览器强制竖屏(手机, qq浏览器) -->
        <meta name="x5-orientation" content="portrait">
        <!-- 让ie以最高级模式渲染文档(ie浏览器) -->
        <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
        <!-- 启用360浏览器的极速模式(360浏览器) -->
        <meta name="renderer" content="webkit">
        <!-- 搜索引擎抓取 -->
        <meta name="robots" content="index, follow">
        <!-- 页面关键词 -->
        <meta name="keywords" content="zhouhuafei, 周华飞">
        <!-- 页面描述 -->
        <meta name="description" content="zhouhuafei, 周华飞">
        <!-- 页面作者 -->
        <meta name="author" content="zhouhuafei, 周华飞, 1123486116@qq.com">
        <!-- 页面标题 -->
        <title>抽奖</title>
        <link rel="stylesheet" href="css/index.css">
    </head>
    <body>
        <div class="g-wrap">
            <script>
                (function (win, doc) {
                    function isPc() {
                        var userAgentInfo = navigator.userAgent;
                        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
                        var flag = true;
                        for (var v = 0; v < Agents.length; v++) {
                            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                                flag = false;
                                break;
                            }
                        }
                        return flag;
                    }

                    function resize() {
                        var html = doc.querySelector('html');
                        var wrap = doc.querySelector('.g-wrap');
                        if (isPc()) {
                            html.classList.add('g-pc');
                        } else {
                            html.classList.remove('g-pc');
                        }
                        html.style.fontSize = wrap.offsetWidth / 10 + 'px';
                    }

                    resize();
                    win.addEventListener('resize', resize);
                }(window, document));
            </script>
            <div class="prize">
                <div class="prize-item"></div>
                <div class="prize-item"></div>
                <div class="prize-item"></div>
            </div>
            <img class="logo" src="images/logo.png" alt="">
            <img class="scroll" src="images/scroll.png" alt="">
            <img class="lamp" src="images/lamp2.png" alt="">
            <div class="handle handle_selected1">
                <img class="handle-item" src="images/handle1.png" alt="">
                <img class="handle-item" src="images/handle2.png" alt="">
                <img class="handle-item" src="images/handle3.png" alt="">
            </div>
            <div class="handle-btn"></div>
            <input type="tel" class="tel" placeholder="请输入手机号">
            <div class="btn">
                <div class="btn-text">试试手气</div>
                <div class="btn-remainder">(剩余<span class="btn-remainder-num">3</span>次机会)</div>
            </div>
            <div class="rule-btn"></div>
            <div class="rule">
                <img class="rule-img" src="images/rule.png" alt="">
                <div class="rule-close"></div>
            </div>
            <div class="transparent"></div>
            <div class="message">
                <div class="message-close"></div>
                <div class="message-info">请输入正确的11位手机号码</div>
            </div>
            <div class="luck">
                <div class="luck-close"></div>
                <div class="luck-title">恭喜您</div>
                <div class="luck-title">获得&#60;<span class="luck-gift"></span>&#62;一份</div>
                <div class="luck-content">
                    <div>请您凭借此页截图</div>
                    <div>在截止日期前至指定地点兑换礼品</div>
                    <div>No.00001</div>
                </div>
            </div>
            <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
            <script src="js/index.js"></script>
        </div>
    </body>
</html>
