/**
 * Created by GZXS on 2016/6/24.
 */
XS.Login = {};
var xs_Username;
var xs_Password;
//用户登陆
XS.Login.login = function(){
    $("#xs_msg").empty();

    xs_Username = $("#xs_username").val();
    xs_Password = $("#xs_pwd").val();
    if(XS.StrUtil.isEmpty(xs_Username)){
        $("#xs_username").attr("placeholder","用户名不能为空");
        return false;
    }
    if(XS.StrUtil.isEmpty(xs_Password)){
        $("#xs_pwd").attr("placeholder","密码不能为空");
        return false;
    }


    xs_Username = xs_Username.trim();
    xs_Password = xs_Password.trim();
    //登陆
    /* data = {
        userid: "admin",
        password:'xxgcxyadmin' //
    }*/
  //  sessionStorage.setItem("username", xs_Username);
  //  sessionStorage.setItem("password", xs_Password);
    //加载主页
  //  XS.Index.loadMain();
    XS.CommonUtil.loadProgressCircleTag($(document.body), "xs_load_container");
    XS.CommonUtil.showLoader();
    var data ={userid:xs_Username, password:hex_md5(xs_Password)};
    //QuerySysUserByload
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QuerySysUserByload_Super", data, function(json){
        //解析返回数据
        XS.CommonUtil.hideLoader();
        if(json && json.success && json.regionid){

            sessionStorage.setItem("%%", CryptoJS.AES.encrypt(xs_Username, "@#$$$$$"));
          //  sessionStorage.setItem("@#$%", CryptoJS.AES.encrypt(xs_Password, "@#&&&$$$"));

            //sessionStorage.setItem("userid", json.userid);
            //sessionStorage.setItem("@#$", (json.regionid).trim());
            sessionStorage.setItem("@#$", CryptoJS.AES.encrypt((json.regionid).trim(), "@##*$$"));
            //加载主页
            XS.Index.loadMain();
        }else{
            $("#xs_msg").empty().append("用户名或密码有误！");
        }
    }, function(XMLHttpRequest, status){
        if(status && status=='timeout'){ //超时,status还有success,error等值的情况
            XS.CommonUtil.hideLoader();
            $("#xs_msg").append("服务器异常！");

            //sessionStorage.setItem("username", 'admin');
            //sessionStorage.setItem("password", 'admin');
           // XS.Index.loadMain();
        }
    });
}

//用户退出
XS.Login.logout = function(){
    sessionStorage.removeItem("%%");
    sessionStorage.removeItem("@#$%");
    sessionStorage.removeItem("@#$");
    //window.location.href = XS.Constants.host+"view/index.html";
    //window.location.href = XS.Constants.host+"view/index.html";
    window.location.href = window.location.toString().substring(0,window.location.toString().lastIndexOf("/view")+1) +"index.html";
}