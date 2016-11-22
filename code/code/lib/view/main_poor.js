/**
 * Created by GZXS on 2016/7/1.
 */
//贫困户口
XS.Main.Poor = {};

//通过用户ID查询户详细信息
XS.Main.Poor.showPoor = function(id,centerPointer){
    XS.CommonUtil.showLoader();
    var data = {Hid: id};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTempHouseNinfoByHId", data, function (json) {
        XS.CommonUtil.hideLoader();
        if (json && json.length>0) {
            json[0].xt_ctype =  XS.Main.ClusterPointerStyle.poor_info_obj;
            json[0].name =  json[0].HHNAME;
            json[0].reason =  json[0].MAIN_REASON;
            json[0].hid =  json[0].PB_HHID;

            if(!json[0].LONGITUDE || !json[0].LATITUDE){
                json[0].LONGITUDE = centerPointer.lon + (Math.random()>0.5 ? 1 : -1) * Math.random() * 0.002;
                json[0].LATITUDE = centerPointer.lat + (Math.random()>0.5 ? 1 : -1) * Math.random() * 0.002;
            }

            xs_MapInstance.getMapObj().setCenter(new SuperMap.LonLat(json[0].LONGITUDE, json[0].LATITUDE), 10);
            var isEqual = false;
            for(var i in XS.Main.poorZonePicArr.poor){
                if(XS.Main.poorZonePicArr.poor[i].name == json[0].reason){
                    isEqual = true;
                    xs_clickPoorLegendArr = [json[0].reason];
                    break;
                }
            }
            if(!isEqual){
                xs_clickPoorLegendArr = ['其它'];
                json[0].reason = '其它';
            }
            //XS.Main.addVectorPoint2ClusterLayer(json, XS.Main.ClusterPointerStyle.poor_info_obj);
            XS.Main.readyAddMarkerData(json);
        }else{
            xs_isClickMapFinish = true;
            XS.CommonUtil.hideLoader();
            XS.CommonUtil.showMsgDialog("","未找到相关数据");
        }
    },function(e){
        XS.CommonUtil.hideLoader();
        XS.CommonUtil.showMsgDialog("","数据请求失败");
    });
}

//显示贫困用户
XS.Main.Poor.showPoors = function(objArr,centerPointer){
    xs_markerLayer.clearMarkers();
    xs_markerLayer.setVisibility(false);
    XS.Main.Poor.clearRelocationLayer();
    if(objArr&&objArr.length>0){
        var dataArr = [];
        for(var i in objArr){
            var lng = 0;
            var lat = 0;
            if(!objArr[i].lng || !objArr[i].lat){
                lng = centerPointer.lon + (Math.random()>0.5 ? 1 : -1) * Math.random() * 0.004;
                lat = centerPointer.lat + (Math.random()>0.5 ? 1 : -1) * Math.random() * 0.004;
            }else{
                lng = objArr[i].lng;
                lat = objArr[i].lat;
            }
            var isEqual = false;
            for(var j in XS.Main.poorZonePicArr.poor){
                if(XS.Main.poorZonePicArr.poor[j].name == objArr[i].reason){
                    isEqual = true;
                    break;
                }
            }
            if(!isEqual){
                objArr[i].reason = '其它';
            }
            dataArr.push({LONGITUDE:lng, LATITUDE:lat, hid:objArr[i].id, name:objArr[i].name,reason:objArr[i].reason,xt_ctype:XS.Main.ClusterPointerStyle.poor_info_id});
        }
        //xs_MapInstance.getMapObj().setCenter(new SuperMap.LonLat(objArr[0].Longitude, objArr[0].Latitude), 11);
        xs_clickPoorLegendArr =[];
        XS.Main.readyAddMarkerData(dataArr);
        //XS.Main.addVectorPoint2ClusterLayer(dataArr, XS.Main.ClusterPointerStyle.poor_info_id);

       //S.Main.addMarkers2Layer = function(dataArr, lonKey, latKey, iconUriKey, iconW, iconH, type);
    }
}
/**
 * 添加marker标记前的数据处理
 * @param objArr
 * @param type
 */
XS.Main.readyAddMarkerData = function(objArr){
    //XS.Main.clearMap();
    //XS.Main.Poor.clearRelocationLayer();
    xs_isShowUtfGridTip = false;
    //xs_clusterLayer.destroyCluster();
    //xs_clusterControl.activate();
    if(!(objArr&&objArr.length>0)){
        return;
    }

    if(document.getElementById("xs_tjfx_range_Legend")){
        $("#xs_tjfx_range_Legend").remove();
    }
    $("#xs_mainC").append(XS.Main.Tjfx.range_createRangeLegendTag(XS.Main.Tjfx.type.poorType,XS.Main.ZoneLevel.village));
    $("#xs_tjfx_range_Legend").css("display", "block");

    if(xs_clickPoorLegendArr.length == 0){
        $(".poorLegendItemRow").css({background:"#eee"});
        XS.Main.Poor.legendRowHover($(".poorLegendItemRow"),"#ddd","#eee");
    }else if(xs_clickPoorLegendArr.length == 1){
        for(var i in XS.Main.poorZonePicArr.poor){
            if(XS.Main.poorZonePicArr.poor[i].name == xs_clickPoorLegendArr[0]){
                $(".poorLegendItemRow").eq(i).css({background:"#eee"});
                XS.Main.Poor.legendRowHover($(".poorLegendItemRow").eq(i),"#ddd","#eee");
                break;
            }
        }
    }
    var geotextFeatures = [];
    var dataArr = [];
    for(var i=0; i<objArr.length; i++)
    {
        var obj = objArr[i];
        var iconUrl = "";
        for(var j in XS.Main.poorZonePicArr.poor){
            if(XS.Main.poorZonePicArr.poor[j].name == obj.reason){
                iconUrl = XS.Main.poorZonePicArr.poor[j].value;
                break;
            }
        }
        obj.xs_p_icon =  iconUrl;
        dataArr.push(obj);

        var geoText = new SuperMap.Geometry.GeoText(obj.LONGITUDE, obj.LATITUDE, obj.name);
        var geotextFeature = new SuperMap.Feature.Vector(geoText);
        geotextFeatures.push(geotextFeature);

    }
    xs_poorLabelLayer.addFeatures(geotextFeatures);
    xs_poorLabelLayer.setVisibility(true);
    //xs_clusterLayer.addFeatures(features);
    XS.Main.addMarkers2Layer(dataArr, "LONGITUDE", "LATITUDE", "xs_p_icon", 25, 25, 3);


    var isFirstClick = true;
    $(".poorLegendItemRow").click(function (e) {
        var onlyReasonClick = $(this).children()[0].innerHTML;
        if(isFirstClick){
            isFirstClick = false;
            if(xs_clickPoorLegendArr.length != 1){
                $(".poorLegendItemRow").css({background:"#fff"});
                XS.Main.Poor.legendRowHover($(".poorLegendItemRow"),"#ddd","#fff");
            }
        }
        var isHaveReason = false;
        for (var i in xs_clickPoorLegendArr) {
            if (onlyReasonClick == xs_clickPoorLegendArr[i]) {
                isHaveReason = true;
                xs_clickPoorLegendArr.splice(i, 1);
                $(this).css({background:"#fff"});
                XS.Main.Poor.legendRowHover($(this),"#ddd","#fff");
                break;
            }
        }
        if (!isHaveReason) {
            xs_clickPoorLegendArr.push(onlyReasonClick);
            $(this).css({background:"#eee"});
            XS.Main.Poor.legendRowHover($(this),"#ddd","#eee");
        }

        var clickPoorLegendLabels = [];
        var clickPoorLegendMarkers = [];
        for (var i in xs_clickPoorLegendArr) {
            for (var j in dataArr) {
                if (xs_clickPoorLegendArr[i] == dataArr[j].reason) {
                    clickPoorLegendMarkers.push(dataArr[j]);

                    var geoText = new SuperMap.Geometry.GeoText(dataArr[j].LONGITUDE, dataArr[j].LATITUDE, dataArr[j].name);
                    var geotextFeature = new SuperMap.Feature.Vector(geoText);
                    clickPoorLegendLabels.push(geotextFeature);
                }
            }

        }
        xs_poorLabelLayer.removeAllFeatures();
        xs_poorLabelLayer.addFeatures(clickPoorLegendLabels);
        //xs_poorLabelLayer.setVisibility(true);
        XS.Main.addMarkers2Layer(clickPoorLegendMarkers, "LONGITUDE", "LATITUDE", "xs_p_icon", 25, 25, 3);
    });
}

//点击聚散点--查看贫困户的基本信息
XS.Main.Poor.clickClusterCallback = function(obj){
    xs_isShowUtfGridTip = false;
    /*if(obj.xt_ctype==XS.Main.ClusterPointerStyle.poor_info_obj){
        XS.Main.Poor.showPoorInfo(obj);
    }else if(obj.xt_ctype==XS.Main.ClusterPointerStyle.poor_info_id){
        XS.CommonUtil.showLoader();
        var data = {Hid: obj.hid};
        XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTempHouseNinfoByHId", data, function (json) {
            XS.CommonUtil.hideLoader();
            if (json && json.length>0) {
                XS.Main.Poor.showPoorInfo(json[0]);
            }
        },function(e){XS.CommonUtil.hideLoader();});
    }*/
    XS.CommonUtil.showLoader();
    var data = {Hid: obj.hid};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTempHouseNinfoByHId", data, function (json) {
        XS.CommonUtil.hideLoader();
        if (json && json.length>0) {
            json[0].LONGITUDE = obj.LONGITUDE;
            json[0].LATITUDE = obj.LATITUDE;
            XS.Main.Poor.showPoorInfo(json[0]);
        }
    },function(e){XS.CommonUtil.hideLoader();});
}

//显示户基本信息
XS.Main.Poor.showPoorInfo = function(obj){
    var content =
        '<div style="width: 250px; height: 100%; display: inline-block;">' +
            '<table id="xs_poor_datagrid" class="easyui-propertygrid" style="width:100%;height:184px; display: inline-block;"></table>' +
        '</div>' +
        '<div style="width: 135px; height: 100%;display: inline-block; vertical-align: top;text-align: center;">' +
            '<div style="width: 120px; height: 170px; box-shadow: 0px 0px 100px 5px rgba(0, 0, 0, 0.5); border: 4px solid rgba(125,135,18,0.3); margin:auto;margin-top: 5px; background: rgba(128, 128, 128, 0.29);">' +
                '<img src="" id="xs_poor_header" style="width: 100%; height: 100%; background-color: #000000; color:#ffffff;" alt="">' +
            '</div>' +
        '</div>';
    //id, title, iconCls, content, resizable, maximizable, modal, width, height, left, top, closeCallback, maximizeCallback, minimizeCallback
    XS.CommonUtil.openDialog("xs_poor_info", obj.HHNAME, "icon-man", content, false, false, false, null, 225,window.outerWidth/2.0);
    var jsonObj = [
        {"name":"户编号","value":obj.PB_HHID},
        {"name":"户主姓名","value":obj.HHNAME},
        {"name":"电话","value":obj.PHONE},
        {"name":"贫困类型","value":obj.PTYPE},
        {"name":"致贫原因","value":obj.MAIN_REASON},
        {"name":"人口","value":obj.POP}
        /*{"name":"主要原因","value":obj.MAIN_REASON},
        {"name":"次要原因","value":obj.OTHER_REASON},
        {"name":"脱贫状态","value":obj.OUTPOORTAT},
        {"name":"贫困标准","value":obj.PSTANDARD},
        {"name":"采访人","value":obj.MODITOR},
        {"name":"采访日期","value":obj.MODIDATE},
        {"name":"消费用品","value":obj.CONSUMES},
        {"name":"道路情况","value":obj.A26},
        {"name":"燃料","value":obj.A30},
        {"name":"建房日期","value":obj.HOMEDATE},
        {"name":"房屋结构","value":obj.HOMESTRCTURE},
        {"name":"饮水方式","value":obj.WATERSTATE},
        {"name":"耕地面积","value":obj.PRODAREA},
        {"name":"市","value":obj.CITY},
        {"name":"县","value":obj.COUNTY},
        {"name":"乡","value":obj.TOWN},
        {"name":"村","value":obj.VILL},
        {"name":"组","value":obj.VGROUP}*/
    ];

    /*户 编 号:522424101030002
    户主姓名:徐思贵
    贫困类型:一般贫困户
    致贫原因:缺资金
    家庭人口:3 人*/

    $("#xs_poor_datagrid").propertygrid(
        {
            data: jsonObj,
            scrollbarSize: 0,
            showHeader:false,
            striped:true,
            columns:[[
                {field:'name',width:'25%'},
                {field:'value',width:'75%'}
            ]],
            toolbar: [
                {
                    iconCls: 'e_icon-picture',
                    text: '扶贫动态',
                    handler: function () {
                        XS.Main.Poor.helpDynamic(obj);
                    }
                },
               /* '-',
                {
                    iconCls: 'e_icon-film',
                    text: '责任监控',
                    handler: function () {
                        //XS.Main.Poor.playVideo(obj.PB_HHID,obj.HHNAME);
                       // XS.Main.Poor.show45State(obj.PB_HHID,obj.HHNAME);
                    }
                },*/
                '-',
                {
                    iconCls: 'icon-man',
                    text: '脱贫管理',
                    handler: function () {
                        XS.Main.Poor.show45State(obj.PB_HHID,obj.HHNAME);
                    }
                },
                '-',
                {
                    iconCls: 'icon-more',
                    text: '详情',
                    handler: function () {
                       // XS.CommonUtil.showMsgDialog("", "扶贫意见");
                        XS.Main.Poor.showPoorDetailInfo(obj);
                    }
                }
            ]
        });

    var data = {pdid: obj.PB_HHID};
    //获取贫困户头像
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryRegionFileByHeadid", data, function (json) {
        if (json && json.length>0)
        {
            $("#xs_poor_header").attr("src", json);
        }
    },function(e){});
}

//帮扶动态
XS.Main.Poor.helpDynamic = function(obj){
    var content = '<div id="xs_poor_detail_tab" class="easyui-tabs" style="width:450px; height: 170px;"></div>';
    XS.CommonUtil.openDialog("xs_main_detail_1", obj.HHNAME, "icon-man", content, false, false, false);
    $('#xs_poor_detail_tab').tabs('add',{
        title:'扶贫责任人',
        content:"<div id='xs_poor_detail_tab_tasker' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'扶贫项目',
        content:"<div style='padding: 5px; height: 100%; box-sizing: border-box; padding-top: 10px;'>" +
        "<div id='xs_poor_detail_tab_project' style='width: 100%; height: 100%; box-sizing: border-box;padding-bottom: 10px;'>" +
        "</div>"
    });
    $('#xs_poor_detail_tab').tabs("select",0);

    var data = {hid: obj.PB_HHID};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTempHouseHelpById", data, function (json) {
        if(json && json.length>0){
            //基本信息
            var objArr = [
                {"name": "联系人", "value": json[0].NHP_HELPNAME},
                {"name": "单位名称", "value": json[0].NHP_HELPUNIT},
                {"name": "联系电话", "value": json[0].NHP_TEL}
            ];
            $("#xs_poor_detail_tab_tasker").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 1, 40,"color:#00bbee",""));
        }
    });

    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTempFourFiveByHId", {Hid: obj.PB_HHID}, function (json)
    {
        if (json && json.length>0)
        {
            //基本信息
            var objArr = [
                {"name": "帮扶项目", "value": json[0].SOLVINGINDUSTING},
                {"name": "帮扶规模", "value": json[0].SOLVINGINDUSTINGSIZE}
            ];
            $("#xs_poor_detail_tab_project").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 1, 60,"color:#00bbee",""));
        }
    },function(e){});
}

//浏览贫困户的图片
XS.Main.Poor.showPic = function(id, name){
    var data = {pdid: id};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryRegionFileByHid", data, function (json) {
        XS.CommonUtil.hideLoader();
        if (json && json.length>0)
        {
            var pathArr = [];
            for(var i in json)
            {
                pathArr.push(json[i].Path);
            }
            XS.Main.Poor.showPic2Paths(name,pathArr);
        }else{
            XS.CommonUtil.showMsgDialog("", "没有拍摄图片");
        }
    },function(e){XS.CommonUtil.hideLoader();});
}

//贫困户--视频播放
XS.Main.Poor.playVideo = function(id,name){
    xs_poor_video_rotate = 0;
    var data = {pdid: id};
    //http://61.159.185.196:7060/Service2.svc/QueryRegionFileByHid?pdid=522401003010001
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryRegionFileByHid", data, function (json) {
        XS.CommonUtil.hideLoader();
        if (json && json.length>0)
        {
            var isVideo = false;
            var content = "";
            var obj = null;
            for(var i in json)
            {
                if(json[i].Type=='视频'){
                    obj = json[i];
                    break;
                }
            }
            if(obj == null){
                XS.CommonUtil.showMsgDialog("", "没有拍摄视频");
                return;
            }else
            {
               XS.Main.Poor.showVideo2Path(name, obj.Path);
            }
        }else
        {
            XS.CommonUtil.showMsgDialog("", "没有拍摄视频");
        }
    },function(e){XS.CommonUtil.hideLoader();});
}

XS.Main.Poor.showPic2Paths = function(title, pathArr){
    var content =
        '<div id="xs_poor_galleria" style="height: 100%; color:#777;>';
    for(var i in pathArr)
    {
        var path = pathArr[i];
        if(path.indexOf(".jpg")>0 || path.indexOf(".JPG")>0 || path.indexOf(".jpeg")>0){
            content +=
                '<a href="'+path+'">'+
                '<img'+
                ' src="'+path+'"'+
                ' data-big=""'+
                ' data-title=""'+
                ' data-description=""'+
                ' style="width: 100px; height: 100px;"'+
                '>'+
                '</a>';
        }
    }
    content += '</div>';
    XS.CommonUtil.openDialog("xs_main_detail", title, "icon-man", content, false, false, true, 800, 500);
    Galleria.run('#xs_poor_galleria');
}

XS.Main.Poor.showVideo2Path = function(title, path){
    var content =
        '<link rel="stylesheet" href="../base/other/video/video-js.min.css">'+
        '<script src="../base/other/video/video.min.js"></script>'+
        '<div style="background-color: #000000;width: 100%;height: 100%; position: relative"><video id="xs_poor_video" class="video-js vjs-default-skin" controls preload="none" width="600" height="600" style="margin: auto;" poster="../img/vedio_poster.png" data-setup="{}">';
    if(path.indexOf(".3gp")>0||path.indexOf(".ogg")>0||path.indexOf(".ogv")>0){
        content += '<source src="'+path+'" type="video/ogg">';
    }else if(path.indexOf(".mp4")>0){
        content += '<source src="'+path+'" type="video/mp4">';
    }else if(path.indexOf(".webm")>0){
        content += '<source src="'+path+'" type="video/webm">';
    }else{
        content += '<source src="'+path+'">';
    }
    content += '</video>';
    // content += "<div id=\"xs_poor_video_down\" xs_path="+obj.Path+"><img src=\"../base/easyui/themes/extend-icons/arrow/arrow_down.png\" style=\"margin-left: 4px;margin-top: 4px;\"></div>";
    content += "<div id=\"xs_poor_video_down\" xs_path="+path+"><i class='fa fa-arrow-down fa-1x' style=\"margin-left: 7px;margin-top: 7px;\"></i></div>";
    content += '</div>';
    content += '<script>$(function(){try{videojs("xs_poor_video").play();}catch(e){} $("#xs_poor_video_down").click(function(){window.open($(this).attr("xs_path"));});});</script>';

    try{
        $('#xs_main_detail').dialog("close");
    }catch (e){};
    if(document.getElementById("xs_main_detail")){
        $('#xs_main_detail').remove();
    }
    var divTag = "<div id='xs_main_detail'></div>";
    $("#xs_mainC").append(divTag);

    var $_dl = $('#xs_main_detail');
    $_dl.dialog({
        title: title,
        closed: true,
        tools:[
            {
                /*iconCls:'e_icon-arrow_rotate_clockwise',*/
                iconCls:'xs_poor_rotate',
                handler:function(){
                    var deg = 90*((++xs_poor_video_rotate)%4);
                    $("#xs_poor_video").css({
                        "transform": "rotate("+deg+"deg)"
                    });
                }
            }
        ],
        maximizable:false,
        modal:true,
        width:750,
        height:640,
        resizable:false,
        iconCls:"icon-man",
        cache: false,
        content:content,
        onClose:function(){
            videojs('xs_main_detail').pause();
        }
    }).dialog('open');
}

XS.Main.Poor.showVideo2Path1 = function(title, path, left ,dw, dh, vw, vh, modal){
    if(!dw){
        var dw = 750;
    }
    if(!dh){
        var dh = 640;
    }
    if(!vw){
        var vw = 600;
    }
    if(!vh){
        var vh = 600;
    }
    var xs_poor_video_rotate1 = 0;
    var content =
        '<link rel="stylesheet" href="../base/other/video/video-js.min.css">'+
        '<script src="../base/other/video/video.min.js"></script>'+
        '<div style="background-color: #000000;width: 100%;height: 100%; position: relative"><video id="xs_poor_video1" class="video-js vjs-default-skin" controls preload="none" width='+vw+' height='+vh+' style="margin: auto;" poster="../img/vedio_poster.png" data-setup="{}">';
    if(path.indexOf(".3gp")>0||path.indexOf(".ogg")>0||path.indexOf(".ogv")>0){
        content += '<source src="'+path+'" type="video/ogg">';
    }else if(path.indexOf(".mp4")>0){
        content += '<source src="'+path+'" type="video/mp4">';
    }else if(path.indexOf(".webm")>0){
        content += '<source src="'+path+'" type="video/webm">';
    }else{
        content += '<source src="'+path+'">';
    }
    content += '</video>';
    // content += "<div id=\"xs_poor_video_down\" xs_path="+obj.Path+"><img src=\"../base/easyui/themes/extend-icons/arrow/arrow_down.png\" style=\"margin-left: 4px;margin-top: 4px;\"></div>";
    content += "<div class=\"xs_poor_video_down\" id=\"xs_poor_video_down1\" xs_path="+path+"><i class='fa fa-arrow-down fa-1x' style=\"margin-left: 7px;margin-top: 7px;\"></i></div>";
    content += '</div>';
    content += '<script>$(function(){try{videojs("xs_poor_video1").play();}catch(e){} $("#xs_poor_video_down1").click(function(){window.open($(this).attr("xs_path"));});});</script>';

    try{
        $('#xs_main_detail_1').dialog("close");
    }catch (e){};
    if(document.getElementById("xs_main_detail_1")){
        $('#xs_main_detail_1').remove();
    }
    var divTag = "<div id='xs_main_detail_1'></div>";
    $("#xs_mainC").append(divTag);

    var $_dl = $('#xs_main_detail_1');
    $_dl.dialog({
        title: title,
        closed: true,
        tools:[
            {
                /*iconCls:'e_icon-arrow_rotate_clockwise',*/
                iconCls:'xs_poor_rotate',
                handler:function(){
                    var deg = 90*((++xs_poor_video_rotate1)%4);
                    $("#xs_poor_video1").css({
                        "transform": "rotate("+deg+"deg)"
                    });
                }
            }
        ],
        maximizable:false,
        modal:modal?true:false,
        left:left,
        width:dw,
        height:dh,
        resizable:false,
        iconCls:"icon-man",
        cache: false,
        content:content,
        onClose:function(){
            videojs('xs_main_detail_1').pause();
        }
    }).dialog('open');
}

XS.Main.Poor.showVideo2Path2 = function(title, path, left ,dw, dh, vw, vh, modal){
    if(!dw){
        var dw = 750;
    }
    if(!dh){
        var dh = 640;
    }
    if(!vw){
        var vw = 600;
    }
    if(!vh){
        var vh = 600;
    }
    var xs_poor_video_rotate1 = 0;
    var content =
        '<link rel="stylesheet" href="../base/other/video/video-js.min.css">'+
        '<script src="../base/other/video/video.min.js"></script>'+
        '<div style="background-color: #000000;width: 100%;height: 100%; position: relative"><video id="xs_poor_video2" class="video-js vjs-default-skin" controls preload="none" width='+vw+' height='+vh+' style="margin: auto;" poster="../img/vedio_poster.png" data-setup="{}">';
    if(path.indexOf(".3gp")>0||path.indexOf(".ogg")>0||path.indexOf(".ogv")>0){
        content += '<source src="'+path+'" type="video/ogg">';
    }else if(path.indexOf(".mp4")>0){
        content += '<source src="'+path+'" type="video/mp4">';
    }else if(path.indexOf(".webm")>0){
        content += '<source src="'+path+'" type="video/webm">';
    }else{
        content += '<source src="'+path+'">';
    }
    content += '</video>';
    // content += "<div id=\"xs_poor_video_down\" xs_path="+obj.Path+"><img src=\"../base/easyui/themes/extend-icons/arrow/arrow_down.png\" style=\"margin-left: 4px;margin-top: 4px;\"></div>";
    content += "<div class=\"xs_poor_video_down\" id=\"xs_poor_video_down2\" xs_path="+path+"><i class='fa fa-arrow-down fa-1x' style=\"margin-left: 7px;margin-top: 7px;\"></i></div>";
    content += '</div>';
    content += '<script>$(function(){try{videojs("xs_poor_video2").play();}catch(e){} $("#xs_poor_video_down2").click(function(){window.open($(this).attr("xs_path"));});});</script>';

    try{
        $('#xs_main_detail_2').dialog("close");
    }catch (e){};
    if(document.getElementById("xs_main_detail_2")){
        $('#xs_main_detail_2').remove();
    }
    var divTag = "<div id='xs_main_detail_2'></div>";
    $("#xs_mainC").append(divTag);

    var $_dl = $('#xs_main_detail_2');
    $_dl.dialog({
        title: title,
        closed: true,
        tools:[
            {
                /*iconCls:'e_icon-arrow_rotate_clockwise',*/
                iconCls:'xs_poor_rotate',
                handler:function(){
                    var deg = 90*((++xs_poor_video_rotate1)%4);
                    $("#xs_poor_video2").css({
                        "transform": "rotate("+deg+"deg)"
                    });
                }
            }
        ],
        maximizable:false,
        modal:modal?true:false,
        left:left,
        width:dw,
        height:dh,
        resizable:false,
        iconCls:"icon-man",
        cache: false,
        content:content,
        onClose:function(){
            videojs('xs_main_detail_2').pause();
        }
    }).dialog('open');
}

//查看贫困户四通五有状态
XS.Main.Poor.show45State = function(id,name){
    var data = {Hid: id};
    XS.CommonUtil.showLoader();
    //http://61.159.185.196:7060/Service2.svc/QueryTempFourFiveByHId?Hid=522426213040064
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTempFourFiveByHId", data, function (json)
    {
        XS.CommonUtil.hideLoader();
        if (json && json.length>0)
        {
            json = XS.Main.Poor.handleArrNull(json, ["HELPMANTEL"]);//数据为空时处理
            json = json[0];

            var content =
                '<div class="xs_poor_45">'+
                    '<div class="xs_poor_45_title">四有</div>'+
                    //安全用电
                    '<div id="xs_poor_45_aqyd" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">安全用电</div>';
                        if(json.ISSAFEELECTRIC !='是'){
                            content += '<img src="../img/poor/安全用电.jpg" style="-webkit-filter: grayscale(1)">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">安全用电:否</span></div>';
                        }else{
                            content += '<img src="../img/poor/安全用电.jpg">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">安全用电:是</span></div>';
                        }
                     content
                     += '</div>'+
                    '<div id="xs_poor_45_aqys" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">安全饮水</div>';
                        if(json.ISSAFEWATER !='是'){
                            content += '<img src="../img/poor/安全饮水.jpg" style="-webkit-filter: grayscale(1)">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">安全饮水:否</span></div>';
                        }else{
                            content += '<img src="../img/poor/安全饮水.jpg">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">安全饮水:是</span></div>';
                        }
                        content
                            += '</div>'+
                    '<div id="xs_poor_45_aqzf" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">安全住房</div>';
                        if(json.ISSAFEBUILDING !='是'){
                            content += '<img src="../img/poor/安全住房.jpg" style="-webkit-filter: grayscale(1)">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">安全住房:否</span></div>';
                        }else{
                            content += '<img src="../img/poor/安全住房.jpg">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">安全住房:是</span></div>';
                        }
                        content
                            += '</div>'+
                    '<div id="xs_poor_45_jnpx" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">就业技能培训</div>';
                        if(json.ISSKILL !='是'){
                            content += '<img src="../img/poor/就业技能培训.jpg" style="-webkit-filter: grayscale(1)">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">就业技能培训:否</span></div>';
                        }else{
                            content += '<img src="../img/poor/就业技能培训.jpg">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">就业技能培训:是</span></div>';
                        }
                        content
                            += '</div>'+
                    '<div class="xs_poor_45_title" style="margin-top: 30px;">五覆盖</div>'+
                    '<div id="xs_poor_45_rhl" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">入户路</div>';
                        if(json.ISHARDROAD =='是' && json.ISHARDYARD =='是'){
                            content += '<img src="../img/poor/入户路.jpg">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">入户路:已通</span><span style="display: inline-block;">路到坝子:已到</span></div>';
                        }else{
                            content += '<img src="../img/poor/入户路.jpg" style="-webkit-filter: grayscale(1)">'+
                            '<div class="xs_poor_45_tip"><span style="display: inline-block;">入户路:未通</span><span style="display: inline-block;">路到坝子:未到</span></div>';
                        }
                        content
                            += '</div>'+
                    '<div id="xs_poor_45_ylbx" class="xs_poor_45_c">'+
                        '<div class' +
                        '="xs_poor_45_f">养老保险</div>';
                        if(json.INSUREDNUM >0 ){
                            content += '<img src="../img/poor/养老保险.jpg">';
                        }else{
                            content += '<img src="../img/poor/养老保险.jpg" style="-webkit-filter: grayscale(1)">';
                        }
                            content += '<div class="xs_poor_45_tip"><span style="display: inline-block;">参保人数:'+json.INSUREDNUM+'</span><span style="display: inline-block;">未参保人数:'+json.INSURINGNUM+'</span></div>';
                        content
                            += '</div>'+
                    '<div id="xs_poor_45_yljz" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">医疗救助</div>';
                        if(json.MEDICALAIDNUM >0 ){
                            content += '<img src="../img/poor/医疗救助.jpg">';
                        }else{
                            content += '<img src="../img/poor/医疗救助.jpg" style="-webkit-filter: grayscale(1)">';
                        }
                            content += '<div class="xs_poor_45_tip"><span style="display: inline-block;">医保人数:'+json.MEDICALAIDNUM+'</span><span style="display: block;">医保金:'+json.MEDICALAIDMONEY+'</span></div>';
                        content
                            += '</div>'+
                    '<div id="xs_poor_45_zscy" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">增收产业</div>';
                        if(json.HASINDUSTRY =='有'|| json.HASINDUSTRY =='是'){
                            content += '<img src="../img/poor/增收产业.jpg">';
                        }else{
                            content += '<img src="../img/poor/增收产业.jpg" style="-webkit-filter: grayscale(1)">';
                        }
                        content += '<div class="xs_poor_45_tip"><span style="display: inline-block;">增收产业:'+json.HASINDUSTRY+'</span><span style="display: inline-block;">待增收产业数:'+json['SOLVINGINDUSTINGSIZE']+'</span><span style="display: inline-block;">待增收产业:'+json['SOLVINGINDUSTING']+'</span></div>';
                        content
                            += '</div>'+
                    '<div id="xs_poor_45_jyzz" class="xs_poor_45_c">'+
                        '<div class="xs_poor_45_f">教育资助</div>';
                        if(json.HIGHSCHOOLUPNUM >0 ){
                            content += '<img src="../img/poor/教育资助.jpg">';
                        }else{
                            content += '<img src="../img/poor/教育资助.jpg" style="-webkit-filter: grayscale(1)">';
                        }
                        content += '<div class="xs_poor_45_tip"><span style="display: inline-block;">教育资助数:'+json.HIGHSCHOOLUPNUM+'</span></div>';
                        content
                            += '</div>'+
                '</div>';
            content +=
                '<script>' +
                    '$(".xs_poor_45_c").mouseenter(function(){' +
                        '$(this).find(".xs_poor_45_tip").show("fast");' +
                    '});' +
                    ' $(".xs_poor_45_c").mouseleave(function(){' +
                        '$(this).find(".xs_poor_45_tip").hide("fast");' +
                    '});' +
                '</script>';
            XS.CommonUtil.openDialog("xs_main_detail_1", name, "icon-man", content, false, false, false);
        }else
        {
            XS.CommonUtil.showMsgDialog("", "没有数据");
        }
    },function(e){XS.CommonUtil.hideLoader();});
}

//----------------------------------------扶贫搬迁---------------------------------------------------
//扶贫搬迁
var xs_poor_elementsLayer = null; //dom图层
var xs_poor_chartDom = null;
var xs_poor_echartObj = null;
var xs_poor_geoCoord = null;
var xs_poor_isELayerVisible = false; //图层可视状态
var xs_poor_superFeature = null;

var xs_poor_echart_option =
{
    tooltip: {
        trigger: 'item',
        formatter: function(v)
        {
            var data = v.data;
            if(data.xs_type==0){ //line
                return data.name + '->' + data.xs_ename;
            }else
            { //point
                if(data.xs_level<XS.Main.ZoneLevel.village){
                    return data.name + "<br/>" + "迁入户数:" + data.value;
                }else{
                    if(data.value==0){
                        return data.xs_name + "<br/>" + "原居地:" + data.name;
                    }else{
                        return data.xs_name + "<br/>" + "现居地:" + data.name;
                    }
                }
            }
        }
    },
    legend: {
        show:false,
        orient: 'vertical',
        x: 'right',
        y:'10%',
        backgroundColor:'rgba(255,255,255,0.3)',
        data: ['毕节'],
        selectedMode: 'single',
        selected: {}
    },
    toolbox: {
        show: false
    },
    dataRange: {
        show:true,
        min: 0,
        max: 100,
        x:'right',
        y: '50%',
        calculable: true,
        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua']
    },
    series:
        [{
            name: '毕节',
            type: 'map',
            mapType: 'none',
            data: [],
            geoCoord: [],
            markLine: {
                smooth: true,
                effect: {
                    show: true,
                    scaleSize: 2,
                    period: 25,
                    color: '#ff0000',
                    shadowBlur: 20,
                    shadowColor: null
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        lineStyle: {
                            type: 'solid',
                            shadowBlur: 10
                        }
                    }
                },
                data: []
            },
            markPoint: {
                symbol: 'emptyCircle',
                symbolSize: function (v) {
                    return  10 + v / 100
                },
                effect: {
                    show: true,
                    shadowBlur: 0
                    /*, color: '#fff',*/
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        }
                    }
                },
                data:[]
            }
        }]
};

/**
 * 扶贫搬迁
 * @param id
 */
var xs_poor_isUpOneLevel = false;
XS.Main.Poor.povertyRelocation = function(level, parentId, pdata) {
    XS.Main.hiddenLayers();
    xs_markerLayer.clearMarkers();
    xs_poorLabelLayer.removeAllFeatures();

    if($("#xs_utfGridC").length>0) $("#xs_utfGridC").css("display","none");
    if($("#xs_tjfx_range_Legend").length>0) $("#xs_tjfx_range_Legend").remove();

    xs_poor_isELayerVisible = false;
    xs_isShowUtfGridTip = false;
    XS.Main.Pkjc.minInfoWinDialog();
    XS.Main.Pkjc.closeGaugeData();

    $("#xs_echartjs").empty().append('<script src="../base/echart2/dist/echarts-all.js"></script>');
    if(xs_poor_elementsLayer==null)
    {
        xs_poor_elementsLayer = new SuperMap.Layer.Elements("xs_poor_elementsLayer");
        xs_MapInstance.getMapObj().addLayer(xs_poor_elementsLayer);
        xs_poor_elementsLayer.setVisibility(false);

        var elementsDiv = xs_poor_elementsLayer.getDiv();

        var size = xs_MapInstance.getMapObj().getSize();
        elementsDiv.style.width = size.w;
        elementsDiv.style.height = size.h;

        xs_poor_chartDom = document.createElement("div");
        elementsDiv.appendChild(xs_poor_chartDom);
        xs_poor_chartDom.style.width = size.w + "px";
        xs_poor_chartDom.style.height = size.h + "px";

        xs_poor_echartObj = echarts.init(xs_poor_chartDom);

        xs_poor_echartObj.on('click', function (params) //点击流动图
        {
           // console.log(params);
            //XS.LogUtil.log("level="+level+"parentId="+parentId);
            if(params.data.xs_type == 0){
                xs_poor_isUpOneLevel = true;
            }
            xs_clickMapType = XS.Main.clickMapType.poor_povertyrelocation;
            if(params)
            {
                var layerName = "";
                var sql = "";
                var regionNameF = "";
                var regionIdF = "";
                var superId = 0;
                var currentLevel = -1;
                switch (params.data.xs_level){
                    case XS.Main.ZoneLevel.city:
                        if(params.data.xs_type == 0){
                            XS.CommonUtil.showMsgDialog("", "没有上一级");
                            return;
                        }else{
                            regionNameF = "Name";
                            regionIdF = "AdminCode";
                            sql = "AdminCode=" + params.data.xs_code;
                            layerName = "County_Code";
                            superId = xs_cityID;
                            currentLevel = XS.Main.ZoneLevel.county;
                        }
                        break;
                    case XS.Main.ZoneLevel.county:
                        if(params.data.xs_type == 0){
                            if(xs_user_regionLevel==XS.Main.ZoneLevel.county){
                                XS.CommonUtil.showMsgDialog("", "您的权限不够");
                                return;
                            }else{
                                xs_currentZoneFuture = null;
                                xs_zone_vectorLayer.removeAllFeatures();
                                //XS.CommonUtil.showMsgDialog("", "您的权限不够");
                            }
                            break;
                        }else{
                            regionNameF = "乡镇名称";
                            regionIdF = "乡镇代码";
                            sql = "乡镇代码=" + params.data.xs_code;
                            layerName = "Twon_Code";
                            superId = Math.floor(params.data.xs_code/1000);
                            currentLevel = XS.Main.ZoneLevel.town;
                        }
                        break;
                    case XS.Main.ZoneLevel.town:
                        if(params.data.xs_type == 0){
                            if(xs_user_regionLevel==XS.Main.ZoneLevel.town){
                                XS.CommonUtil.showMsgDialog("", "您的权限不够");
                                return;
                            }else{
                                regionNameF = "Name";
                                regionIdF = "AdminCode";
                                var countyCode = params.data.xs_code.slice(0,6);
                                sql = "AdminCode=" + countyCode;
                                layerName = "County_Code";
                                superId = xs_cityID;
                                currentLevel = XS.Main.ZoneLevel.county;
                            }
                            break;
                        }else{
                            regionNameF = "vd_name";
                            regionIdF = "OldID";
                            sql = "OldID=" + params.data.xs_code;
                            layerName = "Village_Code";
                            superId = params.data.xs_code.slice(0,9);
                            currentLevel = XS.Main.ZoneLevel.village;
                        }
                        break;
                    case XS.Main.ZoneLevel.village:
                    case XS.Main.ZoneLevel.poor:
                        if(params.data.xs_type == 0){
                            if(xs_user_regionLevel==XS.Main.ZoneLevel.village){
                                XS.CommonUtil.showMsgDialog("", "您的权限不够");
                                return;
                            }else{
                                regionNameF = "乡镇名称";
                                regionIdF = "乡镇代码";
                                var townCode = params.data.xs_code.toString().slice(0,9);
                                sql = "乡镇代码=" + townCode;
                                layerName = "Twon_Code";
                                superId = Math.floor(townCode/1000);
                                currentLevel = XS.Main.ZoneLevel.town;
                            }
                            break;
                        }else{
                            /*sql = "Town_id==" + params.data.xs_code;
                             layerName = "Village_Code";*/
                        }
                        break;
                }
                if(!sql && !layerName){
                    XS.Main.Poor.povertyRelocationClick(params);
                }else{
                    XS.CommonUtil.showLoader();
                    XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, layerName, sql,xs_MapInstance.bLayerUrl, function(queryEventArgs){
                        XS.CommonUtil.hideLoader();
                        var i, feature, result = queryEventArgs.result;
                        if (result && result.recordsets&&result.recordsets[0].features.length>0) {
                            feature = result.recordsets[0].features[0];                           //加载数据到矢量图层中
                            if(feature){
                                xs_currentZoneFuture = feature;
                                feature.style = xs_stateZoneStyle;
                                xs_zone_vectorLayer.removeAllFeatures();
                                xs_zone_vectorLayer.addFeatures(feature);

                                xs_currentZoneName = feature.data[regionNameF];
                                xs_clickMapFutureId  = feature.data[regionIdF];
                                xs_currentZoneCode =  feature.data[regionIdF];
                                xs_pkdc_isFirstShowInfoWin = true;
                                xs_superZoneCode = superId;
                                xs_currentZoneLevel = currentLevel;
                                XS.Main.Poor.povertyRelocationClick(params);
                            }else{
                                XS.CommonUtil.showMsgDialog("", "未找到相关数据");
                            }
                        }else{
                            XS.CommonUtil.showMsgDialog("", "未找到相关数据");
                        }
                    },function(e){XS.CommonUtil.showMsgDialog("", "数据加载失败");});
                }
            }
        });
    }

    try{
        xs_poor_echartObj.getZrender().animation['start']();
    }catch (e){}
    try{
        xs_poor_echartObj.clear();
    }catch (e){}

    xs_poor_elementsLayer.setVisibility(true);

    XS.CommonUtil.showLoader();
    xs_clickMapType = XS.Main.clickMapType.none;
    switch (level)
    {
        case XS.Main.ZoneLevel.city:
            if(XS.Main.Tjfx.type_featuersArr.county.length>0){
                XS.Main.Poor.preloc_handleData(level, parentId);
            }else{
                XS.Main.Tjfx.loadZoneFeatuers(level, "SMID>0", function()
                    {
                        if(XS.Main.Tjfx.type_featuersArr.county.length>0){
                            XS.Main.Poor.preloc_handleData(level, parentId);
                        }else{
                            XS.CommonUtil.hideLoader();
                        }
                    }, function(e)
                    {
                        XS.CommonUtil.hideLoader();
                    }
                );
            }
            break;
        case XS.Main.ZoneLevel.county:
            if(XS.Main.Tjfx.type_featuersArr.county.length>0)
            {
                XS.Main.Tjfx.loadZoneFeatuers(level, "县级代码=="+parentId, function()
                    {
                        if(XS.Main.Tjfx.type_featuersArr.town.length>0)
                        {
                            XS.Main.Poor.preloc_handleData(level, parentId);
                        }else{
                            XS.CommonUtil.hideLoader();
                        }
                    }, function(e)
                    {
                        XS.CommonUtil.hideLoader();
                    }
                );
            }else
            {
                XS.Main.Tjfx.loadZoneFeatuers(XS.Main.ZoneLevel.city, "SMID>0", function()
                    {
                        if(XS.Main.Tjfx.type_featuersArr.county.length>0)
                        {
                            XS.Main.Tjfx.loadZoneFeatuers(level, "县级代码=="+parentId, function()
                                {
                                    if(XS.Main.Tjfx.type_featuersArr.town.length>0)
                                    {
                                        XS.Main.Poor.preloc_handleData(level, parentId);
                                    }else{
                                        XS.CommonUtil.hideLoader();
                                    }
                                }, function(e)
                                {
                                    XS.CommonUtil.hideLoader();
                                }
                            );
                        }else{
                            XS.CommonUtil.hideLoader();
                        }
                    }, function(e)
                    {
                        XS.CommonUtil.hideLoader();
                    }
                );
            }
            break;
        case XS.Main.ZoneLevel.town:
            XS.Main.Tjfx.loadZoneFeatuers(level, "Town_id=="+parentId, function()
                {
                    if(XS.Main.Tjfx.type_featuersArr.village.length>0)
                    {
                      //xs_clickMapFutureId = feature.data.乡镇代码;
                        xs_poor_superFeature = null;
                        var sql = "乡镇代码=="+parentId;
                        XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, "Twon_Code", sql, xs_MapInstance.bLayerUrl,function(queryEventArgs)
                        {
                            var i, feature, result = queryEventArgs.result;
                            if (result && result.recordsets&&result.recordsets[0].features.length>0) {
                                for (i = 0; i < result.recordsets[0].features.length; i++)
                                {
                                    xs_poor_superFeature = result.recordsets[0].features[i];
                                    XS.Main.Poor.preloc_handleData(level, parentId);
                                    break;
                                }
                            }else{
                                XS.CommonUtil.hideLoader();
                            }
                        }, function(e){
                            XS.CommonUtil.hideLoader();
                        });
                    }else{
                        XS.CommonUtil.hideLoader();
                    }
                }, function(e)
                {
                    XS.CommonUtil.hideLoader();
                }
            );
            break;
        case XS.Main.ZoneLevel.village:
            //直接显列表
            XS.Main.Poor.preloc_handleVill(level, parentId);
            break;
        case XS.Main.ZoneLevel.poor:
            XS.Main.Poor.preloc_handleData(level, parentId, pdata);
            break;
    }
}

XS.Main.Poor.povertyRelocationClick = function(params) {
    if (params.data.xs_type == 0) { //点击线--上一级
        switch (params.data.xs_level) {
            case XS.Main.ZoneLevel.city:
                XS.CommonUtil.showMsgDialog("", "没有上一级");
                break;
            case XS.Main.ZoneLevel.county:
                if (xs_user_regionLevel == XS.Main.ZoneLevel.city) {
                    XS.Main.Poor.povertyRelocation(params.data.xs_level - 1, xs_cityID);
                } else {
                    XS.CommonUtil.showMsgDialog("", "您的权限不够");
                }
                break;
            case XS.Main.ZoneLevel.town:
                if (xs_user_regionLevel <= XS.Main.ZoneLevel.county) {
                    if (xs_user_regionLevel == XS.Main.ZoneLevel.county) {
                        XS.Main.Poor.povertyRelocation(params.data.xs_level - 1, xs_user_regionId);
                    } else {
                        //找县Id
                        XS.CommonUtil.showLoader();
                        var sql = "OldID==" + params.data.xs_code;
                        XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, "Village_Code", sql, xs_MapInstance.bLayerUrl, function (queryEventArgs) {
                            XS.CommonUtil.hideLoader();
                            var i, feature, result = queryEventArgs.result;
                            if (result && result.recordsets && result.recordsets[0].features.length > 0) {
                                var feature = result.recordsets[0].features[0];
                                XS.Main.Poor.povertyRelocation(params.data.xs_level - 1, feature.data.country_id);
                            }
                        }, function (e) {
                            XS.CommonUtil.hideLoader();
                        });
                    }
                } else {
                    XS.CommonUtil.showMsgDialog("", "您的权限不够");
                }
                break;
            case XS.Main.ZoneLevel.village:
                if (xs_user_regionLevel <= XS.Main.ZoneLevel.town) {
                    if (xs_user_regionLevel == XS.Main.ZoneLevel.town) {
                        XS.Main.Poor.povertyRelocation(params.data.xs_level - 1, xs_user_regionId);
                    } else {
                        XS.CommonUtil.showLoader();
                        var sql = "OldID==" + params.data.xs_code;
                        XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, "Village_Code", sql, xs_MapInstance.bLayerUrl, function (queryEventArgs) {
                            XS.CommonUtil.hideLoader();
                            var i, feature, result = queryEventArgs.result;
                            if (result && result.recordsets && result.recordsets[0].features.length > 0) {
                                var feature = result.recordsets[0].features[0];
                                XS.Main.Poor.povertyRelocation(params.data.xs_level - 1, feature.data.Town_id);
                            }
                        }, function (e) {
                            XS.CommonUtil.hideLoader();
                        });
                    }
                } else {
                    XS.CommonUtil.showMsgDialog("", "您的权限不够");
                }
                break;
            case XS.Main.ZoneLevel.poor:
                if (xs_user_regionLevel <= XS.Main.ZoneLevel.town) {
                    if (xs_user_regionLevel == XS.Main.ZoneLevel.town) {
                        XS.Main.Poor.povertyRelocation(params.data.xs_level - 2, xs_user_regionId);
                    } else {
                        XS.CommonUtil.showLoader();
                        var sql = "OldID==" + params.data.xs_code;
                        XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, "Village_Code", sql, xs_MapInstance.bLayerUrl, function (queryEventArgs) {
                            XS.CommonUtil.hideLoader();
                            var i, feature, result = queryEventArgs.result;
                            if (result && result.recordsets && result.recordsets[0].features.length > 0) {
                                var feature = result.recordsets[0].features[0];
                                XS.Main.Poor.povertyRelocation(params.data.xs_level - 2, feature.data.Town_id);
                            }
                        }, function (e) {
                            XS.CommonUtil.hideLoader();
                        });
                    }
                } else {
                    XS.CommonUtil.showMsgDialog("", "您的权限不够");
                }
                break;
        }
    } else { //点击的点--下一级
        if (params.data.xs_level >= XS.Main.ZoneLevel.village) {
            //显示扶贫搬户的信息
            var lat = "";
            var lon = "";
            var title = "搬迁户基本信息";
            if (params.data.value == 0) {
                lat = params.data.xs_info.flat;
                lon = params.data.xs_info.flon;
            } else {
                lat = params.data.xs_info.tlat;
                lon = params.data.xs_info.tlon;
            }
            var xy = XS.GeometryUtil.getPixelFromGeoXY(lon, lat, xs_MapInstance.getMapObj());
            var content =
                '<div style="width: 100%; background-color: #eee; box-sizing: border-box;">' +
                "<a id='xs_poor_preloc_picBtn' href='javascript:void(0);' style='width: 80px; margin: 5px;margin-bottom: 0px;'>图片</a>" +
                "<a id='xs_poor_preloc_videoBtn' href='javascript:void(0);'  style='width: 80px; margin: 5px;margin-bottom: 0px;'>视频</a>" +
                '</div>' +
                '<div id="xs_poor_preloc_detail_tab" style="width:200px; padding: 2px;box-sizing: border-box;"></div>';

            XS.CommonUtil.openDialog("xs_main_detail_1", title, "icon-man", content, false, false, false, null, null, xy.x + 15, xy.y + 5, function () {
            });

            $('#xs_poor_preloc_picBtn').linkbutton({iconCls: 'e_icon-picture'});
            $('#xs_poor_preloc_videoBtn').linkbutton({iconCls: 'e_icon-film'});
            $('#xs_poor_preloc_picBtn').click(function () {//查看搬迁前后图片展示
                var bpathArr = []; //前
                var cpathArr = []; //后

                bpathArr.push("../test/s_01.jpg");
                bpathArr.push("../test/s_02.jpg");
                bpathArr.push("../test/s_03.jpg");

                cpathArr.push("../test/e_01.jpg");
                cpathArr.push("../test/e_02.jpg");

                var content =
                    '<div style="width: 100%; height: 100%;box-sizing: border-box;background-color:#000;">';

                content += '<div style="width: 49%; height:99%;display: inline-block;box-sizing: border-box;"><div id="xs_poor_galleria_b" style="width: 100%; height:100%;color:#777;">';
                for (var i in bpathArr) {
                    var path = bpathArr[i];
                    if (path.indexOf(".jpg") > 0 || path.indexOf(".JPG") > 0 || path.indexOf(".jpeg") > 0) {
                        content +=
                            '<a href="' + path + '">' +
                            '<img' +
                            ' src="' + path + '"' +
                            ' data-big=""' +
                            ' data-title=""' +
                            ' data-description=""' +
                            ' style="width: 100px; height: 100px;"' +
                            '>' +
                            '</a>';
                    }
                }
                content += '</div></div>';
                content += '<div style="width: 2%; height:99%;display: inline-block;box-sizing: border-box;"><div style="width: 1px; height: 100%;background-color: #505050;"></div></div>';

                content += '<div style="width: 49%; height:99%;display: inline-block;box-sizing: border-box;"><div id="xs_poor_galleria_c" style="width: 100%; height:100%;color:#777;">';
                for (var i in cpathArr) {
                    var path = cpathArr[i];
                    if (path.indexOf(".jpg") > 0 || path.indexOf(".JPG") > 0 || path.indexOf(".jpeg") > 0) {
                        content +=
                            '<a href="' + path + '">' +
                            '<img' +
                            ' src="' + path + '"' +
                            ' data-big=""' +
                            ' data-title=""' +
                            ' data-description=""' +
                            ' style="width: 100px; height: 100px;"' +
                            '>' +
                            '</a>';
                    }
                }
                content += '</div></div>';

                content += '</div>';
                XS.CommonUtil.openDialog("xs_main_detail", "搬迁前-后图片展示", "icon-man", content, false, false, true, 1200, 550);
                Galleria.run('#xs_poor_galleria_b');
                Galleria.run('#xs_poor_galleria_c');


                // XS.Main.Poor.showPic2Paths(obj.name, pathArr);
            });
            $('#xs_poor_preloc_videoBtn').click(function () { //搬迁前后视频展示
                var bpath = "../test/s.3gp";
                var cpath = "../test/e.mp4";

                XS.Main.Poor.showVideo2Path1('搬迁前', bpath, (window.innerWidth / 2.0 - 600), 600, 600, 500, 500);
                XS.Main.Poor.showVideo2Path2('搬迁后', cpath, (window.innerWidth / 2.0), 600, 600, 500, 500);
            });

            //基本信息
            //xs_info
            var obj = params.data.xs_info;
            var objArr = [
                {"name": "户主", "value": obj.name},
                {"name": "扶贫单位", "value": obj.helpdepartment},
                {"name": "负责人", "value": obj.helper},
                {"name": "资助金", "value": obj.sum},
                {"name": "原居地", "value": obj.from},
                {"name": "现现地", "value": obj.to},
            ];
            $("#xs_poor_preloc_detail_tab").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr, ['value']), 1, 25, "color:#00bbee", ""));
        } else {
            XS.Main.Poor.povertyRelocation(params.data.xs_level + 1, params.data.xs_code);
        }
    }
}

//扶贫搬迁-村级展示
var xs_poor_detail_is_relocationdialog_open = false;
XS.Main.Poor.preloc_handleVill = function(level, parentId){
    xs_clickMapType = XS.Main.clickMapType.poor_povertyrelocation;
    xs_poor_detail_is_relocationdialog_open = false;
    xs_poor_elementsLayer.setVisibility(true);
    if($("#xs_utfGridC").length>0) $("#xs_utfGridC").css("display","none");
    XS.CommonUtil.hideLoader();
    var testObj = [
        {'name':'张三', 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'镰刀湾村', 'flon':105.43084410858, 'flat':27.7626084993159, 'to':'青林村', 'tlon':105.40357648564, 'tlat':27.7557783311176, 'fpic':'','fv':'','tpic':'','tv':''},
        {'name':'李四', 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'煤冲村', 'flon':105.283967412228, 'flat':27.2141378668798, 'to':'核桃村', 'tlon':105.272751223953, 'tlat':27.2173935617529, 'fpic':'','fv':'','tpic':'','tv':''},
        {'name':'王二', 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'沙朗村', 'flon':105.34166954055, 'flat':27.2097694416046, 'to':'双堰村', 'tlon':105.286757418278, 'tlat':27.195028364937, 'fpic':'','fv':'','tpic':'','tv':''},
        {'name':'赵七', 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'常丰村', 'flon':105.427392355285, 'flat':27.1832865727689, 'to':'岔河村', 'tlon':105.364960147198, 'tlat':27.1834449228978, 'fpic':'','fv':'','tpic':'','tv':''},
        {'name':'孙五', 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'塘丰村', 'flon':105.396583630234, 'flat':27.1804027318534, 'to':'晨思村', 'tlon':105.351825839819, 'tlat':27.1919977053125, 'fpic':'','fv':'','tpic':'','tv':''}
    ];
    //1.搬迁人口列表
    var content =
        '<div id="xs_poor_reloc_C" style="width: 100%; height:100%;padding: 5px;box-sizing: border-box;">'+
    '<div id="xs_poor_reloc_tabC" style="width:100%;height:465px;"></div>'+
    '<i id="xs_poor_reloc_loading" style="position: absolute;top: 50%; left: 50%;margin-left: -25px;margin-top: -25px;visibility: hidden;" class="fa fa-spinner fa-pulse fa-3x fa-fw xs_loading"></i>'+
    '</div>';
    content += '</div>';
    //id, title, iconCls, content, resizable, maximizable, modal, width, height, left, top, closeCallback, maximizeCallback, minimizeCallback
    XS.CommonUtil.openDialog("xs_main_detail_relocation", "扶贫搬迁", "icon-man", content, false, true, false, 350, null,0,null,function(){
        if(xs_poor_detail_is_relocationdialog_open)
        {
            xs_poor_detail_is_relocationdialog_open = false;
            //XS.Main.Poor.clearRelocationLayer();
        }
    });
    xs_poor_detail_is_relocationdialog_open = true;

    $("#xs_poor_reloc_tabC").empty().append('<table id="xs_poor_reloc_dg" class="easyui-datagrid" style="width:100%;height:100%;" ></table>');
    $('#xs_poor_reloc_dg').datagrid({
        data: testObj,
        pagination: true,
        pageSize: 15,
        pageList: [15,20,30],
        striped: true,
        onSelect:function(index, data){
            XS.Main.Poor.preloc_handleData(level, parentId, data);
        },
        singleSelect: true,
        rownumbers: true,
        columns: [[
            {field: 'name', title: '姓名',width:'10%'},
            {field: 'helpdepartment', title: '扶贫单位',width:'20%'},
            {field: 'sum', title: '扶贫资金',width:'20%'},
            {field: 'from', title: '原始地',width:'20%'},
            {field: 'to', title: '搬迁地',width:'25%'}
        ]]
    });
    $("#xs_poor_reloc_dg").datagrid("getPager").pagination({displayMsg:""});
    $('#xs_poor_reloc_dg').datagrid('clientPaging');
}

//清除扶贫搬迁Layer
XS.Main.Poor.clearRelocationLayer = function(){
    if(xs_poor_elementsLayer){
        xs_clickMapType = XS.Main.clickMapType.none;
        xs_isShowUtfGridTip = true;
        xs_poor_elementsLayer.setVisibility(false);
        xs_poor_elementsLayer = null;
        try{
            xs_poor_echartObj.getZrender().animation['stop']();
        }catch (e){}
        try{
            xs_poor_echartObj.clear();
        }catch (e){}
    }
}

//扶贫搬迁-数据处理
var xs_poor_timeoutId = null;
XS.Main.Poor.preloc_handleData = function(level, parentId, relocatorData){
    var geoCoord = {};
    var lineData = [];
    var pointData =  [];

    xs_poor_geoCoord = null;
    var max = 0;

    var superName = "";
    var curNameParam = "";
    var curCodeParam = "";
    var cacheFeatureArr = [];
    switch (level)
    {
        case XS.Main.ZoneLevel.city:
            clearTimeout(xs_poor_timeoutId)
            xs_poor_timeoutId = setTimeout(function(){
                xs_MapInstance.getMapObj().setCenter(xs_MapInstance.getMapCenterPoint(), 0);
            },500);
            superName = "毕节";
            geoCoord[superName] = [xs_MapInstance.getMapCenterPoint().lon,xs_MapInstance.getMapCenterPoint().lat];
            curNameParam = "Name";
            curCodeParam = "AdminCode";
            cacheFeatureArr = XS.Main.Tjfx.type_featuersArr.county;
            break;
        case XS.Main.ZoneLevel.county:
            var feature = null;
            for(var i=0; i<XS.Main.Tjfx.type_featuersArr.county.length; i++)
            {
                feature = XS.Main.Tjfx.type_featuersArr.county[i];
                if(feature.data.AdminCode==parentId){
                    break;
                }
            }
            if(feature)
            {
                var centerPoint = feature.geometry.getBounds().getCenterLonLat();

                clearTimeout(xs_poor_timeoutId)
                xs_poor_timeoutId = setTimeout(function(){
                    xs_MapInstance.getMapObj().setCenter(centerPoint, 5);
                },500);

                superName = feature.data.Name;
                geoCoord[superName] = [centerPoint.lon,centerPoint.lat];
                curNameParam = "乡镇名称";
                curCodeParam = "乡镇代码";
                cacheFeatureArr = XS.Main.Tjfx.type_featuersArr.town;
            }else{

            }
            break;
        case XS.Main.ZoneLevel.town:

            var centerPoint = xs_poor_superFeature.geometry.getBounds().getCenterLonLat();

            clearTimeout(xs_poor_timeoutId)
            xs_poor_timeoutId = setTimeout(function(){
                xs_MapInstance.getMapObj().setCenter(centerPoint, 8);
            },500);

            superName = xs_poor_superFeature.data.乡镇名称;
            geoCoord[superName] = [centerPoint.lon,centerPoint.lat];
            curNameParam = "vd_name";
            curCodeParam = "OldID";
            cacheFeatureArr = XS.Main.Tjfx.type_featuersArr.village;
            break;
    }

    if(level>=XS.Main.ZoneLevel.village)
    {
        clearTimeout(xs_poor_timeoutId)
        xs_poor_timeoutId = setTimeout(function(){
            xs_MapInstance.getMapObj().setCenter(new SuperMap.LonLat(relocatorData.tlon , relocatorData.tlat), 8);
        },500);
        //显示搬迁户数据
        //{'name':'张三', 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'镰刀湾村',
        // 'flon':105.43084410858, 'flat':27.7626084993159, 'to':'青林村', 'tlon':105.40357648564, 'tlat':27.7557783311176}
        geoCoord[relocatorData.from] = [relocatorData.flon,relocatorData.flat];
        geoCoord[relocatorData.to] = [relocatorData.tlon,relocatorData.tlat];
        var lineObj = [{
            xs_type:0,
            xs_code:parentId,
            xs_ename:relocatorData.to,
            xs_level:level,
            name: relocatorData.from
        }, {
            name: relocatorData.to,
            value: 1
        }];
        var pointObj = {
            name: relocatorData.from,
            xs_code:parentId,
            xs_type:1,
            xs_level:level,
            xs_name:relocatorData.name,
            xs_info:relocatorData,
            value: 0
        };
        var pointObj1 = {
            name: relocatorData.to,
            xs_code:parentId,
            xs_type:1,
            xs_level:level,
            xs_name:relocatorData.name,
            xs_info:relocatorData,
            value: 1
        };
        lineData.push(lineObj);
        pointData.push(pointObj);
        pointData.push(pointObj1);

        xs_poor_echart_option.dataRange.show = false;
    }else
    {
        for(var i=0; i<cacheFeatureArr.length; i++)
        {
            var feature = cacheFeatureArr[i];
            var lonLat = feature.geometry.getBounds().getCenterLonLat();

            var name = feature.data[curNameParam];
            var code = feature.data[curCodeParam];

            var isNext = false;
            switch (xs_user_regionLevel)
            {
                case XS.Main.ZoneLevel.county:
                    if(level==XS.Main.ZoneLevel.city){
                        if(xs_user_regionId != code){
                            isNext = true;
                        }
                    }
                    break;
                case XS.Main.ZoneLevel.town:
                    if(level==XS.Main.ZoneLevel.county){
                        if(xs_user_regionId != code){
                            isNext = true;
                        }
                    }
                    break;
            }

            if(!isNext)
            {
                geoCoord[name] = [lonLat.lon,lonLat.lat];
                var value = Math.random()*1000;
                value = Math.floor(value);
                if(value>max){
                    max = value;
                }
                var lineObj = [{
                    xs_type:0,
                    xs_code:code,
                    xs_ename:name,
                    xs_level:level,
                    name: superName
                }, {
                    name: name,
                    value: value
                }];
                var pointObj = {
                    name: name,
                    xs_code:code,
                    xs_type:1,
                    xs_level:level,
                    value: value
                };
                lineData.push(lineObj);
                pointData.push(pointObj);
            }
        }
        xs_poor_echart_option.dataRange.show = true;
    }

    xs_poor_isELayerVisible = true;

    xs_poor_echart_option.series[0].geoCoord = geoCoord;
    xs_poor_echart_option.series[0].markLine.data = lineData;
    xs_poor_echart_option.series[0].markPoint.data = pointData;
    xs_poor_echart_option.dataRange.max = max;

    XS.Main.Poor.preloc_reSetOption(xs_poor_echart_option);
    xs_poor_echartObj.setOption(xs_poor_echart_option, {});
    XS.CommonUtil.hideLoader();
}

XS.Main.Poor.preloc_reSetOption = function(option) {
    var series = option.series || {};
    // 记录所有的geoCoord
    if (!xs_poor_geoCoord) {
        xs_poor_geoCoord = {};
        for (var i = 0, item; item = series[i++];) {
            var geoCoord = item.geoCoord;
            if (geoCoord) {
                for (var k in geoCoord) {
                    xs_poor_geoCoord[k] = geoCoord[k];
                }
            }
        }
    }
    for (var i = 0, item; item = series[i++];) {
        var markPoint = item.markPoint || {};
        var markLine = item.markLine || {};

        var data = markPoint.data;
        if (data && data.length) {
            for (var k in data) {
                XS.Main.Poor.preloc_resetPosition(data[k]);
            }
        }

        data = markLine.data;
        if (data && data.length) {
            for (var k in data) {
                XS.Main.Poor.preloc_resetPosition(data[k][0]);
                XS.Main.Poor.preloc_resetPosition(data[k][1]);
            }
        }
    }
}

XS.Main.Poor.preloc_resetPosition = function(obj) {
    if(obj.name){
        var coord = xs_poor_geoCoord[obj.name];
        var pos = xs_MapInstance.getMapObj().getViewPortPxFromLonLat(new SuperMap.LonLat(coord[0], coord[1]));
        obj.x = pos.x;
        obj.y = pos.y;
    }
}

//贫困户详细信息
XS.Main.Poor.showPoorDetailInfo = function(obj){
    var content = '<div style="width: 100%; background-color: #eee">' +
    "<a id='xs_poor_picBtn' href='javascript:void(0);' style='width: 80px; margin: 5px;'>图片</a>" +
    "<a id='xs_poor_videoBtn' href='javascript:void(0);'  style='width: 80px; margin: 5px;'>视频</a>" +
    "<a id='xs_poor_msgBtn' href='javascript:void(0);'  style='width: 80px; margin: 5px;'>扶贫意见</a>" +
    "<a id='xs_poor_relocateBtn' href='javascript:void(0);'  style='width: 80px; margin: 5px;'>扶贫搬迁</a>" +
    '</div><div id="xs_poor_detail_tab" class="easyui-tabs" style="width:600px; height: 250px;"></div>';
    XS.CommonUtil.openDialog("xs_main_detail_1", obj.HHNAME, "icon-man", content, false, false, false);

    $('#xs_poor_picBtn').linkbutton({iconCls:'e_icon-picture'});
    $('#xs_poor_videoBtn').linkbutton({iconCls:'e_icon-film'});
    $('#xs_poor_msgBtn').linkbutton({iconCls:'e_icon-email_go'});
    $('#xs_poor_relocateBtn').linkbutton({iconCls:'xs_fpbq_family_min'});

    $('#xs_poor_picBtn').click(function(){
        XS.Main.Poor.showPic(obj.PB_HHID,obj.HHNAME);
    });
    $('#xs_poor_videoBtn').click(function(){
        XS.Main.Poor.playVideo(obj.PB_HHID,obj.HHNAME);
    });
    $('#xs_poor_msgBtn').click(function(){
        XS.Main.showAdvanceFeedDialog(obj.PB_HHID);
    });
    $('#xs_poor_relocateBtn').click(function(){ //扶贫搬迁xs
        XS.CommonUtil.closeDialog('xs_poor_info');
        XS.CommonUtil.closeDialog('xs_main_detail_1');
        xs_currentZoneFuture = null;
        xs_zone_vectorLayer.removeAllFeatures();
        var centerPoint = xs_MapInstance.getMapCenterPoint();
        var data = {'name':obj.HHNAME, 'sum':5000, 'helpdepartment':'县扶贫办', 'helper':'XXX', 'from':'镰刀湾村', 'flon':centerPoint.lon, 'flat':centerPoint.lat, 'to':obj.VILL, 'tlon':obj.LONGITUDE, 'tlat':obj.LATITUDE};
        XS.Main.Poor.povertyRelocation(XS.Main.ZoneLevel.poor, obj.VID, data);
    });

    $('#xs_poor_detail_tab').tabs('add',{
        title:'基本信息',
                content:"<div id='xs_poor_detail_tab_info' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'家庭成员',
        content:"<div style='padding: 5px; height: 100%; box-sizing: border-box; padding-top: 10px;'>" +
        "<div id='xs_poor_detail_tab_member' style='width: 100%; height: 100%; box-sizing: border-box;padding-bottom: 10px;'>" +
        "</div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'生活环境',
        content:"<div id='xs_poor_detail_tab_environment' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'住房信息',
        content:"<div id='xs_poor_detail_tab_hose_info' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>",
        closable:false
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'土地信息',
        content:"<div id='xs_poor_detail_tab_soil_info' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'收入情况',
        content:"<div id='xs_poor_detail_tab_income_info' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'支出情况',
        content:"<div id='xs_poor_detail_tab_outcome_info' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });
    $('#xs_poor_detail_tab').tabs('add',{
        title:'种植信息',
        content:"<div id='xs_poor_detail_tab_plant_info' style='padding: 5px; height: 100%; box-sizing: border-box;'></div>"
    });

    $('#xs_poor_detail_tab').tabs("select",0);

    //基本信息
   var objArr = [
       {"name": "户编号", "value": obj.PB_HHID},
       {"name": "户主姓名", "value": obj.HHNAME},
       {"name": "电话", "value": obj.PHONE},
       {"name": "贫困类型", "value": obj.PTYPE},
       {"name": "致贫原因", "value": obj.MAIN_REASON},
       {"name": "人口", "value": obj.POP},
       {"name": "主要原因", "value": obj.MAIN_REASON},
       {"name": "次要原因", "value": obj.OTHER_REASON},
       {"name": "贫困标准", "value": obj.PSTANDARD},
       {"name": "消费用品", "value": obj.CONSUMES},
       {"name": "采访人", "value": obj.MODITOR},
       {"name": "采访日期", "value": obj.MODIDATE},
       {"name": "市", "value": obj.CITY},
       {"name": "县", "value": obj.COUNTY},
       {"name": "乡", "value": obj.TOWN},
       {"name": "村", "value": obj.VILL},
       {"name": "组", "value": obj.VGROUP}
   ];
    $("#xs_poor_detail_tab_info").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 3, 34,"color:#00bbee",""));

    //家庭成员
    //xs_poor_detail_tab_member
    //QueryPeopleBaseByHId(Hid)
    var data = {Hid: obj.PB_HHID};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryPeopleBaseByHId", data, function (json) {
        if(json && json.length>0){
            //{"age":0,"healthy":"健康","id":1,"idcord":"522424198107153617",
            // "marriage":"普通劳力","name":"王士平","relation":"户主","sex":"男","workPlace":"县外省内务工"}
            var objArr = [];
            $('#xs_poor_detail_tab_member').datagrid({
                data: json,
                striped: true,
                singleSelect: true,
                rownumbers: true,
                columns: [[
                    {field: 'name', title: '姓名', width: '10%',styler: function(value,row,index){return 'height:34px;'}},
                    {field: 'idcord', title: '证件号码', width: '14%'},
                    {field: 'sex', title: '性别', width: '5%'},
                    {field: 'age', title: '年龄', width: '5%'},
                    {field: 'relation', title: '与户主关系', width: '10%'},
                    {field: 'marriage', title: '劳动力', width: '10%'},
                    {field: 'healthy', title: '身体状态', width: '10%'},
                    {field: 'workPlace', title: '打工地', width: '19%'}
                ]]
            });
        }
    });

    //生活环境
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHouseCondByFid", data, function (json) {
        if(json && json.length>0){
            var obj = json[0];
            var objArr = [
                {"name":"饮水困难","value":obj.HC_DIFF_WATER},
                {"name":"通电","value":obj.HC_ELECTRIC},
                {"name":"燃料类型","value":obj.HC_FUEL},
                {"name":"采集时间","value":obj.HC_GDATE},
                {"name":"入户路类型","value":obj.HC_INDOOR_ROAD},
                {"name":"宽带入户","value":obj.HC_IN_BAND},
                {"name":"电商覆盖","value":obj.HC_ISTAOBAO},
                {"name":"通广播电视","value":obj.HC_TELEVISION},
                {"name":"安全用水","value":obj.HC_SAFE_WATER},
                {"name":"饮水情况","value":obj.HC_WATER_STATE},
                {"name":"距离村主路","value":obj.HC_BIGROAD},
                {"name":"距离村主路","value":obj.Hc_vill_distan}
            ];
            $("#xs_poor_detail_tab_environment").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 3, 50,"color:#00bbee",""));
        }
    });

    //住房信息
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHouseHomeByFid", data, function (json) {
        if(json && json.length>0){
            var obj = json[0];
            var objArr = [
                {"name":"住房面积(m²)","value":obj.HH_HOUSE_AREA},
                {"name":"建房时间","value":obj.HH_HDATE},
                {"name":"房屋档次","value":obj.HH_HSTATE},
                {"name":"采集时间","value":obj.HH_GDATE},
                {"name":"主要结构","value":obj.HH_MAINSTRU},
                {"name":"有无卫生厕所","value":obj.HH_HWC}
            ];
            $("#xs_poor_detail_tab_hose_info").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 2, 68,"color:#00bbee",""));
        }
    });

    //土地信息
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHouseEarthById", data, function (json) {
        if(json && json.length>0){
            var obj = json[0];

            var objArr = [
                {"name":"田","value":obj.HDY_FIELD},
                {"name":"牧草地面积","value":obj.HDY_GRASS},
                {"name":"林果面积","value":obj.HDY_FRUIT},
                {"name":"采集时间","value":obj.HDY_GDATE},
                {"name":"水田面积","value":obj.HDY_WATER_AREA},
                {"name":"林地面积","value":obj.HDY_FOREST},
                {"name":"灌溉面积","value":obj.HDY_IRRI},
                {"name":"退耕还林","value":obj.HDY_TGHL},
                {"name":"土","value":obj.HDY_LAND},
                {"name":"耕地面积","value":obj.HDY_TOTAL_EARTH}
            ];
            $("#xs_poor_detail_tab_soil_info").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 4, 68,"color:#00bbee",""));
        }
    });

    //收入情况
    //xs_poor_detail_tab_income_info
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHouseIncomeByFid", data, function (json) {
        if(json && json.length>0){
            var obj = json[0];
            var objArr = [
                {"name":"采集时间","value":obj.HI_GDATE},
                {"name":"低保","value":obj.HI_LOW},
                {"name":"医疗救助金","value":obj.HI_MEDHELP},
                {"name":"新农合医疗","value":obj.HI_MEDIC},
                {"name":"五保","value":obj.HI_OLD},
                {"name":"计划生育金","value":obj.HI_ONECHILD},
                {"name":"生态补偿金","value":obj.HI_ECO},
                {"name":"补贴","value":obj.HI_OTHER},
                {"name":"家庭年收入","value":obj.HI_INWHOLE},
                {"name":"家庭年人均纯收","value":obj.HI_PUREAVG},
                {"name":"家庭年纯收入","value":obj.HI_PUREWHOLE},
                {"name":"经营性收入","value":obj.HI_PRODUCT},
                {"name":"财产性收入","value":obj.HI_PROPERTY},
                {"name":"工资性收入","value":obj.HI_WORK},
                {"name":"HI_ENDOW","value":obj.HI_ENDOW}
            ];
            $("#xs_poor_detail_tab_income_info").empty().append(XS.Main.Poor.createTable(XS.Main.Poor.handleArrNull(objArr,['value']), 3, 40,"color:#00bbee",""));
        }
    });
}

//自动创建表格
XS.Main.Poor.createTable = function(objArr, colls, rowH, nameCollStyle, valueCollStyle){
    var content =
        '<div class="datagrid-wrap panel-body panel-body-noheader" style="width: 100%; height: auto; margin-top: 5px;">'+
        '<div class="datagrid-body">'+
        '<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0" width="100%">'+
        '<tbody>';
    var sum = objArr.length;
    var colspan = Math.ceil(sum/colls)*colls-sum;
    colspan = (colspan==0)?0:colspan+1;
    for(var i=0; i<Math.ceil(sum/colls); i++){
        var rcls = Math.ceil(i/2)-Math.floor(i/2)>0?"datagrid-row datagrid-row-alt":"datagrid-row";
        content += '<tr  style="height: '+rowH+'px;" class="'+rcls+'">';
        for(var j=i*colls; j<((i+1)*colls)&&j<sum; j++){
            if(i>0&&j==(sum-1)&&colspan>0){
                content += '<td  colspan='+"'"+colspan+"'"+'><div class="datagrid-cell" style="'+nameCollStyle+'">'+objArr[j].name+'</div></td>';
                content += '<td colspan='+"'"+colspan+"'"+'><div  class="datagrid-cell" style="'+valueCollStyle+'">'+objArr[j].value+'</div></td>';
            }else{
                content += '<td><div class="datagrid-cell" style="'+nameCollStyle+'">'+objArr[j].name+'</div></td>';
                content += '<td><div  class="datagrid-cell" style="'+valueCollStyle+'">'+objArr[j].value+'</div></td>';
            }
        }
        content += '</tr>';
    }
        content +=
        '</tbody>'+
        '</table>'+
        '</div>'+
        '</div>';
    return content;
}

//处理数组中值为Null时转化为“”
XS.Main.Poor.handleArrNull = function(arr,keys){
    var t_arr = [];
    for(var i in arr){
        var obj = arr[i];
        for(var j in keys){
            var k = keys[j];
            if(XS.StrUtil.isEmpty(obj[k])){
                obj[k] = "";
            }
        }
        t_arr.push(obj);
    }
    return t_arr;
}

//地图移动完成时事件处理
XS.Main.Poor.movedMapCallback = function(e){
    if(xs_poor_isELayerVisible){
        XS.Main.Poor.preloc_reSetOption(xs_poor_echart_option);
        xs_poor_echartObj.setOption(xs_poor_echart_option, {});
    }
}

//创建贫困图例
XS.Main.Poor.createPoorLegendTag = function(level){
    xs_poor_legendbegoreH = 0;
    xs_poor_isLegendClickSingle = true;

    var tag = '<div id="xs_poor_legend">'+
        '<div class="poorLegendTitle">'+
        '<span>图例</span>'+
        '<a href="javascript:void(0)" id="xs_poor_legendCollap" onclick="XS.Main.Poor.legendCollapse();"></a>' +
        '<a href="javascript:void(0)" id="xs_poor_legendClose" onclick="XS.Main.Poor.legendClose();"></a>' +
        '</div>'+
        '<div class="poorLegendContent">'+
        '<table id="xs_poor_legendTab" border="0" cellspacing="0" cellpadding="0">'+
        '<tr style="border-bottom: 1px solid #02BBEE;">';
        //XS.Main.Tjfx.pkfsx_legendItemHeaders.countytown[9] = '40% - 10000%';
        if(level == XS.Main.ZoneLevel.county)
        {
            tag += '<td class="poorLegendItemHeader">贫困类型</td><td class="poorLegendItemValue">图标</td></tr>';
            for(var i in XS.Main.poorZonePicArr.town){
                tag += '<tr class1="poorLegendItemRow" style="border-bottom: 1px solid #02BBEE;">';
                tag += '<td class="poorLegendItemHeader">'+XS.Main.poorZonePicArr.town[i].name+'</td>';
                tag += '<td class="poorLegendItemValue" style1="background:url("'+XS.Main.poorZonePicArr.town[i].value+'") no-repeat 100px 0 #fff;>' +
                    '<img style="width:25px;heigth:25px;" src="'+XS.Main.poorZonePicArr.town[i].value+'" alt=""/>' +
                    '</td>';
                tag += '</tr>';
            }
        }else if(level == XS.Main.ZoneLevel.town)
        {
            tag += '<td class="poorLegendItemHeader">贫困类型</td><td class="poorLegendItemValue">图标</td></tr>';
            for(var i in XS.Main.poorZonePicArr.vill){
                tag += '<tr class1="poorLegendItemRow" style="border-bottom: 1px solid #02BBEE;">';
                tag += '<td class="poorLegendItemHeader">'+XS.Main.poorZonePicArr.vill[i].name+'</td>';
                tag += '<td class="poorLegendItemValue" style1="background:url("'+XS.Main.poorZonePicArr.vill[i].value+'") no-repeat 100px 0 #fff;>' +
                    '<img style="width:25px;heigth:25px;" src="'+XS.Main.poorZonePicArr.vill[i].value+'" alt=""/>' +
                    '</td>';
                tag += '</tr>';
            }
        }else if(level == XS.Main.ZoneLevel.village)
        {
            tag += '<td class="poorLegendItemHeader">贫困原因</td><td class="poorLegendItemValue">图标</td></tr>';
            for(var i in XS.Main.poorZonePicArr.poor){
                tag += '<tr class="poorLegendItemRow" style="border-bottom: 1px solid #02BBEE;">';
                tag += '<td class="poorLegendItemHeader">'+XS.Main.poorZonePicArr.poor[i].name+'</td>';
                tag += '<td class="poorLegendItemValue" style1="background:url("'+XS.Main.poorZonePicArr.poor[i].value+'") no-repeat 100px 0 #fff;>' +
                    '<img style="width:18px;heigth:18px;" src="'+XS.Main.poorZonePicArr.poor[i].value+'" alt=""/>' +
                    '</td>';
                tag += '</tr>';
            }
        }
    tag += '</table></div></div>';

    return tag;
}
/*

//图例展开和收缩事件
XS.Main.Poor.legendCollapse = function(){
    if(xs_poor_isLegendClickSingle){
        xs_poor_isLegendClickSingle = false;
        xs_poor_legendbegoreH = $(".poorLegendContent").outerHeight();
        $(".poorLegendContent").animate({height:0},{duration: 300 });
        $("#xs_poor_legendCollap").css({background: 'url("../img/panel_tools.png") no-repeat -32px 0'});

        $("#xs_poor_legendCollap").hover(
            function(){
                $(this).css({background: 'url("../img/panel_tools.png") no-repeat -32px 0 #eee'});
            },function(){
                $(this).css({background: 'url("../img/panel_tools.png") no-repeat -32px 0'});
            }
        );
    }else{
        xs_poor_isLegendClickSingle = true;
        $(".poorLegendContent").animate({height:xs_poor_legendbegoreH},{duration: 300 });
        $("#xs_poor_legendTab").css({width: "220px"});
        $("#xs_poor_legendCollap").css({background: 'url("../img/panel_tools.png") no-repeat -32px -16px'});

        $("#xs_poor_legendCollap").hover(
            function(){
                $(this).css({background: 'url("../img/panel_tools.png") no-repeat -32px -16px #eee'});
            },function(){
                $(this).css({background: 'url("../img/panel_tools.png") no-repeat -32px -16px'});
            }
        );
    }
}
//关闭图例事件
XS.Main.Poor.legendClose = function(){
    $("#xs_poor_legend").remove();
}*/

