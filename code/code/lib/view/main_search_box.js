/**
 * Created by GZXS on 2016/6/27.
 */
    XS.Searchbox = {};
var xs_searchbox_countyFields = [["CITY","所属市"],["C11","国土面积"],["POVERT","贫困发生率(%)"],["C2","镇(乡)数"],["C4","行政村数"],
    ["C4A","贫困村数"],["C6","总户数"],["C9","贫困户数"],["C7","总人口"],["C10","贫困人口"],["C1","贫困类型"]];
var xs_searchbox_townFields = [["ECOCROP","耕地面积(亩)"],["GROUPNUM","自然村"],["VILLNUM","行政村"],["TOTALHH","总户数"],
    ["INPOORHOUSE","贫困户"],["TOTALPOP","总人口"],["POORPOP","贫困人口"],["POVERTYRATE","贫困发生率(%)"]];
var xs_searchbox_villFields = [["TOWN","所属(乡)镇"],["POVERT","贫困发生率(%)"],["POORTYPE","贫困类型"],["B5","耕地面积(亩)"],
    ["B2","总户数"],["B2A","贫困户"],["B3","总人口"],["B3A","贫困人口"]];
var xs_searchbox_poorH = [["HHNAME","户主"],["PTYPE","农户属性"],["AGE","年龄"],["CARDID","身份证"],["POP","家庭人数"],
    ["PHONE","联系方式"],["A27","住房面积"],["A33","年收入"],["A28","危房"],["A36","各类补贴"],["ISARMYFAMILY","军烈属"],
    ["MAIN_REASON","致贫原因"],["COUNTY","大方县"],["TOWN","乡镇"],["VILL","村"],["VGROUP","组"]];
var xs_searchbox_replaceFields = [["PTYPE","poorType"],["ALTITUDE","Altitude"],["CARDID","CerNto"],["LATITUDE","Latitude"],["LONGITUDE",
    "Longitude"],["MEMO","Memo"],["HGID","hguid"],["PB_HHID","hid"],["HHNAME","name"],["POP","num"],["MAIN_REASON","reason"]];

var xs_search_cashData = [];
var xs_searchbox_action = "";
var xs_searchbox_type = "";
var xs_searchbox_content = "";
var xs_searchbox_isSearch = false;
var xs_searchbox_level = -1;
var xs_searchbox_resultBaseInfH = 0;

XS.Searchbox.init = function(){
    var xs_search_box = '<div id="xs_searchbox" class="easyui-panel">' +
        '<div id="xs_searchbox_C">' +
            XS.Searchbox.searchType() +
            '<input id="xs_searchbox_content" autocomplete="off" placeholder="&nbsp;行政区、贫困户查询" onkeydown1="XS.Searchbox.getConKey();">' +
            '<div id="xs_searchbox_clear" class="easyui-panel" onclick="XS.Searchbox.clearCon();">' +
                '<div id="xs_searchbox_loadingC">' +
                    '<i id="xs_searchbox_loading" class="fa <!--fa-circle-thin--> fa-spinner fa-pulse fa-3x fa-fw xs_loading">' +
                    '</i>' +
                '</div>' +
            '</div>' +
            '<button id="xs_searchbox_button" onclick="XS.Searchbox.searchbox();" title="搜索"></button>' +
        '</div>' +
        '<div id="xs_searchbox_resultC"></div>' +
    '</div>';
    $("#xs_searchbox_boxC").empty().append(xs_search_box);
    XS.Main.addDivHover2HiddenUTFGridTip("xs_searchbox");

    $('#xs_searchbox_button').tooltip({
        position: 'bottom'
    });
    $("#xs_searchbox_content").keyup(function(e){
        if(e.keyCode == 13){
            XS.Searchbox.searchbox();
        }else{
            XS.Searchbox.getConKey();
        }
    });
}
/**
 * 输入框是否为空监测
 */
XS.Searchbox.getConKey = function(){
    if(!XS.StrUtil.isEmpty($("#xs_searchbox_content").val())){
        if(xs_searchbox_isSearch && xs_searchbox_content != $("#xs_searchbox_content").val()){
            xs_searchbox_isSearch = false;
            $("#xs_searchbox_resultC").animate({height:0},{duration: 1000 ,complete:function(){
                $("#xs_searchbox_resultC").empty();
            }})
        }
        $("#xs_searchbox_clear").css({cursor:'pointer',background: 'url("../img/searchbox.png") no-repeat 0 -114px #fff'});
        $("#xs_searchbox_loadingC").css({display:"none"});
        $('#xs_searchbox_clear').tooltip({
            position: 'bottom',
            content:'清除'
        });
    }else{
        xs_searchbox_isSearch = false;
        $("#xs_searchbox_loadingC").css({display:"none"});
        $("#xs_searchbox_clear").tooltip("destroy").css({cursor:'default',background:'#fff'});
        $("#xs_searchbox_resultC").animate({height:0},{duration: 1000 ,complete:function(){
            $("#xs_searchbox_resultC").empty();
        }})
    }
};
/**
 * 清除输入框的内容和搜索结果
 */
XS.Searchbox.clearCon = function(){
    $("#xs_searchbox_content").focus();
    xs_searchbox_isSearch = false;
    $("#xs_searchbox_content").val("");
    $("#xs_searchbox_clear").tooltip("destroy").css({cursor:'default',background:'#fff'});
    $("#xs_searchbox_resultC").animate({height:0},{duration: 1000 ,complete:function(){
        $("#xs_searchbox_resultC").empty();
    }})
}
/**
 * 搜索按钮点击函数
 */
XS.Searchbox.searchbox = function(){
    XS.Main.Poor.clearRelocationLayer();
    XS.Main.clearMap();
    $("#xs_xs_searchbox_content").select();
    xs_searchbox_type = $("#xs_searchbox_type").val();
    xs_searchbox_content = $("#xs_searchbox_content").val();
    $("#xs_searchbox_clear").tooltip("destroy").css({cursor:'default',background:'#fff'});
    $("#xs_searchbox_loadingC").css({display:"block"});
    var data = {};
    switch (xs_searchbox_type){
        case '区县':
        {
            xs_searchbox_level = XS.Main.ZoneLevel.county;
            xs_searchbox_action = "QueryTempCountyBaseInfoByCname";
            data = {Cname:xs_searchbox_content,regionid:xs_user_regionId};
            break;
        }
        case '乡镇':
        {
            xs_searchbox_level = XS.Main.ZoneLevel.town;
            xs_searchbox_action = "QueryTempTownInfoByTname";
            data = {tname:xs_searchbox_content,regionid:xs_user_regionId};
            break;
        }
        case '行政村':
        {
            xs_searchbox_level = XS.Main.ZoneLevel.village;
            xs_searchbox_action = "QueryTempVillInfoByvName";
            data = {vname:xs_searchbox_content};
            break;
        }
        case '姓名':
        case '身份证号':
        case '电话':
        {
            xs_searchbox_action = "QueryHouseByValueAndType";
            data = {type:xs_searchbox_type,value:xs_searchbox_content,pageNum:1,pageSize:10,regionid:xs_user_regionId};
            break;
        }
    }
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, xs_searchbox_action, data,function(json){
        //$("#xs_searchbox_loadingC").css({display:"none"});
        if(json && json.length>0){
            $("#xs_searchbox_content").select();
            xs_search_cashData = json;
            xs_searchbox_isSearch = true;
            $("#xs_searchbox_resultC").empty().append('<div id="xs_searchbox_resultBaseInf"></div>');
            xs_searchbox_resultBaseInfH = 15;
            switch (xs_searchbox_type){
                case '区县':
                {
                    XS.Searchbox.regionBaseInfo(0,json,"CTID","COUNTY",xs_searchbox_countyFields);
                    break;
                }
                case '乡镇':
                {
                    XS.Searchbox.regionBaseInfo(0,json,"TID","REGISTOR",xs_searchbox_townFields);
                    break;
                }
                case '行政村':
                {
                    XS.Searchbox.regionBaseInfo(0,json,"VID","VILL",xs_searchbox_villFields);
                    break;
                }
                case '姓名':
                case '身份证号':
                case '电话':
                {
                    XS.Searchbox.regionBaseInfo(0,json,"","",xs_searchbox_poorH);
                    //$("#xs_searchbox_resultC").append('<div id="xs_searchbox_pager" style="width: 100%;height: 40px"></div>');

                    var totalPageNum = json[0].TotolSum;
                    $("#xs_searchbox_pager").pagination({
                        total:totalPageNum,
                        displayMsg:"共" + totalPageNum + "记录",
                        showRefresh:false,
                        pageSize:10,
                        showPageList: false,
                        onSelectPage:function (pageNumber, pageSize) {

                            $("#xs_searchbox_clear").tooltip("destroy").css({cursor:'default',background:'#fff'});
                            $("#xs_searchbox_loadingC").css({display:"block"});
                            var data = {type:xs_searchbox_type,value:xs_searchbox_content,pageNum:pageNumber,pageSize:pageSize,regionid:xs_user_regionId};
                            //http://61.159.185.196:7060/Service2.svc/QueryHousePeoByHidOfPage?pbno=52242810102&pageNo=1
                            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHouseByValueAndType", data, function(nexJson){
                                $("#xs_searchbox_loadingC").css({display:"none"});
                                if(nexJson && nexJson.length>0){
                                    $("#xs_searchbox_resultBaseInf").empty();
                                    $("#xs_searchbox_content").select();
                                    $("#xs_searchbox_clear").css({cursor:'pointer',background: 'url("../img/searchbox.png") no-repeat -5px -38px #fff'});
                                    $('#xs_searchbox_clear').tooltip({
                                        position: 'bottom',
                                        content:'清除'
                                    });
                                    xs_search_cashData = nexJson;
                                    XS.Searchbox.regionBaseInfo(0,nexJson,"","",xs_searchbox_poorH);
                                    $("#xs_searchbox_pager").pagination('refresh', {
                                        total:totalPageNum,
                                        displayMsg:"共" + totalPageNum + "记录",
                                        showRefresh:false,
                                        pageSize:pageSize,
                                        showPageList: false,
                                        pageNumber:pageNumber
                                    });
                                }else{
                                    $("#xs_searchbox_resultC").animate({height:0},{duration: 1000,complete:function(){
                                        $("#xs_searchbox_resultC").empty();
                                    }});
                                    XS.Searchbox.getConKey();
                                    XS.CommonUtil.showMsgDialog("","未找到相关数据");
                                }
                            },function(){
                                $("#xs_searchbox_resultC").animate({height:0},{duration: 1000,complete:function(){
                                    $("#xs_searchbox_resultC").empty();
                                }});
                                $("#xs_searchbox_loadingC").css({display:"none"});
                                XS.Searchbox.getConKey();
                                XS.CommonUtil.showMsgDialog("","请求失败");
                            });
                        }
                    });
                    break;
                }
            }
        }else{
            $("#xs_searchbox_loadingC").css({display:"none"});
            $("#xs_searchbox_resultC").animate({height:0},{duration: 1000 ,complete:function(){
                $("#xs_searchbox_resultC").empty();
            }});
            XS.Searchbox.getConKey();
            XS.CommonUtil.showMsgDialog("","未找到相关数据");
        }
    },function(){
            $("#xs_searchbox_resultC").animate({height:0},{duration: 1000,complete:function(){
                $("#xs_searchbox_resultC").empty();
            }});
            $("#xs_searchbox_loadingC").css({display:"none"});
            XS.Searchbox.getConKey();
            XS.CommonUtil.showMsgDialog("","请求失败");
    });
}
/**
 * 搜索结果的基本信息
 * @param json
 * @param regionId
 * @param regionName
 * @param fields
 */
XS.Searchbox.regionBaseInfo = function(i,json,regionId,regionName,fields){
    //$("#xs_searchbox_resultC").animate({height:350},{duration: 1000 });
    var baseInfData = [];
    var regionIdV = 0;
    var regionNameV = "";
    for(var j in fields){
        if(fields[j][0] == "POVERT"){
            if(xs_searchbox_type == "区县"){
                baseInfData.push({name:fields[j][1],value:(json[i].C7/json[i].C10) || (json[i].C7/json[i].C10) == 0 ? (json[i].C7/json[i].C10).toFixed(2) : ""});
            }else{
                baseInfData.push({name:fields[j][1],value:(json[i].B3/json[i].B3A) || (json[i].B3/json[i].B3A) == 0 ? (json[i].B3/json[i].B3A).toFixed(2) : ""});
            }
        }else{
            if(XS.StrUtil.isEmpty(regionId) && XS.StrUtil.isEmpty(regionName) && j>11){
                regionNameV = "贫困户";
                var address = "";
                for(var k=12;k<fields.length;k++){
                    address += json[i][fields[k][0]];
                }
                baseInfData.push({name:"家庭地址",value:!address ? "" : address});
                break;
            }else{
                if(fields[j][0] == "AGE"){
                    var poorHBirthYear = json[i].CARDID.slice(6,10);
                    var currentYear = new Date().getFullYear();
                    baseInfData.push({name:fields[j][1],value:(currentYear-poorHBirthYear) || currentYear == poorHBirthYear? (currentYear-poorHBirthYear) : ""});
                }else{
                    baseInfData.push({name:fields[j][1],value:json[i][fields[j][0]] || json[i][fields[j][0]] == 0 ? json[i][fields[j][0]] : ""});
                }
            }
        }
    }
    var xs_searchbox_baseInf = '';
    if(!XS.StrUtil.isEmpty(regionId) && !XS.StrUtil.isEmpty(regionName)){
        regionIdV = json[i][regionId];
        regionNameV = json[i][regionName];
        xs_searchbox_baseInf += '<div class="xs_searchbox_baseInfPanelC">';
    }else{
        regionIdV = i;
        for(var j in xs_searchbox_replaceFields){
            xs_search_cashData[i][xs_searchbox_replaceFields[j][1]] = xs_search_cashData[i][xs_searchbox_replaceFields[j][0]];
        }
        xs_searchbox_baseInf += '<div class="xs_searchbox_baseInfPanelC" regionId="' + i + '">';
    }
    xs_searchbox_baseInf += '<div class="xs_searchbox_baseInfPanel">' +
                '<div style="width: 100%;height: 30px;line-height: 30px;background: #02BBEE;">'+
                    '<span style="margin-left: 5px;">' + regionNameV  + '基本信息</span>';
                    if(XS.StrUtil.isEmpty(regionId) && XS.StrUtil.isEmpty(regionName)){
                        xs_searchbox_baseInf += '<a class="xs_searchbox_positionBtn" href="javascript:void(0);"  style="height:30px;position: absolute;right:0px;" regionId="' +
                            json[i].VID + '" regionName="' + regionNameV + '" poorHIndex="' + regionIdV + '">定位</a>';
                    }else{
                        xs_searchbox_baseInf += '<a class="xs_searchbox_positionBtn" href="javascript:void(0);"  style="height:30px;position: absolute;right:0px;" regionId="' +
                            regionIdV + '" regionName="' + regionNameV + '">定位</a>';
                    }

    xs_searchbox_baseInf += '</div>' + '<div style="width: 92%;position: relative;top1: 2px;left: 4%;>';
    var mergerIndex = -1;
    switch (xs_searchbox_type){
        case "区县":
        {
            xs_searchbox_baseInf += XS.Searchbox.createTable(baseInfData,2,30,[[10,2]],"","color:#00bbee",["xs_searchbox_tool"]);
            break;
        }
        case "乡镇":
        {
            xs_searchbox_baseInf += XS.Searchbox.createTable(baseInfData,2,30,[],"","color:#00bbee",["xs_searchbox_tool"]);
            break;
        }
        case "行政村":
        {
            xs_searchbox_baseInf += XS.Searchbox.createTable(baseInfData,2,30,[],"","color:#00bbee",["xs_searchbox_tool"]);
            break;
        }
        default :{
            xs_searchbox_baseInf += XS.Searchbox.createTable(baseInfData,2,30,[[12,2]],"","color:#00bbee",["xs_searchbox_tool"]);
            //xs_searchbox_baseInf += XS.Main.Poor.createTable(baseInfData, 2, 30,"","color:#00bbee");
        }
    }
    xs_searchbox_baseInf += '</div></div></div>';
    $("#xs_searchbox_resultBaseInf").append(xs_searchbox_baseInf);
    $('.xs_searchbox_positionBtn').linkbutton({iconCls:'icon-main_position',plain:true});
    xs_searchbox_resultBaseInfH += $(".xs_searchbox_baseInfPanel").outerHeight() + 15;
    XS.Searchbox.tool(i,json,regionIdV,regionNameV,regionId,regionName,fields);
}
/**
 * 搜索类型select
 * @returns {string}
 */
XS.Searchbox.searchType = function(){
    var xs_searchbox_option = '<select id="xs_searchbox_type">';
    switch (xs_user_regionLevel){
        case XS.Main.ZoneLevel.city:
        {
            xs_searchbox_option += '<option value="区县">区县</option>' +
            '<option value="乡镇">乡镇</option>' +
            '<option value="行政村">行政村</option>';
            break;
        }
        case XS.Main.ZoneLevel.county:
        {
            xs_searchbox_option += '<option value="乡镇">乡镇</option>' +
                '<option value="行政村">行政村</option>';
            break;
        }
        case XS.Main.ZoneLevel.town:
        {
            xs_searchbox_option += '<option value="行政村">行政村</option>';
            break;
        }
    }
    xs_searchbox_option += '<option value="姓名">姓名</option>' +
        '<option value="身份证号">身份证</option>' +
        '<option value="电话">电话</option>' +
        '</select>';
    return xs_searchbox_option;
}
/**
 * 搜索结果选项点击
 */
XS.Searchbox.baseInfoClick = function(level,regionId,regionName,poorHIndex){
    xs_poorLabelLayer.removeAllFeatures();
    xs_markerLayer.clearMarkers();
    xs_markerLayer.setVisibility(false);
    XS.Main.Poor.clearRelocationLayer();
    $("#xs_tjfx_range_Legend").remove();

    if(regionName == '贫困户' && xs_pkdc_cacheDataArr[poorHIndex].LONGITUDE && xs_pkdc_cacheDataArr[poorHIndex].LATITUDE){
        XS.Main.Poor.showPoor(xs_pkdc_cacheDataArr[poorHIndex].hid,null);
        return;
    }else if(regionName == '贫困户详情' && xs_pkdc_cacheDataArr[poorHIndex].LONGITUDE && xs_pkdc_cacheDataArr[poorHIndex].LATITUDE){
        XS.Main.Poor.showPoorDetailInfo(xs_pkdc_cacheDataArr[poorHIndex]);
        return;
    }
    xs_isClickMapFinish = false;
    var layerName = "";
    var sql = "";
    var regionIdStr = ""
    switch (level){
        case XS.Main.ZoneLevel.county:
        {
            sql = "SMID>0";
            layerName = "County_Code";
            regionIdStr = "AdminCode";
            break;
        }
        case XS.Main.ZoneLevel.town:
        {
            sql = "县级代码="+regionId.slice(0,6);
            layerName = "Twon_Code";
            regionIdStr = "乡镇代码";
            break;
        }
        case XS.Main.ZoneLevel.village:
        case XS.Main.ZoneLevel.poor:
        {
            sql = "Town_id="+regionId.toString().slice(0,9);
            layerName = "Village_Code";
            regionIdStr = "OldID";
            break;
        }
    }
    console.log(regionId + "||");
    XS.CommonUtil.showLoader();
    XS.MapQueryUtil.queryBySql(XS.Constants.dataSourceName, layerName, sql, xs_MapInstance.bLayerUrl,function(queryEventArgs)
    {
        XS.CommonUtil.hideLoader();
        var i, feature,features, result = queryEventArgs.result;
        if (result && result.recordsets && result.recordsets[0].features.length>0)
        {
            features = result.recordsets[0].features;
            for (i = 0; i < features.length; i++)
            {
                var data = features[i].data;
                console.log(data[regionIdStr]);
                if(data[regionIdStr] == regionId){
                    feature = result.recordsets[0].features[i];
                    break;
                }
            }
            if(!feature){
                xs_isClickMapFinish = true;
                XS.CommonUtil.showMsgDialog("","未找到相关数据！");
                return;
            }
            if(regionName == '贫困户'){
                xs_isClickMapFinish = true;
                var centerPointer = feature.geometry.getBounds().getCenterLonLat();
                XS.Main.Poor.showPoor(xs_pkdc_cacheDataArr[poorHIndex].hid,centerPointer);
                return;
             }else if(regionName == '贫困户详情'){
                xs_isClickMapFinish = true;
                var centerPointer = feature.geometry.getBounds().getCenterLonLat();
                xs_pkdc_cacheDataArr[poorHIndex].LONGITUDE = centerPointer.lon;
                xs_pkdc_cacheDataArr[poorHIndex].LATITUDE = centerPointer.lat;
                XS.Main.Poor.showPoorDetailInfo(xs_pkdc_cacheDataArr[poorHIndex]);
                return;
            }
            //xs_MapInstance.getMapObj().zoomToExtent(feature.geometry.getBounds(),false);
            xs_currentZoneFuture = feature;
            feature.style = xs_stateZoneStyle;
            xs_zone_vectorLayer.removeAllFeatures();
            xs_zone_vectorLayer.addFeatures(feature);
            xs_currentZoneName = regionName;
            xs_clickMapFutureId  = regionId;
            xs_currentZoneCode =  regionId;
            xs_pkdc_isFirstShowInfoWin = true;
            switch (level){
                case XS.Main.ZoneLevel.county:
                    xs_superZoneCode = Math.floor(regionId/100);
                    xs_currentZoneLevel = XS.Main.ZoneLevel.county;
                    xs_MapInstance.getMapObj().setCenter(feature.geometry.getBounds().getCenterLonLat(), 3);
                    xs_isClickMapFinish = true;
                    break;
                case XS.Main.ZoneLevel.town:
                    xs_superZoneCode = Math.floor(regionId/1000);
                    xs_currentZoneLevel = XS.Main.ZoneLevel.town;
                    xs_isClickMapFinish = true;
                    xs_MapInstance.getMapObj().setCenter(feature.geometry.getBounds().getCenterLonLat(), 6);
                    XS.Main.readyAddRegionMarkersData([feature],xs_currentZoneLevel-1,xs_superZoneCode);
                    //XS.Main.addTownVillPlevelMarker2Layer(xs_currentZoneLevel-1, xs_superZoneCode,regionId);
                    break;
                case XS.Main.ZoneLevel.village:
                    xs_superZoneCode = regionId.slice(0,9);
                    xs_currentZoneLevel = XS.Main.ZoneLevel.village;
                    xs_isClickMapFinish = true;
                    xs_MapInstance.getMapObj().setCenter(feature.geometry.getBounds().getCenterLonLat(), 9);
                    XS.Main.readyAddRegionMarkersData([feature],xs_currentZoneLevel-1,xs_superZoneCode);
                    //XS.Main.addTownVillPlevelMarker2Layer(xs_currentZoneLevel-1, xs_superZoneCode,regionId);
                    break;
            }
        }else{
            xs_isClickMapFinish = true;
            XS.CommonUtil.hideLoader();
            XS.CommonUtil.showMsgDialog("","加载数据失败！");
            //XS.Login.logout();
        }
    }, function(e){
        xs_isClickMapFinish = true;
        XS.CommonUtil.hideLoader();
        XS.CommonUtil.showMsgDialog("","加载数据失败！");
        //XS.Login.logout();
    });
}
/**
 * 创建table
 * @param objArr
 * @param colls 列数
 * @param rowH 行高
 * @param mergeColls 元素为需要合并的列对应objArr中的下标和合并的列数组成的二维数组
 * @param nameCollStyle objArr中的name颜色
 * @param valueCollStyle objArr中的value颜色
 * @param addRowIdArr 需要在table结尾加是行ID名数组
 * @returns {string}
 */
XS.Searchbox.createTable = function (objArr,colls, rowH,mergeColls,nameCollStyle,valueCollStyle,addRowIdArr) {
    var content =
        '<div class="datagrid-wrap panel-body panel-body-noheader" style="width: 100%; height: auto; margin-top: 5px;">'+
        '<div class="datagrid-body">'+
        '<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0" width="100%">'+
        '<tbody>';
    var rowNum = 0;
    var preRowNum = -1;
    var alreadyColls = 0;
    for(var i=0;i<objArr.length;i++){
        if(alreadyColls==colls){
            alreadyColls = 0;
            rowNum++;
            content += '</tr>';
        }
        var rcls = rowNum%2 == 0?"datagrid-row":"datagrid-row datagrid-row-alt";
        if(rowNum - preRowNum == 1){
            content += '<tr  style="height: '+rowH+'px;" class="'+rcls+'">';
        }
        preRowNum = rowNum;
        var isColspan = false;
        for(var j in mergeColls){
            if(mergeColls[j][0] == i && alreadyColls+mergeColls[j][1]<=colls && mergeColls[j][1]>1){
                isColspan = true;
                alreadyColls += mergeColls[j][1];
                content += '<td  colspan="'+ mergeColls[j][1] +'"><div class="datagrid-cell" style="'+nameCollStyle+'">'+objArr[i].name+'</div></td>';
                content += '<td colspan= "'+ mergeColls[j][1] +'"><div  class="datagrid-cell" style="'+valueCollStyle+'">'+objArr[i].value+'</div></td>';
                break;
            }
        }
        if(isColspan)continue;
            content += '<td><div class="datagrid-cell" style="'+nameCollStyle+'">'+objArr[i].name+'</div></td>';
            content += '<td><div  class="datagrid-cell" style="'+valueCollStyle+'">'+objArr[i].value+'</div></td>';
            alreadyColls++;
        if(i==objArr.length-1){
            content += '</tr>';
        }
    }
    for(var i in addRowIdArr){
        rowNum++;
        var rcls = rowNum%2==0?"datagrid-row":"datagrid-row datagrid-row-alt";
        content += '<tr class="'+ addRowIdArr[i] +'" style="height: '+rowH+'px;" class="'+rcls+'"></tr>';
    }
    content +=
        '</tbody>'+
        '</table>'+
        '</div>'+
        '</div>';
    return content;
}
/**
 * 点击区域选择框动态请求下级数据
 * @param obj
 * @param regionIdV
 * @param regionNameV
 */
XS.Searchbox.requestSelect = function(obj,regionIdV,regionNameV){
    var requestSelect = '<option value="-1">--请选择--</option>';
    var action = "";
    var nextField = [];
    switch (xs_searchbox_type){
        case "区县":
        {
            action = "QueryTownsBaseInfoByareaId";
            nextField = ["TOWB_ID","TOWB_NAME"];
        }
        case "乡镇":
        {
            if(!action){
                action = "QueryVillBaseByareaId";
                nextField = ["VBI__ID","VBI_NAME"];
            }
            var dataN = {pbno: regionIdV};
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, dataN, function(json){
                if(json && json.length>0){
                    obj.empty();
                    for(var i in json){//"522426108010"52242610804
                        requestSelect += '<option value="'+ json[i][nextField[0]] +'">' + json[i][nextField[1]] + '</option>';
                    }
                    obj.append(requestSelect);
                    obj.attr({isClick:true});
                }
            });
            break;
        }
    }
}
/**
 * 向搜索结果的信息表中添加所需按钮或下拉框
 * @param i
 * @param json
 * @param regionIdV
 * @param regionNameV
 * @param regionId
 * @param regionName
 * @param fields
 */
XS.Searchbox.tool = function(i,json,regionIdV,regionNameV,regionId,regionName,fields){
    var xs_searchbox_tool = "";
    var nextRegion = "";
    var selectOptNum = 0;
    switch (xs_searchbox_type){
        case "区县":
        {
            nextRegion = "乡镇";
            selectOptNum = json[i].C2;
        }
        case "乡镇":
            {
                if(!nextRegion){
                    nextRegion = "行政村";
                    selectOptNum = json[i].VILLNUM;
                }
                xs_searchbox_tool += '<td colspan="4" align1="center" style="vert-align: middle;">' +
                    '<button class="xs_searchbox_detail" style="cursor: pointer;position:relative;left:20px;" regionId="'+regionIdV+'" regionName="'+ regionNameV+'">详情</button>'+
                    '<span class="datagrid-cell" style="display1: inline-block;position:relative;left:80px;">'+nextRegion+'</span>' +
                    '<select class="xs_searchbox_nextSeleect" style="display: inline-block;position:relative;left:80px;" regionId="'+regionIdV+'" regionName="'+ regionNameV+'">'+
                    '<option value=-1>--请选择--</option>';
                    for(var j=0;j<selectOptNum-1;j++){
                    xs_searchbox_tool += '<option value=-1></option>';
                    }
                xs_searchbox_tool += '</select></td>';
                $(".xs_searchbox_tool:last").append(xs_searchbox_tool);
                break;
            }
        case "行政村":
            {
                xs_searchbox_tool += '<td colspan="4" align="center" style="border-right: 0;">' +
                    '<button class="xs_searchbox_detail" style="cursor: pointer;" regionId="'+regionIdV+'" regionName="'+ regionNameV+'">详情</button>' +
                    '</td>';
                $(".xs_searchbox_tool:last").append(xs_searchbox_tool);
                break;
            }
        default :
            {
                xs_searchbox_tool += '<td colspan="4" align="center" style="border-right: 0;">' +
                        '<button class="xs_searchbox_detail" style="cursor: pointer;" poorHIndex="'+regionIdV+'">详情</button>' +
                    '</td>';
                $(".xs_searchbox_tool:last").append(xs_searchbox_tool);
                break;
            }
    }
    if(i<json.length-1){
        XS.Searchbox.regionBaseInfo(i+1,json,regionId,regionName,fields);
    }else{
        XS.Searchbox.BaseInfPanel(i,json,regionId,regionName);
    }
}
/**
 * 给搜索结果的信息表添加样式及各种事件
 * @param regionId
 * @param regionName
 * @constructor
 */
XS.Searchbox.BaseInfPanel = function(i,json,regionId,regionName){
    if(i==json.length-1){
        if($(".xs_searchbox_baseInfPanelC").length == 0){
            $("#xs_searchbox_resultC").animate({height:0},{duration: 1000 ,complete:function(){
                $("#xs_searchbox_resultC").empty();
            }});
            XS.Searchbox.getConKey();
            XS.CommonUtil.showMsgDialog("","未找到相关数据");
            return;
        }
        $("#xs_searchbox_loadingC").css({display:"none"});
        $("#xs_searchbox_clear").css({cursor:'pointer',background: 'url("../img/searchbox.png") no-repeat -5px -38px #fff'});
        $('#xs_searchbox_clear').tooltip({
            position: 'bottom',
            content:'清除'
        });
    }
    if(XS.StrUtil.isEmpty(regionId) && XS.StrUtil.isEmpty(regionName) && $("#xs_searchbox_pager").length == 0){
        $("#xs_searchbox_resultC").append('<div id="xs_searchbox_pager"></div>');
    }
    $("#xs_searchbox_resultBaseInf").css({display:'block'})
    if(xs_searchbox_resultBaseInfH < 320 ){
        $("#xs_searchbox_resultBaseInf").height(xs_searchbox_resultBaseInfH);
        $("#xs_searchbox_resultC").animate({height:xs_searchbox_resultBaseInfH + 30},{duration: 1000 });
    }else{
        $("#xs_searchbox_resultBaseInf,#xs_searchbox_resultC").css({display:'block'});
        $("#xs_searchbox_resultBaseInf").height(320);
        $("#xs_searchbox_resultC").animate({height:350},{duration: 1000 });
    }
    $(".xs_searchbox_positionBtn").click(function(){
        var regionIdValue = $(this).attr("regionId");
        var regionNameValue = $(this).attr("regionName");
        var level = -1;
        var poorHIndex = -1;
        switch (xs_searchbox_type){
            case '区县':
            {
                level = XS.Main.ZoneLevel.county;
                break;
            }
            case '乡镇':
            {
                level = XS.Main.ZoneLevel.town;
                break;
            }
            case '行政村':
            {
                level = XS.Main.ZoneLevel.village;
                break;
            }
            default :{
                xs_pkdc_cacheDataArr = xs_search_cashData;
                poorHIndex = $(this).attr("poorHIndex");
                level = XS.Main.ZoneLevel.poor;
            }
        }
        XS.Searchbox.baseInfoClick(level,regionIdValue,regionNameValue,poorHIndex);
    });
    if($(".xs_searchbox_positionBtn").length == 1){
        $(".xs_searchbox_positionBtn").click();
    }
    $(".xs_searchbox_detail").click(function(){
        switch (xs_searchbox_type){
            case "区县":
            case "乡镇":
            case "行政村":
            {
                var detailRegionId = $(this).attr("regionId");
                var detailRegionName = $(this).attr("regionName");
                XS.Main.Pkjc.clickDetail(xs_searchbox_level,detailRegionName,detailRegionId,false);
                break;
            }
            default :
            {
                xs_pkdc_cacheDataArr = xs_search_cashData;
                var poorHIndex = $(this).attr("poorHIndex");
                XS.Searchbox.baseInfoClick(4,xs_pkdc_cacheDataArr[poorHIndex].VID,"贫困户详情",poorHIndex);
                break;
            }
        }
    });
    $(".xs_searchbox_nextSeleect").click(function(){
        var nextRegionId = $(this).attr("regionId");
        var nextRegionName = $(this).attr("regionName");
        var isClick = $(this).attr("isClick");
        if(!isClick){
            XS.Searchbox.requestSelect($(this),nextRegionId,nextRegionName);
        }
    });
    $(".xs_searchbox_nextSeleect").change(function(){
        var regionIdV = $(this).val();
        if(regionIdV == -1)return;
        var regionNameV = $(this).html();
        var level = -1;
        switch (regionIdV.length){
            case 9:
            {
                level = XS.Main.ZoneLevel.town;
                break;
            }
            case 11:
            {
                level = XS.Main.ZoneLevel.village;
                break;
            }
        }
        XS.Searchbox.baseInfoClick(level,regionIdV,regionNameV);
    });
    $(".xs_searchbox_nextSeleect").click(function(){

    });
}