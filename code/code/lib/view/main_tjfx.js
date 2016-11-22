/**
 * Created by GZXS on 2016/7/2.
 */
//统计分析
XS.Main.Tjfx={};

var xs_tjfx_themeLayer = null; //统计分析专题图
var xs_tjfx_type = -1; //当前统计类型

//统计类型
XS.Main.Tjfx.type = {
    range_pkfsx:0, //分段--贫困发生率
    range_tpx:1,   //分段--脱贫率
    range_wfx:2,   //分段--危房率
    range_fpbqx:3,   //分段--扶贫搬迁率
    poorType:4,
    pie:5, //图表pie--土地信息
    bar:{social:6,fourOf45:7,fiveOf45:8,fiveOf54:9,fourOf54:10}
}

//缓存行政区域Featuers
XS.Main.Tjfx.type_featuersArr = {
    county:[], //县
    town:[], //乡
    village:[] //村
};

//缓存行政区域信息:县级参考：XS.Main.CacheZoneInfos.county
XS.Main.Tjfx.CacheZoneInfos = {
    county:[],
    town:[],
    village:[]
};

//展示左边统计工具栏
var xs_tjfx_toolmenu_isShow = false;
XS.Main.Tjfx.showToolMenu = function(){
    /*XS.Main.hiddenDivTags();
    XS.Main.closeDialogs();
    XS.Main.hiddenLayers();*/
    if(xs_tjfx_toolmenu_isShow){
        xs_tjfx_toolmenu_isShow = false;
        $("#xs_tjfx_leftMenuC").menu("hide");
        $("#xs_tjfx_leftMenu").panel('close');
    }else{
        xs_tjfx_toolmenu_isShow = true;
        $("#xs_tjfx_leftMenu").panel('open');
        $("#xs_tjfx_leftMenuC").css({"display":"block"});
        $("#xs_tjfx_leftMenuC").menu();
    }
}

//加载县、乡、村features
XS.Main.Tjfx.loadZoneFeatuers = function(level, sql, succeedCallback, failCallback){
    var layerName = "";
    switch (level) {
        case XS.Main.ZoneLevel.city:
            if(XS.Main.Tjfx.type_featuersArr.county.length>0){
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
        switch (level) {
            case XS.Main.ZoneLevel.county:
                XS.Main.Tjfx.type_featuersArr.town = [];
                break;
            case XS.Main.ZoneLevel.town:
                XS.Main.Tjfx.type_featuersArr.village = [];
                break;
        }
        var i, feature, result = queryEventArgs.result;
        if (result && result.recordsets&&result.recordsets[0].features.length>0) {
            for (i = 0; i < result.recordsets[0].features.length; i++) {
                feature = result.recordsets[0].features[i];
                switch (level) {
                    case XS.Main.ZoneLevel.city:
                        XS.Main.Tjfx.type_featuersArr.county.push(feature);
                        break;
                    case XS.Main.ZoneLevel.county:
                        XS.Main.Tjfx.type_featuersArr.town.push(feature);
                        break;
                    case XS.Main.ZoneLevel.town:
                        XS.Main.Tjfx.type_featuersArr.village.push(feature);
                        break;
                }
            }
            succeedCallback();
        }else{
            succeedCallback();
        }
    }, function(e){
        failCallback(e);
    });
}

//清除 图层
XS.Main.Tjfx.removeLayer = function(){
        $("#xs_tjfx_toolmenuC").dialog('close');
    if(xs_labelLayer != null){
        xs_MapInstance.getMapObj().removeLayer(xs_labelLayer);
        xs_labelLayer = null;
    }
    if(xs_tjfx_themeLayer != null){
        xs_MapInstance.getMapObj().removeLayer(xs_tjfx_themeLayer);
        xs_tjfx_themeLayer = null;
    }
    if(xs_tjfx_graph_themeLayer != null){
        xs_MapInstance.getMapObj().removeLayer(xs_tjfx_graph_themeLayer);
        xs_tjfx_graph_themeLayer = null;
    }
}