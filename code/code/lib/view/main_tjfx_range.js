/**
 * Created by GZXS on 2016/7/4.
 */
//专门处理分段专题图

//记录中心点 --
var xs_tjfx_range_centerPoint = null;
//贫困发生率率统计
/*
    贫困发生率
    脱贫率
 */
/**
 *
 * @param level 区域级别  @see XS.Main.ZoneLevel
 * @param parentId 上级ID
 * @param type 统计分析类型 @see XS.Main.Tjfx.type
 */
var xs_tjfx_zoneLevel = -1;
XS.Main.Tjfx.range = function(level, parentId, type){
    XS.Main.Poor.clearRelocationLayer();
    XS.Main.clearMap();
    XS.Main.Pkjc.closeInfoDialog();
    XS.CommonUtil.closeDialog("xs_main_detail");
    xs_currentZoneFuture = null;
    xs_zone_vectorLayer.removeAllFeatures();
   // xs_currentZoneLevel = level;
    xs_tjfx_zoneLevel = level;
    xs_superZoneCode = -1;

    xs_tjfx_type =  type;

    xs_isShowUtfGridTip = false;
    XS.Main.hiddenDivTags();
    XS.Main.Tjfx.removeLayer();
    xs_markerLayer.clearMarkers();
    xs_markerLayer.setVisibility(false);
    XS.Main.Poor.clearRelocationLayer();
    xs_clickMapType = XS.Main.clickMapType.tjfx_range;

    //添加标签专题图
    var strategy = new SuperMap.Strategy.GeoText();
    strategy.style = {
        fontColor:"#ffffff",
        fontWeight:"bolder",
        fontSize:"20px",
        fill: true,
        fillColor: "#000000",
        fillOpacity: 1,
        stroke: true,
        strokeColor:"#ff0000"
    };
    xs_labelLayer = new SuperMap.Layer.Vector("tjfx_label",{strategies: [strategy]});
    xs_MapInstance.getMapObj().addLayer(xs_labelLayer);

    //专题图层
    xs_tjfx_themeLayer = new SuperMap.Layer.Range("tjfx_themeLayer");
    xs_tjfx_themeLayer.setOpacity(0.85);
    // 图层基础样式
    xs_tjfx_themeLayer.style = {
        shadowBlur: 16,
        shadowColor: "#000000",
        fillColor: "#FFFFFF"
    };
    // 开启 hover 高亮效果
    xs_tjfx_themeLayer.isHoverAble = true;
    // hover高亮样式
    xs_tjfx_themeLayer.highlightStyle = {
        stroke: true,
        strokeWidth: 4,
        strokeColor: '#00bbee',
        fillColor: "#00EEEE",
        shadowBlur: 3,
        shadowColor: "#000000",
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        fillOpacity: 0.5
    };
    //专题图 字段
    xs_tjfx_themeLayer.themeField = "xs_tjfx_range";

    if(document.getElementById("xs_tjfx_range_Legend")){
        $("#xs_tjfx_range_Legend").remove();
    }

    xs_tjfx_themeLayer.styleGroups = XS.Main.Tjfx.range_createRangeStyleGroups(type,level);
    $("#xs_mainC").append(XS.Main.Tjfx.range_createRangeLegendTag(type,level));

    $("#xs_tjfx_range_Legend").css("display", "block");

    // 注册 mousemove 事件
    xs_tjfx_themeLayer.on("mousemove", XS.Main.Tjfx.range_themeLayerMouseOverCallback);
    xs_tjfx_themeLayer.on("mouseout", XS.Main.Tjfx.range_themeLayerMouseOutCallback);
    xs_tjfx_themeLayer.on("click", XS.Main.Tjfx.range_themeLayerClickCallback);
    xs_tjfx_themeLayer.setVisibility(false);
    xs_MapInstance.getMapObj().addLayer(xs_tjfx_themeLayer);

    XS.CommonUtil.showLoader();
    switch (level)
    {
        case XS.Main.ZoneLevel.city:
        {
            xs_tjfx_range_centerPoint = xs_MapInstance.getMapCenterPoint();
            xs_MapInstance.getMapObj().setCenter(xs_tjfx_range_centerPoint, 0);
            //1.先获业务数据通过业务数据
            //2.获取空间数据
            //3.通过业务数据过滤空间数据

            //请求县级数据
            var action = "";
            switch (type){
                case XS.Main.Tjfx.type.range_pkfsx:
                    action = "QueryCountyBaseInfoByareaId";
                    break;
                case XS.Main.Tjfx.type.range_tpx:
                    action = "QueryOutPoorBycount";
                    break;
                case XS.Main.Tjfx.type.range_wfx:
                    action = "QueryDangerHouseBycount";
                    break;
                case XS.Main.Tjfx.type.range_fpbqx:
                    action = "QueryMovePoorBycount";
                    break;
            }
            var data = {pbno:parentId, pd_id:parentId};

            if(type ==XS.Main.Tjfx.type.range_pkfsx && XS.Main.CacheZoneInfos.county.length>0)
            {
                XS.Main.Tjfx.CacheZoneInfos.county = XS.Main.CacheZoneInfos.county;
                //2.获取空间数据
                XS.CommonUtil.showLoader();
                XS.Main.Tjfx.loadZoneFeatuers(level, "SMID>0", function()
                    {
                        XS.CommonUtil.hideLoader();
                        if(XS.Main.Tjfx.type_featuersArr.county.length>0)
                        {
                            XS.Main.Tjfx.range_addFeatures2Layer(XS.Main.Tjfx.type_featuersArr.county,XS.Main.Tjfx.CacheZoneInfos.county,0);
                        }
                    }, function(e)
                    {
                        XS.CommonUtil.hideLoader();
                    }
                );
            }else
            {
                XS.CommonUtil.showLoader();
                XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json)
                {
                    if (json && json.length > 0)
                    {
                        if(xs_tjfx_type == XS.Main.Tjfx.type.range_pkfsx){
                            XS.Main.CacheZoneInfos.county = json;
                        }
                        XS.Main.Tjfx.CacheZoneInfos.county = json;
                        //2.获取空间数据

                        XS.CommonUtil.showLoader();
                        XS.Main.Tjfx.loadZoneFeatuers(level, "SMID>0", function()
                            {
                                XS.CommonUtil.hideLoader();
                                if(XS.Main.Tjfx.type_featuersArr.county.length>0)
                                {
                                    XS.Main.Tjfx.range_addFeatures2Layer(XS.Main.Tjfx.type_featuersArr.county,XS.Main.Tjfx.CacheZoneInfos.county,0);
                                }
                            }, function(e)
                            {
                                XS.CommonUtil.hideLoader();
                            }
                        );
                    }else{
                        XS.CommonUtil.hideLoader();
                        XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                    }
                },function(e){XS.CommonUtil.hideLoader();});
            }
            break;
        }
        case XS.Main.ZoneLevel.county:
        {
            xs_MapInstance.getMapObj().setCenter(xs_tjfx_range_centerPoint, 3);

            //请求镇级数据
            var action = "";
            switch (type){
                case XS.Main.Tjfx.type.range_pkfsx:
                    action = "QueryTownsBaseInfoByareaId";
                    break;
                case XS.Main.Tjfx.type.range_tpx:
                    action = "QueryOutPoorBycount";
                    break;
                case XS.Main.Tjfx.type.range_wfx:
                    action = "QueryDangerHouseBycount";
                    break;
                case XS.Main.Tjfx.type.range_fpbqx:
                    action = "QueryMovePoorByTown";
                    break;
            }
            var data = {pbno:parentId, pd_id:parentId};
            XS.CommonUtil.showLoader();
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json) {
                XS.CommonUtil.hideLoader();
                if (json && json.length > 0)
                {
                    XS.Main.Tjfx.CacheZoneInfos.town = json;
                    XS.CommonUtil.showLoader();
                    XS.Main.Tjfx.loadZoneFeatuers(level, "县级代码=="+parentId, function()
                        {
                            XS.CommonUtil.hideLoader();
                            if(XS.Main.Tjfx.type_featuersArr.town.length>0)
                            {
                                XS.Main.Tjfx.range_addFeatures2Layer(XS.Main.Tjfx.type_featuersArr.town,XS.Main.Tjfx.CacheZoneInfos.town,1);
                            }
                            XS.CommonUtil.hideLoader();
                        }, function(e)
                        {
                            XS.CommonUtil.hideLoader();
                        }
                    );
                }else{
                    XS.CommonUtil.hideLoader();
                    XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                }
            },function(e){XS.CommonUtil.hideLoader();});
            break;
        }
        case XS.Main.ZoneLevel.town:
        {
            xs_MapInstance.getMapObj().setCenter(xs_tjfx_range_centerPoint, 8);

            //请求村数据
            var action = "";
            switch (type){
                case XS.Main.Tjfx.type.range_pkfsx:
                    action = "QueryVillBaseByareaId";
                    break;
                case XS.Main.Tjfx.type.range_tpx:
                    action = "QueryOutPoorBycount";
                    break;
                case XS.Main.Tjfx.type.range_wfx:
                    action = "QueryDangerHouseBycount";
                    break;
                case XS.Main.Tjfx.type.range_fpbqx:
                    action = "QueryMovePoorByTown";
                    break;
            }
            var data = {pbno:parentId, pd_id:parentId};
            XS.CommonUtil.showLoader();
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json) {
                if (json && json.length > 0) {
                    XS.Main.Tjfx.CacheZoneInfos.village = json;
                    XS.CommonUtil.showLoader();
                    XS.Main.Tjfx.loadZoneFeatuers(level, "Town_id=="+parentId, function()
                        {
                            XS.CommonUtil.hideLoader();
                            if(XS.Main.Tjfx.type_featuersArr.village.length>0)
                            {
                                XS.Main.Tjfx.range_addFeatures2Layer(XS.Main.Tjfx.type_featuersArr.village,XS.Main.Tjfx.CacheZoneInfos.village,2);
                            }
                            XS.CommonUtil.hideLoader();
                        }, function(e)
                        {
                            XS.CommonUtil.hideLoader();
                        }
                    );
                }else{
                    XS.CommonUtil.hideLoader();
                    XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                }
            },function(e){XS.CommonUtil.hideLoader();});
            break;
        }
    }
}

//添加Features到ThemeLayer
XS.Main.Tjfx.range_addFeatures2Layer = function(featureArr, data, level){ // 0:city 1:county 2:town

    var oId = "";
    var fId = "";

    switch (level){
        case 0: //市
            fId = "AdminCode";
            break;
        case 1: //县
            fId = "乡镇代码";
            break;
        case 2: //镇
            fId = "OldID";
            break;
    }
    switch (xs_tjfx_type)
    {
        case XS.Main.Tjfx.type.range_pkfsx:
            switch (level)
            {
                case 0: //市
                    oId = "CBI_ID";
                    break;
                case 1: //县
                    oId = "TOWB_ID";
                    break;
                case 2: //镇
                    oId = "VBI__ID";
                    break;
            }
            break;
        case XS.Main.Tjfx.type.range_tpx:
        case XS.Main.Tjfx.type.range_wfx:
        case XS.Main.Tjfx.type.range_fpbqx:
            oId = "REGION_ID";
            break;
    }

    var features = [];
    var geotextFeatures = [];
    var feature = null;
    var geotextFeature = null;
    var geoText = null;

    var xOff = (1 / xs_MapInstance.getMapObj().getScale()) * 0.00000001;
    var yOff = -(1 / xs_MapInstance.getMapObj().getScale()) * 0.00000005;
    for (var i in featureArr)
    {
        feature = featureArr[i];
        for(var j=0; j<data.length; j++)
        {
            var obj = data[j];
            if(obj[oId]==feature.data[fId])
            {
                var isNext = false;
                switch (level){
                    case 0: //市
                        if(xs_user_regionLevel == XS.Main.ZoneLevel.county &&  xs_user_regionId != feature.data[fId]){
                            isNext = true;
                        }
                        break;
                    case 1: //县
                        if(xs_user_regionLevel == XS.Main.ZoneLevel.town &&  xs_user_regionId != feature.data[fId]){
                            isNext = true;
                        }
                        break;
                    case 2: //镇;
                        if(xs_user_regionLevel == XS.Main.ZoneLevel.village &&  xs_user_regionId != feature.data[fId]){
                            isNext = true;
                        }
                        break;
                }
                if(isNext){
                    break;
                }
                var rate = 0;
                switch (xs_tjfx_type)
                {
                    case XS.Main.Tjfx.type.range_pkfsx:
                        switch (level)
                        {
                            case 0: //市
                                rate = obj.cps_Poverty_rate;
                                break;
                            case 1: //县
                                rate = obj.tpl_PoorRate;
                                break;
                            case 2: //镇
                                rate = obj.VillPoorRate;
                                break;
                        }
                        break;
                    case XS.Main.Tjfx.type.range_tpx:
                        rate = obj.OutPoorRate;
                        break;
                    case XS.Main.Tjfx.type.range_wfx:
                        rate = obj.DangerHRate;
                        break;
                    case XS.Main.Tjfx.type.range_fpbqx:
                        rate = obj.MoveRate;
                        break;
                }

                feature.attributes.xs_tjfx_range = rate;
                feature.data.xs_data = obj;
                features.push(feature);
                geoText = new SuperMap.Geometry.GeoText(feature.geometry.getBounds().getCenterLonLat().lon+xOff, feature.geometry.getBounds().getCenterLonLat().lat+yOff,(rate*1.0).toFixed(2)+"%");
                geotextFeature = new SuperMap.Feature.Vector(geoText);
                geotextFeatures.push(geotextFeature);
            }
        }
    }
    xs_labelLayer.addFeatures(geotextFeatures);
    xs_tjfx_themeLayer.addFeatures(features);
    xs_tjfx_themeLayer.setVisibility(true);
    ///xs_currentZoneLevel += 1;
}

//鼠标在 脱贫率专题图 移动事件处理
XS.Main.Tjfx.range_themeLayerMouseOverCallback = function(event){
    $("#xs_tjfx_range_themeTipC").css("display", "none");
    if(event.target && event.target.refDataID)
    {
        if($("#xs_utfGridC").length>0) $("#xs_utfGridC").css("display","none");
       // $("#xs_tjfx_range_themeTipC").css("display", "block");
        var feature = xs_tjfx_themeLayer.getFeatureById(event.target.refDataID);
        if(feature==null){
            return;
        }
        xs_tjfx_range_centerPoint = feature.geometry.getBounds().getCenterLonLat();
        var x = event.event.clientX;
        var y = event.event.clientY;

        var jsonObj = [];
        var title = "";
        var obj = feature.data.xs_data;

        switch (xs_tjfx_type)
        {
            case XS.Main.Tjfx.type.range_pkfsx:
                switch (xs_tjfx_zoneLevel)
                {
                    case XS.Main.ZoneLevel.city:
                    {
                        title = obj.CBI_NAME;
                        jsonObj.push({"name":"贫困镇","value":obj.CBI_PoorTOWNS_NUM});
                        jsonObj.push({"name":"贫困村","value":obj.CBI_PoorVILLAGE_NUM});
                        jsonObj.push({"name":"贫困户","value":obj.cps_poor_hhnum});
                        jsonObj.push({"name":"总人口","value":obj.cps_pop});
                        jsonObj.push({"name":"贫困人口","value":obj.cps_poor_pop});
                        jsonObj.push({"name":"贫困发生率","value":obj.cps_Poverty_rate});
                        jsonObj.push({"name":"贫困类型","value":obj.CBI_type});
                        break;
                    }
                    case XS.Main.ZoneLevel.county:
                    {
                        title = obj.TOWB_NAME;
                        //{"__type":"TOWNS_BASE_INFO:#WcfService2","TOWB_HouseNum":0,"TOWB_ID":522401120,
                        // "TOWB_LATITUDE":27.38116461560371,"TOWB_LONGITUDE":105.30560876171876,"TOWB_MEAN":0,
                        // "TOWB_MEMO":"","TOWB_NAME":"田坝桥镇","TOWB_PeopleNum":0,
                        // "TOWB_PoorHouseNum":0,"TOWB_PoorPeopleNum":0,"TOWB_VillNum":5,
                        // "Totolarea":0,"Totolvillnum":8,"tpl_PoorRate":0,"tpl_TownType":"",
                        // "tpl_arden_hhnum":0,"tpl_harden_mile":0,"tpl_team_num":0}
                        jsonObj.push({"name":"面积","value":obj.Totolarea});
                        jsonObj.push({"name":"村","value":obj.Totolvillnum});
                        jsonObj.push({"name":"贫困村","value":obj.TOWB_VillNum});
                        jsonObj.push({"name":"贫困户","value":obj.TOWB_HouseNum});
                        jsonObj.push({"name":"贫困人口","value":obj.TOWB_PeopleNum});
                        jsonObj.push({"name":"贫困发生率","value":obj.tpl_PoorRate});
                        break;
                    }
                    case XS.Main.ZoneLevel.town:
                    {
                        title = obj.VBI_NAME;
                        jsonObj.push({"name":"面积","value":obj.VillArea});
                        jsonObj.push({"name":"海拔","value":obj.VBI_ALTITUDE});
                        jsonObj.push({"name":"贫困村","value":obj.VBI_AveIncome});
                        jsonObj.push({"name":"贫困户","value":obj.VBI_HouseNum});
                        jsonObj.push({"name":"贫困人口","value":obj.VBI_PeopleNum});
                        jsonObj.push({"name":"贫困发生率","value":obj.VillPoorRate});
                        break;
                    }
                }
                break;
            case XS.Main.Tjfx.type.range_tpx:
                //{"__type":"OutPoorCount:#WcfService2",
                // "OutPoorHNum":40181,"OutPoorPNum":159277,"OutPoorRate":54.425150349460909140163623560,
                // "REGION_ID":522427,"REGION_Name":"威宁县"}
                title = obj.REGION_Name;
                jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                jsonObj.push({"name":"区域","value":obj.REGION_Name});
                jsonObj.push({"name":"脱贫率","value":obj.OutPoorRate});
                jsonObj.push({"name":"脱贫户数","value":obj.OutPoorHNum});
                jsonObj.push({"name":"脱贫人数","value":obj.OutPoorPNum});
                break;
            case XS.Main.Tjfx.type.range_wfx:
                switch (xs_tjfx_zoneLevel){
                    case XS.Main.ZoneLevel.city:
                        /*{
                         "__type": "DangerHouse:#WcfService2",
                         "DangerHRate": 18.380216951645523074094502670,
                         "DangerHnum": 9997,
                         "REGION_ID": 522401,
                         "REGION_Name": "七星关区"
                         }*/
                        title = obj.REGION_Name;
                        jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                        jsonObj.push({"name":"区域","value":obj.REGION_Name});
                        jsonObj.push({"name":"危房率","value":obj.DangerHRate});
                        jsonObj.push({"name":"危房户数","value":obj.DangerHnum});
                        break;
                    case XS.Main.ZoneLevel.county:
                        /*{
                            "__type": "DangerHouse:#WcfService2",
                            "DangerHRate": 0,
                            "DangerHnum": 0,
                            "REGION_ID": 522401001,
                            "REGION_Name": "市西街道"
                        }*/
                        title = obj.REGION_Name;
                        jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                        jsonObj.push({"name":"区域","value":obj.REGION_Name});
                        jsonObj.push({"name":"危房率","value":obj.DangerHRate});
                        jsonObj.push({"name":"危房户数","value":obj.DangerHnum});
                        break;
                    case XS.Main.ZoneLevel.town:
                        title = obj.REGION_Name;
                        jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                        jsonObj.push({"name":"区域","value":obj.REGION_Name});
                        jsonObj.push({"name":"危房率","value":obj.DangerHRate});
                        jsonObj.push({"name":"危房户数","value":obj.DangerHnum});
                        break;
                }
                break;
            case XS.Main.Tjfx.type.range_fpbqx:
                switch (xs_tjfx_zoneLevel){
                    case XS.Main.ZoneLevel.city:
                        /*{
                         "__type": "MovePoor:#WcfService2",
                         "MoveHnum": 9997,
                         "MovePnum": 9997,
                         "MoveRate": 18.380216951645523074094502670,
                         "REGION_ID": 522401,
                         "REGION_Name": "七星关区"
                         }*/
                        title = obj.REGION_Name;
                        jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                        jsonObj.push({"name":"区域","value":obj.REGION_Name});
                        jsonObj.push({"name":"扶贫搬迁率","value":obj.MoveRate});
                        jsonObj.push({"name":"搬迁户数","value":obj.MoveHnum});
                        jsonObj.push({"name":"搬迁人数","value":obj.MovePnum});
                        break;
                    case XS.Main.ZoneLevel.county:
                        /*{
                         "__type": "MovePoor:#WcfService2",
                         "MoveHnum": 800,
                         "MovePnum": 4105,
                         "MoveRate": 8000,
                         "REGION_ID": 522426213,
                         "REGION_Name": "昆寨乡"
                         }*/
                        title = obj.REGION_Name;
                        jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                        jsonObj.push({"name":"区域","value":obj.REGION_Name});
                        jsonObj.push({"name":"扶贫搬迁率","value":obj.MoveRate});
                        jsonObj.push({"name":"搬迁户数","value":obj.MoveHnum});
                        jsonObj.push({"name":"搬迁人数","value":obj.MovePnum});
                        break;
                    case XS.Main.ZoneLevel.town:
                        title = obj.REGION_Name;
                        jsonObj.push({"name":"区域ID","value":obj.REGION_ID});
                        jsonObj.push({"name":"区域","value":obj.REGION_Name});
                        jsonObj.push({"name":"扶贫搬迁率","value":obj.MoveRate});
                        jsonObj.push({"name":"搬迁户数","value":obj.MoveHnum});
                        jsonObj.push({"name":"搬迁人数","value":obj.MovePnum});
                        break;
                }
                break;
        }
        XS.Main.Tjfx.range_showThemeLayerMouseOverTip(x, y, title, jsonObj);
    }
}

/**
 * 鼠标移到专题图上 信息显示
 * @param x 鼠标x轴
 * @param y 鼠标y轴
 * @param title 标题
 * @param jsonObjArr 显示信息数据集
 */
/*XS.Main.Tjfx.range_showThemeLayerMouseOverTip = function(x, y, title, jsonObjArr){
    if (x > 20 && x < ($(window).width() - 252) && y > 20 && y < ($(window).height() - 252))
    {
        xs_isShowUtfGridTip = false;
        if ($("#xs_tjfx_range_themeTipC").length < 1)
        {
            var tag ="<div id='xs_tjfx_range_themeTipC' style='width: 200px; height: 200px; border-radius: 2px; border: 5px solid #00bbee;position:absolute;z-index: 12;opacity: 0.9; display: none;background: #ffffff;'></div>";
            $("#xs_mainC").append(tag);
        }
        $("#xs_tjfx_range_themeTipC").empty();

        var contentTag =
            '<div style="width: 100%; height: 10%; background: #00bbee;color: #ffffff;line-height: 100%;font-size: 15px;font-weight: bold;padding-left: 5px;overflow: hidden;">'+title+'</div>'+
            '<div style="border: 5px solid transparent; box-sizing: border-box; width: 100%; height: 90%;"><table border="1" style="width: 100%; height: 100%;border: 1px solid rgba(128, 128, 128, 0.16);border-collapse: collapse;font-size: 13px;">';
                for(var i=0; i<jsonObjArr.length; i++){
                    contentTag +=  '<tr><td>'+jsonObjArr[i].name+'</td><td>'+jsonObjArr[i].value+'</td></tr>';
                }
        contentTag += '</div></table>';
        $("#xs_tjfx_range_themeTipC").append(contentTag);
        $("#xs_tjfx_range_themeTipC").css({
                    left: x+ 20,
                    top: y + 20,
                    display: 'block'
        });
    }else{
        $("#xs_tjfx_range_themeTipC").css({display: 'none'});
    }
}*/
XS.Main.Tjfx.range_showThemeLayerMouseOverTip = function(x, y, title, jsonObjArr){
    xs_isShowUtfGridTip = false;
    if ($("#xs_tjfx_range_themeTipC").length < 1)
    {
        var tag ="<div id='xs_tjfx_range_themeTipC' style='width: 200px; height: 200px; border-radius: 2px; border: 5px solid #00bbee;position:absolute;z-index: 12;opacity: 0.9; display: none;background: #ffffff;'></div>";
        $("#xs_mainC").append(tag);
    }
    $("#xs_tjfx_range_themeTipC").empty();

    var contentTag =
        '<div style="width: 100%; height: 10%; background: #00bbee;color: #ffffff;line-height: 100%;font-size: 15px;font-weight: bold;padding-left: 5px;overflow: hidden;">'+title+'</div>'+
        '<div style="border: 5px solid transparent; box-sizing: border-box; width: 100%; height: 90%;"><table border="1" style="width: 100%; height: 100%;border: 1px solid rgba(128, 128, 128, 0.16);border-collapse: collapse;font-size: 13px;">';
    for(var i=0; i<jsonObjArr.length; i++){
        contentTag +=  '<tr><td>'+jsonObjArr[i].name+'</td><td>'+jsonObjArr[i].value+'</td></tr>';
    }
    contentTag += '</div></table>';
    $("#xs_tjfx_range_themeTipC").append(contentTag);

    if (x > 20 && x < ($(window).width() - 252) && y > 20 && y < ($(window).height() - 252))
    {
        $("#xs_tjfx_range_themeTipC").css({
                    left: x+ 20,
                    top: y + 20,
                    display: 'block'
        });
    }else if(x >= ($(window).width() - 252) && y >= ($(window).height() - 252)){
        $("#xs_tjfx_range_themeTipC").css({
            left: x - 252 + 30,
            top: y - 252 + 30,
            display: 'block'
        });
    }else if(x >= ($(window).width() - 252)){
        $("#xs_tjfx_range_themeTipC").css({
            left: x - 252 + 30,
            top: y + 20,
            display: 'block'
        });
    }else if(y >= ($(window).height() - 252)){
        $("#xs_tjfx_range_themeTipC").css({
            left: x + 20,
            top: y - 252 + 30,
            display: 'block'
        });
    }
}

//鼠标移动移出
XS.Main.Tjfx.range_themeLayerMouseOutCallback = function(event){
    $("#xs_tjfx_range_themeTipC").css({display: 'none'});
}

//专题图被点击事件
XS.Main.Tjfx.range_themeLayerClickCallback = function(event){
    if(event.target && event.target.refDataID)
    {
      //  xs_currentZoneLevel -= 1;
        var feature = xs_tjfx_themeLayer.getFeatureById(event.target.refDataID);
        xs_tjfx_range_centerPoint = feature.geometry.getBounds().getCenterLonLat();
        switch (xs_tjfx_zoneLevel) {
            case XS.Main.ZoneLevel.city:
            {
                xs_superZoneCode = feature.data.AdminCode;
                xs_clickMapType = XS.Main.clickMapType.tjfx_range;
                XS.Main.Tjfx.range(xs_tjfx_zoneLevel + 1, xs_superZoneCode, xs_tjfx_type);
                break;
            }
            case XS.Main.ZoneLevel.county:
            {
                xs_superZoneCode = feature.data.乡镇代码;
                xs_clickMapType = XS.Main.clickMapType.tjfx_range;
                XS.Main.Tjfx.range(xs_tjfx_zoneLevel + 1, xs_superZoneCode, xs_tjfx_type);
                break;
            }
            case XS.Main.ZoneLevel.town:
            {
                xs_superZoneCode = feature.data.OldID;
                XS.CommonUtil.showMsgDialog("", "没有下级专题图");
                xs_clickMapType = XS.Main.clickMapType.tjfx_range;
                break;
            }
        }
    }else
    {
        //XS.CommonUtil.showMsgDialog("","未找到相关数据");
        xs_clickMapType = XS.Main.clickMapType.none;
    }
}