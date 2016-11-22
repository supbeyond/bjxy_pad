/**
 * Created by Administrator on 2016/9/8.
 */
XS.Main.Tjfx.Graph = {};

//缓存行政区域Featuers
XS.Main.Tjfx.Graph.featuersArr = {
    county:{graphType:0,data:[]}, //县
    town:[], //乡
    village:[] //村
};

//缓存行政区域信息:县级参考：XS.Main.CacheZoneInfos.county
XS.Main.Tjfx.Graph.CacheZoneInfos = {
    county:{graphType:-1,data:[]},
    town:[],
    village:[]
};

XS.Main.Tjfx.Graph.barGradient = [["#00FF00","#00CD00"],["#1bff83","#1bCD83"],["#3ff3ff","#3ff3cd"],["#238aff","#23aaff"],
    ["#932eff","#932ee0"]];
XS.Main.Tjfx.Graph.filed = [
    ['C12', 'C14', 'C14A', 'C15', 'C19', 'C16', 'C17','C14B'],
    ["CoMedicalRate", "EndowRate", "LowRate"],
    ["WaterSafeNum","ElectricSafeNum","HouseSafeNum","YardHardNum"],
    ["CoMedicNum","InsureNum","WorkSkillNum","EduHelpNum","IndustyNum"],
    ["RoadHardNum","BusStateNum","WlanAndTelNum","PowerNum","ZAndHRoadHardNum"],
    ["BeautifulNum","HealthRoomNum","CultureNum","EconomyNum"]
];
XS.Main.Tjfx.Graph.axisXLabels = [
    ["耕地","林地","退耕还林","牧草","退耕还草","水域","荒漠化","林果"],
    ["参合率", "养老率", "低保率"],
    ["安全饮水","安全用电","安全住房","院坝硬化"],
    ["合作医保","养老保险","技能培训","教育资助","增收产业"],
    ["通村沥青路","通客运","通宽带及电话","通生产用电","通组及户公路"],
    ["美丽乡村","村卫生室","文化场所","村集体经济"]
];

var xs_tjfx_graph_type = 0;
var xs_tjfx_graph_themeLayer = null;
var xs_tjfx_graph_framedCloud = null;
var xs_tjfx_graph_graphType = "";
var xs_tjfx_graph_themeFields = [];
var xs_tjfx_graph_chartsSetting = null;
var xs_tjfx_graph_maxValue = 0;
var xs_tjfx_graph_zoneLevel = 0;

/**
 * 统计专题图
 * @param type 统计类型
 */
XS.Main.Tjfx.Graph.graph = function(type){
    $("#xs_tjfx_leftMenuC").menu("hide");
    XS.Main.Pkjc.closeInfoDialog();
    XS.Main.Poor.clearRelocationLayer();
    xs_markerLayer.clearMarkers();
    xs_markerLayer.setVisibility(false);
    XS.Searchbox.clearCon();
    XS.CommonUtil.closeDialog("xs_main_detail");
    xs_isShowUtfGridTip = false;
    XS.Main.hiddenDivTags();
    XS.CommonUtil.closeDialog("xs_main_fmenu_dialog");
    if(xs_currentZoneFuture != null){
        xs_tjfx_range_centerPoint = xs_currentZoneFuture.geometry.getBounds().getCenterLonLat();
        XS.Main.Tjfx.Graph.theme(xs_currentZoneLevel-1, xs_superZoneCode, type);
    }else{
        xs_tjfx_range_centerPoint = xs_MapInstance.getMapCenterPoint();
        switch (xs_user_regionLevel){
            case XS.Main.ZoneLevel.city:
            case XS.Main.ZoneLevel.county:
                XS.Main.Tjfx.Graph.theme(XS.Main.ZoneLevel.city, xs_cityID, type);
                break;
            case XS.Main.ZoneLevel.town:
                XS.Main.Tjfx.Graph.theme(XS.Main.ZoneLevel.county, xs_user_Features[0].data.县级代码, type);
                break;
            case XS.Main.ZoneLevel.village:
                XS.Main.Tjfx.Graph.theme(XS.Main.ZoneLevel.town,  xs_user_Features[0].data.Town_id, type);
                break;
        }
    }
}
/**
 *
 * @param parentLevel
 * @param parentCode
 * @param type
 */
XS.Main.Tjfx.Graph.theme = function(parentLevel,parentCode,type){
    XS.Main.Poor.clearRelocationLayer();
    XS.Main.clearMap();
    XS.Main.Pkjc.closeInfoDialog();
    XS.CommonUtil.closeDialog("xs_main_detail");
    xs_currentZoneFuture = null;
    xs_zone_vectorLayer.removeAllFeatures();

    xs_isShowUtfGridTip = false;
    //xs_currentZoneLevel = parentLevel;
    xs_tjfx_graph_zoneLevel = parentLevel;
    xs_tjfx_zoneLevel = parentLevel;
    xs_tjfx_graph_type =  type;

    XS.Main.Tjfx.removeLayer();

    xs_clickMapType = XS.Main.clickMapType.tjfx_graph;
    xs_tjfx_graph_graphType = "";
    xs_tjfx_graph_themeFields = [];
    xs_tjfx_graph_chartsSetting = null;
    var color = XS.Main.Tjfx.range_styleGroups_color;

    switch (type){
        case XS.Main.Tjfx.type.pie:
        {
            xs_tjfx_graph_graphType = "Pie";
            xs_tjfx_graph_themeFields = XS.Main.Tjfx.Graph.filed[0];
            xs_tjfx_graph_chartsSetting = {
                width: 100,
                height: 100,
                codomain: [0, 1100000],
                //sectorStyle: { fillOpacity: 0.9 },
                sectorStyleByFields: [{ fillColor: color[0] }, { fillColor: color[1] }, { fillColor: color[2] }, { fillColor: color[3] }, { fillColor: color[4] },
                    { fillColor: color[5] }, { fillColor: color[6] }, { fillColor: color[7] }],
                // 饼图扇形 hover 样式
                sectorHoverStyle: {
                    fillOpacity: 1 ,
                    fillColor: "#397B29",
                }
            };
            break;
        }
        case  XS.Main.Tjfx.type.bar.social:
        {
            XS.Main.Tjfx.Graph.themeParam("Bar",XS.Main.Tjfx.Graph.filed[1],[0, 100],[22,15,5,5],[10,10,10],
                ["100", "75", "50","25", "0"],XS.Main.Tjfx.Graph.axisXLabels[1],150);
            break;
        }
        case  XS.Main.Tjfx.type.bar.fourOf45:
        {
            XS.Main.Tjfx.Graph.themeParam("Bar",XS.Main.Tjfx.Graph.filed[2],[0, 10000],[40,15,5,5],[10,20,10],
                ["12000", "9000", "6000","3000", "0"],XS.Main.Tjfx.Graph.axisXLabels[2],260);
            break;
        }
        case  XS.Main.Tjfx.type.bar.fiveOf45:
        {
            XS.Main.Tjfx.Graph.themeParam("Bar",XS.Main.Tjfx.Graph.filed[3],[0, 40000],[40,15,5,5],[15,20,15],
                ["40000", "30000", "20000","10000", "0"],XS.Main.Tjfx.Graph.axisXLabels[3],320);
            break;
        }
        case  XS.Main.Tjfx.type.bar.fiveOf54:
        {
            XS.Main.Tjfx.Graph.themeParam("Bar",XS.Main.Tjfx.Graph.filed[4],[0, 200],[22,15,5,5],[15,30,15],
                ["200", "150", "100","50", "0"],XS.Main.Tjfx.Graph.axisXLabels[4],380);
            break;
        }
        case  XS.Main.Tjfx.type.bar.fourOf54:
        {
            XS.Main.Tjfx.Graph.themeParam("Bar",XS.Main.Tjfx.Graph.filed[5],[0, 40],[22,15,5,5],[10,20,10],
                ["40", "30", "20","10", "0"],XS.Main.Tjfx.Graph.axisXLabels[5],250);
            break;
        }
    }

    // 创建一个统计专题图图层
    xs_tjfx_graph_themeLayer = new SuperMap.Layer.Graph("ThemeLayer", xs_tjfx_graph_graphType);
    // 指定用于专题图制作的属性字段
    xs_tjfx_graph_themeLayer.themeFields = xs_tjfx_graph_themeFields;
    // 配置图表参数
    xs_tjfx_graph_themeLayer.chartsSetting = xs_tjfx_graph_chartsSetting;

    xs_tjfx_graph_themeLayer.setOpacity(0.9);
    xs_tjfx_graph_themeLayer.isOverLay = true;

    if(document.getElementById("xs_tjfx_range_Legend")){
        $("#xs_tjfx_range_Legend").remove();
    }

    $("#xs_mainC").append(XS.Main.Tjfx.range_createRangeLegendTag(type,parentLevel));
    $("#xs_tjfx_range_Legend").css("display", "block");

    // 注册专题图 mousemove, mouseout事件(注意：专题图图层对象自带 on 函数，没有 events 对象)
    xs_tjfx_graph_themeLayer.on("mousemove", XS.Main.Tjfx.Graph.showInfoWin);
    xs_tjfx_graph_themeLayer.on("mouseout", XS.Main.Tjfx.Graph.closeInfoWin);
    xs_tjfx_graph_themeLayer.on("click", XS.Main.Tjfx.Graph.themeLayerClickCallback);

    xs_tjfx_graph_themeLayer.setVisibility(false);
    xs_MapInstance.getMapObj().addLayer(xs_tjfx_graph_themeLayer);

    var data = {};
    switch (parentLevel)
    {
        case XS.Main.ZoneLevel.city:
        {
            xs_MapInstance.getMapObj().setCenter(xs_tjfx_range_centerPoint, 2);
            XS.CommonUtil.showLoader();
            //1.先获业务数据通过业务数据
            //2.获取空间数据
            //3.通过业务数据过滤空间数据

            if(type == XS.Main.Tjfx.Graph.CacheZoneInfos.county.graphType && XS.Main.Tjfx.Graph.CacheZoneInfos.county.data.length > 0){
                //2.获取空间数据
                if(XS.Main.Tjfx.Graph.featuersArr.county.data.length > 0){
                    XS.Main.Tjfx.Graph.addFeatures2Layer(XS.Main.Tjfx.Graph.featuersArr.county.data,XS.Main.Tjfx.Graph.CacheZoneInfos.county.data,0);
                    return;
                }
                if(XS.Main.Tjfx.Graph.featuersArr.county.data.length < 1){

                    XS.CommonUtil.showLoader();
                    XS.Main.Tjfx.Graph.loadZoneFeatuers(parentLevel, "SMID>0", function()
                        {
                            XS.CommonUtil.hideLoader();
                            if(XS.Main.Tjfx.Graph.featuersArr.county.data.length>0)
                            {
                                XS.Main.Tjfx.Graph.addFeatures2Layer(XS.Main.Tjfx.Graph.featuersArr.county.data,XS.Main.Tjfx.Graph.CacheZoneInfos.county.data,0);
                            }else{
                                XS.CommonUtil.showMsgDialog("","未找到相关数据！");
                            }
                        }, function(e)
                        {
                            XS.CommonUtil.showMsgDialog("","请求数据失败！");
                            XS.CommonUtil.hideLoader();
                        }
                    );
                }
            }else {
                var action = "";
                switch (type) {
                    case XS.Main.Tjfx.type.pie:
                        action = "QueryCounty_EarthInfo";
                        break;
                    case XS.Main.Tjfx.type.bar.social:
                        action = "QuerySocityProtectBycounty";
                        break;
                    case XS.Main.Tjfx.type.bar.fourOf45:
                    case XS.Main.Tjfx.type.bar.fiveOf45:
                        action = "QueryFourFiveByAreaId";
                        break;
                    case XS.Main.Tjfx.type.bar.fiveOf54:
                    case XS.Main.Tjfx.type.bar.fourOf54:
                        action = "QueryVillFiveFourByCountByAreaId";
                        break;
                }

                data = {pid: parentCode,pd_id: parentCode};
                XS.CommonUtil.showLoader();
                XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json) {
                    XS.CommonUtil.hideLoader();
                    if (json && json.length > 0) {
                        switch (type){
                            case XS.Main.Tjfx.type.bar.fiveOf54:
                            case XS.Main.Tjfx.type.bar.fourOf54:
                            {
                                for(var i in json){
                                    json[i].WlanAndTelNum = json[i].WlanNum +　json[i].TelNum;
                                    json[i].ZAndHRoadHardNum = json[i].ZRoadHardNum +　json[i].HRoadHardNum;
                                }

                                break
                            }
                        }
                        XS.Main.Tjfx.Graph.CacheZoneInfos.county.data = json;
                        XS.Main.Tjfx.Graph.CacheZoneInfos.county.graphType = type;

                        //2.获取空间数据
                        if (XS.Main.Tjfx.Graph.featuersArr.county.data.length > 0) {
                            XS.Main.Tjfx.Graph.addFeatures2Layer(XS.Main.Tjfx.Graph.featuersArr.county.data, XS.Main.Tjfx.Graph.CacheZoneInfos.county.data, 0);
                            return;
                        }
                        if (XS.Main.Tjfx.Graph.featuersArr.county.data.length < 1) {

                            XS.CommonUtil.showLoader();
                            XS.Main.Tjfx.Graph.loadZoneFeatuers(parentLevel, "SMID>0", function () {
                                    XS.CommonUtil.hideLoader();
                                    if (XS.Main.Tjfx.Graph.featuersArr.county.data.length > 0) {
                                        XS.Main.Tjfx.Graph.addFeatures2Layer(XS.Main.Tjfx.Graph.featuersArr.county.data,XS.Main.Tjfx.Graph.CacheZoneInfos.county.data,0);
                                    }else{
                                        XS.CommonUtil.showMsgDialog("","未找到相关数据！");
                                    }
                                }, function (e) {
                                    XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                                    XS.CommonUtil.hideLoader();
                                }
                            );
                        }
                    } else {
                        XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                    }
                }, function (e) {
                    XS.CommonUtil.hideLoader();
                });
            }
            break;
        }
        case XS.Main.ZoneLevel.county:
        {
            xs_MapInstance.getMapObj().setCenter(xs_tjfx_range_centerPoint, 6);
            XS.CommonUtil.showLoader();

            //请求镇级数据
            var action = "";
            switch (type){
                case XS.Main.Tjfx.type.pie:
                    action = "QueryTowns_EarthInfo";
                    break;
                case XS.Main.Tjfx.type.bar.social:
                    action = "QuerySocityProtectByTown";
                    break;
                case XS.Main.Tjfx.type.bar.fourOf45:
                case XS.Main.Tjfx.type.bar.fiveOf45:
                    action = "QueryFourFiveByAreaId";
                    break;
                case XS.Main.Tjfx.type.bar.fiveOf54:
                case XS.Main.Tjfx.type.bar.fourOf54:
                    action = "QueryVillFiveFourByCountByAreaId";
                    break;
            }
            data = {pid:parentCode,pd_id:parentCode};
            XS.CommonUtil.showLoader();
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json) {
                XS.CommonUtil.hideLoader();
                if (json && json.length > 0)
                {
                    switch (type){
                        case XS.Main.Tjfx.type.bar.fiveOf54:
                        case XS.Main.Tjfx.type.bar.fourOf54:
                        {
                            for(var i in json){
                                json[i].WlanAndTelNum = json[i].WlanNum +　json[i].TelNum;
                                json[i].ZAndHRoadHardNum = json[i].ZRoadHardNum +　json[i].HRoadHardNum;
                            }

                            break
                        }
                    }
                    XS.Main.Tjfx.Graph.CacheZoneInfos.town = json;
                    XS.CommonUtil.showLoader();
                    XS.Main.Tjfx.Graph.loadZoneFeatuers(parentLevel, "县级代码=="+parentCode, function()
                        {
                            XS.CommonUtil.hideLoader();
                            if(XS.Main.Tjfx.Graph.featuersArr.town.length>0)
                            {
                                XS.Main.Tjfx.Graph.addFeatures2Layer(XS.Main.Tjfx.Graph.featuersArr.town,XS.Main.Tjfx.Graph.CacheZoneInfos.town,1);
                            }else{
                                XS.CommonUtil.showMsgDialog("", "未找到相关数据！");
                            }
                        }, function(e)
                        {
                            XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                            XS.CommonUtil.hideLoader();
                        }
                    );
                }else{
                    XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                }
            },function(e){XS.CommonUtil.hideLoader();});
            break;
        }
        case XS.Main.ZoneLevel.town:
        {
            xs_MapInstance.getMapObj().setCenter(xs_tjfx_range_centerPoint, 9);
            XS.CommonUtil.showLoader();

            //请求村数据
            var action = "";
            switch (type){
                case XS.Main.Tjfx.type.pie:
                    action = "QueryVillEarthInfo";
                    break;
                case XS.Main.Tjfx.type.bar.social:
                    action = "QuerySocityProtectByTown";
                    break;
                case XS.Main.Tjfx.type.bar.fourOf45:
                case XS.Main.Tjfx.type.bar.fiveOf45:
                    action = "QueryFourFiveByAreaId";
                    break;
                case XS.Main.Tjfx.type.bar.fiveOf54:
                case XS.Main.Tjfx.type.bar.fourOf54:
                    action = "QueryVillFiveFourByCountByAreaId";
                    break;
            }
            data = {pid:parentCode, pd_id:parentCode};
            XS.CommonUtil.showLoader();
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json) {
                XS.CommonUtil.hideLoader();
                if (json && json.length > 0)
                {
                    switch (type){
                        case XS.Main.Tjfx.type.bar.fiveOf54:
                        case XS.Main.Tjfx.type.bar.fourOf54:
                        {
                            for(var i in json){
                                json[i].WlanAndTelNum = json[i].WlanNum +　json[i].TelNum;
                                json[i].ZAndHRoadHardNum = json[i].ZRoadHardNum +　json[i].HRoadHardNum;
                            }

                            break
                        }
                    }
                    XS.Main.Tjfx.Graph.CacheZoneInfos.village = json;
                    XS.CommonUtil.showLoader();
                    XS.Main.Tjfx.Graph.loadZoneFeatuers(parentLevel, "Town_id=="+parentCode, function()
                        {
                            XS.CommonUtil.hideLoader();
                            if(XS.Main.Tjfx.Graph.featuersArr.village.length>0)
                            {
                                XS.Main.Tjfx.Graph.addFeatures2Layer(XS.Main.Tjfx.Graph.featuersArr.village,XS.Main.Tjfx.Graph.CacheZoneInfos.village,2);
                            }else{
                                XS.CommonUtil.showMsgDialog("", "未找到相关数据！");
                            }
                            XS.CommonUtil.hideLoader();
                        }, function(e)
                        {
                            XS.CommonUtil.hideLoader();
                            XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                        }
                    );
                }else{
                    XS.CommonUtil.showMsgDialog("", "获取数据失败！");
                }
            },function(e){XS.CommonUtil.hideLoader();});
            break;
        }
    }
}
/**
 * 配置graph专题图层的参数
 * @param graph
 * @param fields
 * @param codomain
 * @param ViewBox
 * @param axisYLabels
 * @param axisXLabels
 * @param width
 */
XS.Main.Tjfx.Graph.themeParam = function(graph,fields,codomain,ViewBox,xShapeBlank,axisYLabels,axisXLabels,width){
    xs_tjfx_graph_graphType = graph;
    xs_tjfx_graph_themeFields = fields;
    xs_tjfx_graph_chartsSetting = {
        // width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
        width: width,
        height: 100,
        codomain: codomain, // 允许图表展示的值域范围，此范围外的数据将不制作图表
        dataViewBoxParameter:ViewBox,
        barStyle: { fillOpacity: 0.7 }, // 柱状图中柱条的（表示字段值的图形）样式
        barHoverStyle: {fillOpacity: 1}, // 柱条 hover 样式
        xShapeBlank: xShapeBlank, // 水平方向上的空白间距参数
        axisYTick: 4, // y 轴刻度数量
        axisYLabels: axisYLabels, // y 轴标签内容
        axisXLabels: axisXLabels, // x 轴标签内容
        backgroundStyle: {fillColor: "#CCE8CF"}, // 背景样式
        backgroundRadius: [5, 5, 5, 5], // 背景框圆角参数
        //阴影开关 默认是打开
        showShadow: true,
        //阴影样式
        barShadowStyle:{shadowBlur : 8, shadowOffsetX: 2 , shadowOffsetY : 2,shadowColor : "rgba(100,100,100,0.8)"},
        //按字段设置柱条样式[渐变开始颜色,渐变终止颜色] 与 themeLayer.themeFields 中的字段一一对应）
        barLinearGradient: XS.Main.Tjfx.Graph.barGradient
    };
}

//加载县、乡、村features
XS.Main.Tjfx.Graph.loadZoneFeatuers = function(parentLevel, sql, succeedCallback, failCallback){
    var layerName = "";
    switch (parentLevel) {
        case XS.Main.ZoneLevel.city:
            if(XS.Main.Tjfx.Graph.featuersArr.county.data.length>0){
                succeedCallback();
                return;
            }
            layerName = "County_Code";
            break;
        case XS.Main.ZoneLevel.county:
            layerName = "Twon_Code";
            break;
        case XS.Main.ZoneLevel.town:
            layerName = "Village_Code";
            break;
    }
    XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, layerName, sql, xs_MapInstance.bLayerUrl,function(queryEventArgs)
    {
        switch (parentLevel) {
            case XS.Main.ZoneLevel.county:
                XS.Main.Tjfx.Graph.featuersArr.town = [];
                break;
            case XS.Main.ZoneLevel.town:
                XS.Main.Tjfx.Graph.featuersArr.village = [];
                break;
        }
        var i, feature, result = queryEventArgs.result;
        if (result && result.recordsets&&result.recordsets[0].features.length>0) {
            for (i = 0; i < result.recordsets[0].features.length; i++) {
                feature = result.recordsets[0].features[i];
                switch (parentLevel) {
                    case XS.Main.ZoneLevel.city:
                        XS.Main.Tjfx.Graph.featuersArr.county.data.push(feature);
                        break;
                    case XS.Main.ZoneLevel.county:
                        XS.Main.Tjfx.Graph.featuersArr.town.push(feature);
                        break;
                    case XS.Main.ZoneLevel.town:
                        XS.Main.Tjfx.Graph.featuersArr.village.push(feature);
                        break;
                }
            }
            if(parentLevel == XS.Main.ZoneLevel.city){
                XS.Main.Tjfx.Graph.featuersArr.county.graphType = xs_tjfx_graph_type;
            }
            succeedCallback();
        }else{
            succeedCallback();
        }
    }, function(e){
        failCallback(e);
    });
}
//添加Features到ThemeLayer
XS.Main.Tjfx.Graph.addFeatures2Layer = function(featureArr, data, parentLevel){ // 0:city 1:county 2:town

    var oId = "";
    var fId = "";

    switch (parentLevel){
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
    switch (xs_tjfx_graph_type)
    {
        case XS.Main.Tjfx.type.pie:
            oId = "regionid";
            break;
        case XS.Main.Tjfx.type.bar.social:
        case XS.Main.Tjfx.type.bar.fourOf45:
        case XS.Main.Tjfx.type.bar.fiveOf45:
        case XS.Main.Tjfx.type.bar.fiveOf54:
        case XS.Main.Tjfx.type.bar.fourOf54:
            oId = "REGION_ID";
            break;
    }

    var features = [];
    var feature = null;
    xs_tjfx_graph_maxValue = 0;

    var xOff = (1 / xs_MapInstance.getMapObj().getScale()) * 0.00000001;
    var yOff = -(1 / xs_MapInstance.getMapObj().getScale()) * 0.00000005;

    for (var i in featureArr)
    {
        feature = featureArr[i];
        for(var j=0; j<data.length; j++)
        {
            var obj = data[j];
            if(!obj){
                continue;
            }
            if(obj[oId]==feature.data[fId])
            {
                var isNext = false;
                switch (parentLevel){
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
                var fileds = [];
                switch (xs_tjfx_graph_type)
                {
                    case XS.Main.Tjfx.type.pie:
                    {
                        fileds = XS.Main.Tjfx.Graph.filed[0];
                        break;
                    }
                    case XS.Main.Tjfx.type.bar.social:
                    {
                        fileds = XS.Main.Tjfx.Graph.filed[1];
                        break;
                    }
                    case XS.Main.Tjfx.type.bar.fourOf45:
                    {
                        fileds = XS.Main.Tjfx.Graph.filed[2];
                        break;
                    }
                    case XS.Main.Tjfx.type.bar.fiveOf45:
                    {
                        fileds = XS.Main.Tjfx.Graph.filed[3];
                        break;
                    }
                    case XS.Main.Tjfx.type.bar.fiveOf54:
                    {
                        fileds = XS.Main.Tjfx.Graph.filed[4];
                        break;
                    }
                    case XS.Main.Tjfx.type.bar.fourOf54:
                    {
                        fileds = XS.Main.Tjfx.Graph.filed[5];
                        break;
                    }
                }
                for(var i in fileds){
                    feature.attributes[fileds[i]] = obj[fileds[i]]==null ? 0 : obj[fileds[i]];
                    xs_tjfx_graph_maxValue = xs_tjfx_graph_maxValue > obj[fileds[i]] ? xs_tjfx_graph_maxValue : obj[fileds[i]];
                }

                feature.data.xs_data = obj;
                features.push(feature);
            }
        }
    }
    switch (xs_tjfx_graph_type){
        case XS.Main.Tjfx.type.bar.fourOf45:
        case XS.Main.Tjfx.type.bar.fiveOf45:
        case XS.Main.Tjfx.type.bar.fiveOf54:
        case XS.Main.Tjfx.type.bar.fourOf54:
        {
            var axisYInterval = Math.ceil(xs_tjfx_graph_maxValue/4);
            var maxValueLength = axisYInterval.toString().length;
            if(axisYInterval == 0){
                axisYInterval = 4;
            }
            else if(axisYInterval>10 && axisYInterval<=20 && axisYInterval%2!=0){
                axisYInterval += 1;
            }else if(axisYInterval>20 && axisYInterval%(Math.pow(10,maxValueLength-1))!=0){
                var bottomValue = Math.floor(axisYInterval/(Math.pow(10,maxValueLength-1)))*10;
                var before2 = Math.floor(axisYInterval/(Math.pow(10,maxValueLength-2)));
                if(before2>=bottomValue && before2<bottomValue+5)
                {
                    axisYInterval = (bottomValue+5)*(Math.pow(10,maxValueLength-2));
                }else if(before2>=bottomValue+5 && before2<bottomValue+10){
                    axisYInterval = (bottomValue+10)*(Math.pow(10,maxValueLength-2));
                }
            }
            var codomain = [0,axisYInterval * 4];
            var axisYLabels = [axisYInterval * 4, axisYInterval * 3, axisYInterval * 2,axisYInterval * 1, "0"];
            xs_tjfx_graph_themeLayer.chartsSetting.codomain = codomain;
            xs_tjfx_graph_themeLayer.chartsSetting.axisYLabels = axisYLabels;
        }
    }

    xs_tjfx_graph_themeLayer.addFeatures(features);
    xs_tjfx_graph_themeLayer.setVisibility(true);
    XS.CommonUtil.hideLoader();
}
/**
 * 专题图pie mousemove事件
 * @param e
 */
XS.Main.Tjfx.Graph.showInfoWin = function(e){
    $("#xs_tjfx_graph_themeTipC").css("display", "none");
    if(e.target && e.target.refDataID && e.target.dataInfo){
        XS.Main.Tjfx.Graph.closeInfoWin(e);
         // 获取图形对应的数据 (feature)
        var fea = xs_tjfx_graph_themeLayer.getFeatureById(e.target.refDataID);
        if(fea == null){
            return;
        }
        var attributes = fea.attributes;
        var info = e.target.dataInfo;
        var sum = 0;
        switch(xs_tjfx_graph_type){
            case XS.Main.Tjfx.type.pie:{
                for(var i in XS.Main.Tjfx.Graph.filed[0]){
                    sum +=　parseInt(attributes[XS.Main.Tjfx.Graph.filed[0][i]]);
                }
                break;
            }
        }

        var jsonObjArr = [];
        var title = "";
        var x = e.event.clientX;
        var y = e.event.clientY;
        switch (xs_tjfx_graph_zoneLevel){
            case XS.Main.ZoneLevel.city:
            {
                jsonObjArr.push({name:'区域',value:attributes.Name});
                jsonObjArr.push({name:'区域ID',value:attributes.AdminCode});
                break;
            }
            case XS.Main.ZoneLevel.county:
            {
                jsonObjArr.push({name:'区域',value:attributes.乡镇名称});
                jsonObjArr.push({name:'区域ID',value:attributes.乡镇代码});
                break;
            }
            case XS.Main.ZoneLevel.town:
            {
                jsonObjArr.push({name:'区域',value:attributes.vd_name});
                jsonObjArr.push({name:'区域ID',value:attributes.OldID});
                break;
            }
        }

        switch (xs_tjfx_graph_type){
            case XS.Main.Tjfx.type.pie:{
                title = "土地信息";
                switch (info.field){
                    case "C12":{
                        jsonObjArr.push({name:'土地类型',value:"耕地"});
                        jsonObjArr.push({name:'面积',value:attributes.C12});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C12/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C14":{
                        jsonObjArr.push({name:'土地类型',value:"林地"});
                        jsonObjArr.push({name:'面积',value:attributes.C14});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C14/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C14A":{
                        jsonObjArr.push({name:'土地类型',value:"退耕还林"});
                        jsonObjArr.push({name:'面积',value:attributes.C14A});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C14A/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C15":{
                        jsonObjArr.push({name:'土地类型',value:"牧草"});
                        jsonObjArr.push({name:'面积',value:attributes.C15});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C15/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C19":{
                        jsonObjArr.push({name:'土地类型',value:"退耕还草"});
                        jsonObjArr.push({name:'面积',value:attributes.C19});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C19/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C16":{
                        jsonObjArr.push({name:'土地类型',value:"水域"});
                        jsonObjArr.push({name:'面积',value:attributes.C16});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C16/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C17":{
                        jsonObjArr.push({name:'土地类型',value:"荒漠化"});
                        jsonObjArr.push({name:'面积',value:attributes.C17});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C17/sum)*100).toFixed(2)});
                        break;
                    }
                    case "C14B":{
                        jsonObjArr.push({name:'土地类型',value:"林果"});
                        jsonObjArr.push({name:'面积',value:attributes.C14B});
                        jsonObjArr.push({name:'占比(%)',value:new Number((attributes.C14B/sum)*100).toFixed(2)});
                        break;
                    }
                }
                break;
            }
            case XS.Main.Tjfx.type.bar.social:{
                title = "社会保障";
                for(var i in XS.Main.Tjfx.Graph.filed[1]){
                    if(XS.Main.Tjfx.Graph.filed[1][i] == info.field){
                        jsonObjArr.push({name:XS.Main.Tjfx.Graph.axisXLabels[1][i],value:new Number(info.value).toFixed(2)});
                    }
                }
                break;
            }
            case XS.Main.Tjfx.type.bar.fourOf45:{
                title = "四有五覆盖(四有)";
                for(var i in XS.Main.Tjfx.Graph.filed[2]){
                    if(XS.Main.Tjfx.Graph.filed[2][i] == info.field){
                        jsonObjArr.push({name:XS.Main.Tjfx.Graph.axisXLabels[2][i],value:new Number(info.value).toFixed(2)});
                    }
                }
                break;
            }
            case XS.Main.Tjfx.type.bar.fiveOf45:{
                title = "四有五覆盖(五覆盖)";
                for(var i in XS.Main.Tjfx.Graph.filed[3]){
                    if(XS.Main.Tjfx.Graph.filed[3][i] == info.field){
                        jsonObjArr.push({name:XS.Main.Tjfx.Graph.axisXLabels[3][i],value:new Number(info.value).toFixed(2)});
                    }
                }
                break;
            }
            case XS.Main.Tjfx.type.bar.fiveOf54:{
                title = "四有五覆盖(五覆盖)";
                for(var i in XS.Main.Tjfx.Graph.filed[4]){
                    if(XS.Main.Tjfx.Graph.filed[4][i] == info.field){
                        jsonObjArr.push({name:XS.Main.Tjfx.Graph.axisXLabels[4][i],value:new Number(info.value).toFixed(2)});
                    }
                }
                break;
            }
            case XS.Main.Tjfx.type.bar.fourOf54:{
                title = "四有五覆盖(五覆盖)";
                for(var i in XS.Main.Tjfx.Graph.filed[5]){
                    if(XS.Main.Tjfx.Graph.filed[5][i] == info.field){
                        jsonObjArr.push({name:XS.Main.Tjfx.Graph.axisXLabels[5][i],value:new Number(info.value).toFixed(2)});
                    }
                }
                break;
            }
        }
        XS.Main.Tjfx.Graph.MouseOverTip(x, y, title, jsonObjArr);
    }
}
/**
 * 专题图pie mouseout事件
 * @param e
 */
XS.Main.Tjfx.Graph.closeInfoWin = function (e) {
    if(xs_tjfx_graph_framedCloud) {
        try {
            xs_MapInstance.getMapObj().removePopup(xs_tjfx_graph_framedCloud);
            xs_tjfx_graph_framedCloud = null;
        }
        catch(e) {
            alert(e.message);
        }
    }
}
//创建统计专题 图例
XS.Main.Tjfx.Graph.createGraphLegendTag = function(){
    var tag = '<div id="xs_tjfx_graph_Legend">'+
        '<div class="legendTitle">'+
        '<span>图例</span>'+
        '</div>'+
        '<div class="legendContent">'+
        '<table>'+
        '<tr>';
    switch (xs_tjfx_graph_type)
    {
        case XS.Main.Tjfx.Graph.Type.pie:
        {
            tag += '<td class="legendItemHeader">土地信息</td><td class="legendItemValue">颜色</td></tr>';

            for(var i in XS.Main.Tjfx.Graph.axisXLabels[0]){
                tag += '<tr>';
                tag += '<td class="legendItemHeader">'+XS.Main.Tjfx.Graph.axisXLabels[0][i]+'</td>';
                tag += "<td class='legendItemValue' style='background: "+XS.Main.Tjfx.range_styleGroups_color[i]+"'"+"></td>";
                tag += '</tr>';
            }
            break;
        }
        case XS.Main.Tjfx.Graph.Type.bar.social:
        {
            tag += '<td class="legendItemHeader">社会保障</td><td class="legendItemValue">颜色</td></tr>';

            for(var i in XS.Main.Tjfx.Graph.axisXLabels[1]){
                tag += '<tr>';
                tag += '<td class="legendItemHeader">'+XS.Main.Tjfx.Graph.axisXLabels[1][i]+'</td>';
                tag += '<td class="legendItemValue" style="background: -WebKit-linear-gradient( top,'
                    + XS.Main.Tjfx.Graph.barGradient[i][0] + ',' + XS.Main.Tjfx.Graph.barGradient[i][1] + ');"></td>';
                tag += '</tr>';
            }
            break;
        }
        case XS.Main.Tjfx.Graph.Type.bar.fourOf45:
        {
            tag += '<td class="legendItemHeader">四有五覆盖(四有)</td><td class="legendItemValue">颜色</td></tr>';

            for(var i in XS.Main.Tjfx.Graph.axisXLabels[2]){
                tag += '<tr>';
                tag += '<td class="legendItemHeader">'+XS.Main.Tjfx.Graph.axisXLabels[2][i]+'</td>';
                tag += '<td class="legendItemValue" style="background: -WebKit-linear-gradient( top,'
                    + XS.Main.Tjfx.Graph.barGradient[i][0] + ',' + XS.Main.Tjfx.Graph.barGradient[i][1] + ');"></td>';
                tag += '</tr>';
            }
            break;
        }
        case XS.Main.Tjfx.Graph.Type.bar.fiveOf45:
        {
            tag += '<td class="legendItemHeader">四有五覆盖(五覆盖)</td><td class="legendItemValue">颜色</td></tr>';

            for(var i in XS.Main.Tjfx.Graph.axisXLabels[3]){
                tag += '<tr>';
                tag += '<td class="legendItemHeader">'+XS.Main.Tjfx.Graph.axisXLabels[3][i]+'</td>';
                tag += '<td class="legendItemValue" style="background: -WebKit-linear-gradient( top,'
                    + XS.Main.Tjfx.Graph.barGradient[i][0] + ',' + XS.Main.Tjfx.Graph.barGradient[i][1] + ');"></td>';
                tag += '</tr>';
            }
            break;
        }
        case XS.Main.Tjfx.Graph.Type.bar.fiveOf54:
        {
            tag += '<td class="legendItemHeader">五通四有(五通)</td><td class="legendItemValue">颜色</td></tr>';

            for(var i in XS.Main.Tjfx.Graph.axisXLabels[4]){
                tag += '<tr>';
                tag += '<td class="legendItemHeader">'+XS.Main.Tjfx.Graph.axisXLabels[4][i]+'</td>';
                tag += '<td class="legendItemValue" style="background: -WebKit-linear-gradient( top,'
                    + XS.Main.Tjfx.Graph.barGradient[i][0] + ',' + XS.Main.Tjfx.Graph.barGradient[i][1] + ');"></td>';
                tag += '</tr>';
            }
            break;
        }
        case XS.Main.Tjfx.Graph.Type.bar.fourOf54:
        {
            tag += '<td class="legendItemHeader">五通四有(四有)</td><td class="legendItemValue">颜色</td></tr>';

            for(var i in XS.Main.Tjfx.Graph.axisXLabels[2]){
                tag += '<tr>';
                tag += '<td class="legendItemHeader">'+XS.Main.Tjfx.Graph.axisXLabels[2][i]+'</td>';
                tag += '<td class="legendItemValue" style="background: -WebKit-linear-gradient( top,'
                    + XS.Main.Tjfx.Graph.barGradient[i][0] + ',' + XS.Main.Tjfx.Graph.barGradient[i][1] + ');"></td>';
                tag += '</tr>';
            }
            break;
        }
    }
    tag += '</table></div></div>';

    return tag;
}

//专题图被点击事件
XS.Main.Tjfx.Graph.themeLayerClickCallback = function(event){
    if(event.target && event.target.refDataID)
    {
        var feature = xs_tjfx_graph_themeLayer.getFeatureById(event.target.refDataID);
        xs_tjfx_range_centerPoint = feature.geometry.getBounds().getCenterLonLat();

        xs_currentZoneFuture = null;
        switch (xs_tjfx_graph_zoneLevel) {
            case XS.Main.ZoneLevel.city:
            {
                xs_superZoneCode = feature.data.AdminCode;
                xs_clickMapType = XS.Main.clickMapType.tjfx_graph;
                XS.Main.Tjfx.Graph.theme(xs_tjfx_graph_zoneLevel+1, xs_superZoneCode, xs_tjfx_graph_type);
                break;
            }
            case XS.Main.ZoneLevel.county:
            {
                xs_superZoneCode = feature.data.乡镇代码;
                xs_clickMapType = XS.Main.clickMapType.tjfx_graph;
                XS.Main.Tjfx.Graph.theme(xs_tjfx_graph_zoneLevel+1, xs_superZoneCode, xs_tjfx_graph_type);
                break;
            }
            case XS.Main.ZoneLevel.town:
            {
                xs_superZoneCode = feature.data.OldID;
                xs_clickMapType = XS.Main.clickMapType.none;
                XS.CommonUtil.showMsgDialog("", "没有下级专题图");
                xs_clickMapType = XS.Main.clickMapType.tjfx_graph;
                // xs_clickMapType = XS.Main.clickMapType.none;
                break;
            }
        }
    }else
    {
        //XS.CommonUtil.showMsgDialog("","未找到相关数据");
        xs_clickMapType = XS.Main.clickMapType.none;
    }
}
/**
 * 显示鼠标移动掠过的专题图信息
 * @param x
 * @param y
 * @param title
 * @param jsonObjArr
 */
XS.Main.Tjfx.Graph.MouseOverTip = function(x, y, title, jsonObjArr){
    if ($("#xs_tjfx_graph_themeTipC").length < 1)
    {
        var tag ="<div id='xs_tjfx_graph_themeTipC' style='width: 200px; height: 200px; border-radius: 2px; border: 5px solid #00bbee;position:absolute;z-index: 12;opacity: 0.9; display: none;background: #ffffff;'></div>";
        $("#xs_mainC").append(tag);
    }
    $("#xs_tjfx_graph_themeTipC").empty();

    var contentTag =
        '<div id="xs_tjfx_graph_themeTipCTitile" style="width: 100%; height: 10%; background: #00bbee;color: #ffffff;line-height: 100%;font-size: 15px;font-weight: bold;padding-left: 5px;overflow: hidden;">'+title+'</div>'+
        '<div style="border: 5px solid transparent; box-sizing: border-box; width: 100%; height: 90%;"><table border="1" style="width: 100%; height: 100%;border: 1px solid rgba(128, 128, 128, 0.16);border-collapse: collapse;font-size: 13px;">';
    for(var i=0; i<jsonObjArr.length; i++){
        contentTag +=  '<tr><td style="width: 50%;">'+jsonObjArr[i].name+'</td><td>'+jsonObjArr[i].value+'</td></tr>';
    }
    contentTag += '</div></table>';
    $("#xs_tjfx_graph_themeTipC").append(contentTag);

    switch (xs_tjfx_graph_type){
        case XS.Main.Tjfx.type.pie:{
            $("#xs_tjfx_graph_themeTipC").css({height:"200px"});
            break;
        }
        case XS.Main.Tjfx.type.bar.social:
        case XS.Main.Tjfx.type.bar.fourOf45:
        case XS.Main.Tjfx.type.bar.fiveOf45:
        case XS.Main.Tjfx.type.bar.fiveOf54:
        case XS.Main.Tjfx.type.bar.fourOf54:
        {
            $("#xs_tjfx_graph_themeTipC").css({height:"140px"});
            $("#xs_tjfx_graph_themeTipCTitile").css({height:"14%"});
            break;
        }
    }

    if (x > 20 && x < ($(window).width() - 252) && y > 20 && y < ($(window).height() - 252))
    {
        $("#xs_tjfx_graph_themeTipC").css({
            left: x+ 20,
            top: y + 20,
            display: 'block'
        });
    }else if(x >= ($(window).width() - 252) && y >= ($(window).height() - 252)){
        if(xs_tjfx_graph_type == XS.Main.Tjfx.type.pie){
            $("#xs_tjfx_graph_themeTipC").css({
                left: x - 252 + 30,
                top: y - 252 + 40,
                display: 'block'
            });
        }else{
            $("#xs_tjfx_graph_themeTipC").css({
                left: x - 252 + 30,
                top: y - 252 + 90,
                display: 'block'
            });
        }
    }else if(x >= ($(window).width() - 252)){
        $("#xs_tjfx_graph_themeTipC").css({
            left: x - 252 + 30,
            top: y + 20,
            display: 'block'
        });
    }else if(y >= ($(window).height() - 252)){
        if(xs_tjfx_graph_type == XS.Main.Tjfx.type.pie){
            $("#xs_tjfx_graph_themeTipC").css({
                left: x + 20,
                top: y - 252 + 40,
                display: 'block'
            });
        }else{
            $("#xs_tjfx_graph_themeTipC").css({
                left: x + 20,
                top: y - 252 + 90,
                display: 'block'
            });
        }
    }
}