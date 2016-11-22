/**
 * Created by GZXS on 2016/6/15.
 */
(function(){
    var isWinRT = (typeof Windows === "undefined") ? false : true;
    var r = new RegExp("(^|(.*?\\/))(Lib.Include\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'),
        src, m, baseurl = "";
    for(var i=0, len=s.length; i<len; i++) {
        src = s[i].getAttribute('src');
        if(src) {
            var m = src.match(r);
            if(m) {
                baseurl = m[1];
                break;
            }
        }
    }
    function inputScript(inc,is_async){
        if (!isWinRT) {
            var async = "";
            if(is_async){
                async = " async='async'";
            }
            var script = '<' + 'script type="text/javascript" src="' + inc + '"' +async +'><' + '/script>';
            document.writeln(script);
        } else {
            var script = document.createElement("script");
            script.src = inc;
            if(is_async){
                script.async = "async";
            }
            document.getElementsByTagName("HEAD")[0].appendChild(script);
        }
    }
    function inputCSS(style){
        if (!isWinRT) {
            var css = '<' + 'link rel="stylesheet" href="' + baseurl + style + '"' + '><' + '/>';
            document.writeln(css);
        } else {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = style;
            document.getElementsByTagName("HEAD")[0].appendChild(link);
        }
    }
    //加载类库资源文件
    function loadLibs() {

        inputCSS("./base/easyui/themes/material/easyui.css");
        inputCSS("./base/easyui/themes/icon.css");
        inputCSS("./base/easyui/themes/extend-icon.css");
        inputCSS("./base/easyui/themes/color.css");
        inputCSS("./css/init.css");
        inputCSS("./css/ui_loader.css");

        inputScript('./base/easyui/jquery.easyui-1.4.3.min.js',false);
        inputScript('./base/easyui/locale/easyui-lang-zh_CN.min.js',false);
        inputScript('./base/other/enc.js',false);
        inputScript('./base/other/aes.js',false);

        inputScript('./lib/StrUtil.js',false);
        inputScript('./lib/view/CommonUtil.js',false);
        inputScript('./lib/view/login.js',false);
    }
    loadLibs();
})();

$(function(){
    $("#xs_msg").empty();
    $(".xs_login").click(function(){
        XS.Login.login();
    });
    $(document).keypress(function(e) {
        if(e.which == 13) {
            XS.Login.login();
        }
    });
});

//主要完成用户登陆操作
XS.Index = {};
//加载主页
XS.Index.loadMain = function(){
    window.location.href = window.location.toString().substring(0,window.location.toString().lastIndexOf("/")+1) +"view/main.html";
}

