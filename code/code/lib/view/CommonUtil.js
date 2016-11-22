/**
 * Created by GZXS on 2016/6/24.
 */
//常用工具类
XS.CommonUtil = {};

/**
 * 在窗口窗口中添加加载条标签
 * @param jParentEle 父jquery元素
 * @param idTag 加载条的ID标签值
 */
XS.CommonUtil.loadProgressCircleTag = function (jParentEle, idTag){
    var loaderTag = '<div id="'+idTag+'" class="xs_load_container">'+
        '<div class="xs_l_spinner">'+
        '<div class="xs_l_spinner-container xs_l_container1">'+
        '<div class="xs_l_circle1"></div>'+
        '<div class="xs_l_circle2"></div>'+
        '<div class="xs_l_circle3"></div>'+
        '<div class="xs_l_circle4"></div>'+
        '</div>'+
        '<div class="xs_l_spinner-container xs_l_container2">'+
        '<div class="xs_l_circle1"></div>'+
        '<div class="xs_l_circle2"></div>'+
        '<div class="xs_l_circle3"></div>'+
        '<div class="xs_l_circle4"></div>'+
        '</div>'+
        '<div class="xs_l_spinner-container xs_l_container3">'+
        '<div class="xs_l_circle1"></div>'+
        '<div class="xs_l_circle2"></div>'+
        '<div class="xs_l_circle3"></div>'+
        '<div class="xs_l_circle4"></div>'+
        '</div>'+
        '</div>'+
        '</div>';
    jParentEle.append(loaderTag);
}

//-------------------------------------------------------------------------------


//显示模糊进度UI
XS.CommonUtil.showLoader = function(){
    $("#xs_load_container").css({
        "display":"block"
    });
}

//隐藏模糊进度UI
XS.CommonUtil.hideLoader = function(){
    $("#xs_load_container").css({
        "display":"none"
    });
}

//ajax请求数据
XS.CommonUtil.ajaxHttpReq = function(url, action, data, succCallback, failCallback){
    $.ajax({
        type: "get",
        async: false,
        timeout:10*1000,
        url: url + "/" + action+ "?jsoncallback=?",
        dataType: "jsonp",
        data:data,
        success: succCallback,
        error: failCallback
    });
}

/**
 * 格式化数字，用逗号分隔
 * @param s 数字字符串
 * @param n 保留小数位数
 * @returns {string}
 */
XS.CommonUtil.formatNumber = function(s, n){
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for(i = 0; i < l.length; i ++ )
    {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

/**
 * 格式化字符串格式化为数字
 * @param s
 * @returns {*}
 */
XS.CommonUtil.rformatNumber = function(s){
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
}

// 获取范围内的随机数
// min - 范围下限
// max - 范围上限
// decimalNum - 返回结果的小数位数。如果为 0，返回整数。
XS.CommonUtil.getRandomNumber = function (min, max, decimalNum){
    var rNum = min+Math.random()*(max-min);
    return parseFloat(rNum).toFixed(decimalNum);
}

/**
 * 打开Dialog
 * @param id
 * @param title
 * @param iconCls
 * @param content
 * @param width
 * @param height
 * @param left
 * @param top
 * @param closeCallback
 */
XS.CommonUtil.openDialog = function(id, title, iconCls, content, resizable, maximizable, modal, width, height, left, top, closeCallback, maximizeCallback, minimizeCallback,restoreCallback){
    XS.CommonUtil.closeDialog(id);
    var divTag = "<div id="+id+"></div>";
    $("#xs_mainC").append(divTag);
    var $_dl = $('#' + id);
    $_dl.dialog({
        title: XS.StrUtil.isEmpty(title)?"":title,
        width: width,
        height: height,
        left:left,
        top:top,
        closed: true,
        maximizable:maximizable,
        onRestore:restoreCallback,
        modal:modal,
        shadow:false,
        resizable:resizable,
        iconCls:XS.StrUtil.isEmpty(iconCls)?"":iconCls,
        cache: false,
        content:XS.StrUtil.isEmpty(content)?"":content,
        onClose:closeCallback,
        onMaximize:maximizeCallback,
        onMinimize:minimizeCallback
    }).dialog('open');
}

/**
 * 关闭窗口
 * @param id
 */
XS.CommonUtil.closeDialog = function(id){
    if(document.getElementById(id)){
        if(id == "xs_main_detail"){
            $('#'+id).dialog("destroy");
        }else{
            try{
                $('#'+id).dialog("close");
            }catch (e){};
            $('#'+id).remove();
        }
    }
}

//弹出信息
XS.CommonUtil.showMsgDialog = function(title, content){
    $.messager.show({
        title:XS.StrUtil.isEmpty(title)?"温馨提示":title,
        closable: false,
        msg:content,
        timeout:700,
        showType:'fade',
         style:{
             right:'',
             bottom:''
         }
    });
}

/**
 * 关闭弹出窗口
 */
var xs_map_infoWin = null;
XS.CommonUtil.closeMapInfoWin = function(){
    if(xs_map_infoWin){
        try{
            xs_map_infoWin.hide();
            xs_map_infoWin.destroy();
        }
        catch(e){}
    }
};

/**
 * 打开弹出窗口
 * @param feature
 * @param contentHTML
 */
XS.CommonUtil.openMapInfoWin = function(mapObj, feature, contentHTML){
    XS.CommonUtil.closeMapInfoWin();
    var geo = feature.geometry;
    var bounds = geo.getBounds();
    var center = bounds.getCenterLonLat();
    var popup = XS.PopupUtil.createPopupFramedCloud(mapObj, "popwin", new SuperMap.LonLat(center.lon,center.lat), null, contentHTML, true);
    feature.popup = popup;
    xs_map_infoWin = popup;
    return popup;
};

/**
 * 日期格式化
 * @param date
 * @returns {string}
 */
XS.CommonUtil.dateFormatter = function (date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}

/**
 * 日期解析器
 * @param s
 * @returns {Date}
 */
XS.CommonUtil.dateParser = function(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}

//全屏模式
XS.CommonUtil.fullScreen = function() {
    var el = document.documentElement,
        rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
        wscript;

    if(typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }

    if(typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if(wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}

//退出全屏
XS.CommonUtil.exitFullScreen = function() {
    var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript;
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
    }
    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{Esc}");
        }
    }
}