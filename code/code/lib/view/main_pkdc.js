/**
 * Created by GZXS on 2016/6/27.
 */
XS.Main.Pkjc={};

$(function(){
});
//贫困洞察仪表盘Option
XS.Main.Pkjc.gaugeOption = {
    tooltip: {
        formatter: function(param){
            //"{a} <br/>&nbsp;&nbsp;{c}%"
            //seriesIndex
            XS.LogUtil.log(param.seriesIndex+"");
            switch (param.seriesIndex){
                case 0:
                    return param.name + "<br/>&nbsp;&nbsp;" + param.value +"%";
                case 1:
                    return param.name + "<br/>&nbsp;&nbsp;" + XS.CommonUtil.formatNumber(param.value*xs_pkdc_PopRate,0).split('.')[0] +""; //贫困人口
                case 2:
                    return param.name + "<br/>&nbsp;&nbsp;" + XS.CommonUtil.formatNumber(param.value*xs_pkdc_HuRate,0).split('.')[0] +"";
            }
            return "";
        }
    },
    title:{
        textStyle: {
            color: '#ff0000'
        }
    },
    grid:{
        left:0,
        right:0,
        top:0,
        bottom:0
    },
    toolbox: {
        show : false
    },
    series: [
        {
            name: '贫困发生率',
            type: 'gauge',
            z: 3,
            min: 0,
            max: 100,
            splitNumber: 5,
            detail: {
                show: true,
                offsetCenter: [0, '40%'],
                textStyle: {
                    fontSize: 22,
                    color:"#00bbee"
                }
            },
            radius: '50%',
            axisLine: {
                lineStyle: {
                    width: 10
                }
            },
            axisTick: {
                length: 15,
                lineStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto'
                }
            },
            title: {
                show: false,
                top:'bottom',
                textStyle: {
                    color: '#ff0000',
                    fontSize: 8
                }
            },
            data: [{value: 25, name: '贫困发生率'}]
        },
        {
            name: '贫困人口',
            type: 'gauge',
            center: ['20%', '50%'],
            radius: '35%',
            min: 0,
            max: 10,
            splitNumber: 10,
            detail: {
                show: false,
                offsetCenter: [0, '60%'],
                textStyle: {
                    fontSize: 15
                }
            },
            axisLine: {
                lineStyle: {
                    width: 8
                }
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                width: 5
            },
            title: {
                show: false,
                top:'bottom',
                textStyle: {
                    color: '#ccc',
                    fontSize: 8
                }
            },
            data: [{value: 0, name: '贫困人口'}]
        },
        {
            name: '贫困户',
            type: 'gauge',
            center: ['80%', '50%'],
            radius: '35%',
            min: 0,
            max: 10,
            splitNumber: 10,
            detail: {
                show: false,
                offsetCenter: [0, '60%'],
                textStyle: {
                    fontSize: 12
                }
            },
            axisLine: {
                lineStyle: {
                    width: 8
                }
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                width: 5
            },
            title: {
                show: false,
                top:'bottom',
                textStyle: {
                    color: '#ccc',
                    fontSize: 8
                }
            },
            data: [{value: 0, name: '贫困户'}]
        }
    ]
};

//贫困户及贫困人口显示的option
XS.Main.Pkjc.barOption = {
    title: {
    },
    tooltip: {
        show: false,
        showContent: true
    },
    legend: {
        data:['贫困户','贫困人口']

    },
    xAxis: {
        position: 'top',
        splitLine: {
            lineStyle: {
                type: 'dotted'
            }
        }
    },
    yAxis: {
        inverse: true,
        splitLine: {
            lineStyle: {
                type: 'dotted'
            }
        }
    },
    grid: {
        left: 80,
        top: 60,
        bottom: 0,
        right: 30
    },
    series: [{
        name: '贫困户',
        type: 'bar',
        barGap: 0,
        data: []
    },
        {
            name: '贫困人口',
            type: 'bar',
            barGap: 0,
            data: []
        }]
};

//贫困发生率显示的option
XS.Main.Pkjc.pieOption = {
    legend: {
        show: true,
        data: ['贫困','非贫困'],
        /*orient:'vertical',*/
        bottom: 15,
        right:10
    },
    tooltip: {
        show: false,
        trigger: 'item',
        showContent: true,
        formatter: '{c}'
    },
    series : [
        {
            name: '贫困情况',
            type: 'pie',
            radius: '50%',
            animationDuration1: 1,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: "{d}%"
                }
            },
            data:[{
                name: '贫困',
                itemStyle: {
                    normal: {
                        color: "#FF0000"
                    }
                }
            },
            {
                name: '非贫困',
                itemStyle: {
                    normal: {
                        color: "#00bbee"
                    }
                }
            }]
        }
    ]
};
var xs_pkdc_countyNames = {522426:"纳雍县",522401:"七星关区",522423:"黔西县",522425:"织金县",522490:"金海湖区",
    522491:"百里杜鹃",522427:"威宁县",522424:"金沙县",522428:"赫章县",522422:"大方县"};

var xs_pkdc_GaugeChart = null; //仪表盘
var xs_pkdc_PieChart = null; //右 pieChart
var xs_pkdc_BarChartDataIndex = -1; //左 barChart 被点击时的Index
var xs_pkdc_isGaugeClose = true; //记录仪表盘是否关闭

//barOption的yAxis类目
var xs_pkdc_categoryData = [];
//barOption的data
var xs_pkdc_barChartData = {poorHSeries:[],poorPSeries:[]};
var xs_pkdc_poorOccurRate = [];

var xs_pkdc_PopRate = 0; //贫困人口比例1-10
var xs_pkdc_HuRate = 0; //贫困户比例

var xs_pkdc_preName = "";//保存上一级的区域名称
var xs_pkdc_currentName = xs_userZoneName;//保存下一级的区域名称
//点击左工具栏--贫困洞察事件处理
XS.Main.Pkjc.pkdc = function(){
    if(!xs_isClickMapFinish){
        XS.CommonUtil.showMsgDialog("","数据加载未完成，请耐心等待");
        return;
    }
    XS.Main.hiddenLayers();
    XS.Main.closeDialogs("xs_main_detail");

    xs_pkdc_zoneLevel = -1;
    XS.Main.Poor.clearRelocationLayer();
    XS.Main.clearMap(); //清理地图
    $("#xs_main_detail").dialog("destroy");

    /*if(xs_currentZoneFuture==null){
        xs_MapInstance.getMapObj().setCenter(xs_MapInstance.getMapCenterPoint(), 0);
    }*/

    xs_pkdc_preName = xs_userZoneName;
    xs_pkdc_currentName = xs_userZoneName;
    if($("#xs_utfGridC").length>0) $("#xs_utfGridC").css("display","none");
    //XS.LogUtil.log(params);
    //显示下一级贫困信息窗口
    if(!xs_currentZoneFuture)
    {
        switch (xs_user_regionLevel){
            case XS.Main.ZoneLevel.city:
                xs_currentZoneLevel = XS.Main.ZoneLevel.city;
                xs_currentZoneName = "毕节市";
                break;
            case XS.Main.ZoneLevel.county:
                xs_currentZoneLevel = XS.Main.ZoneLevel.county;
                xs_clickMapFutureId = xs_user_regionId;
                break;
            case XS.Main.ZoneLevel.town:
                xs_currentZoneLevel = XS.Main.ZoneLevel.town;
                xs_clickMapFutureId = xs_user_regionId;
                break;
            case XS.Main.ZoneLevel.village:
                xs_currentZoneLevel = XS.Main.ZoneLevel.village;
                xs_clickMapFutureId = xs_user_regionId;
                break;
        }
    }
    if(xs_currentZoneLevel==XS.Main.ZoneLevel.city){
        XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.city, -1, xs_cityID);
    }else if(xs_currentZoneLevel==XS.Main.ZoneLevel.county){
        if(xs_currentZoneLevel != xs_user_regionLevel){
            xs_pkdc_currentName = xs_pkdc_countyNames[xs_clickMapFutureId];
        }
        XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.county, xs_cityID, xs_clickMapFutureId);
    }else if(xs_currentZoneLevel==XS.Main.ZoneLevel.town){
        if(xs_currentZoneFuture){
            if(xs_currentZoneLevel != xs_user_regionLevel){
                xs_pkdc_preName = xs_pkdc_countyNames[Math.floor(xs_clickMapFutureId/1000)];
                xs_pkdc_currentName = xs_currentZoneFuture.data.乡镇名称;
            }
            XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.town, xs_currentZoneFuture.data.县级代码, xs_clickMapFutureId);
        }else{
            XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.town, -1, xs_clickMapFutureId);
        }
    }else if(xs_currentZoneLevel==XS.Main.ZoneLevel.village){
        if(xs_currentZoneFuture){
            xs_pkdc_currentName = xs_currentZoneFuture.data.vd_name;
            if(XS.Main.CacheZoneInfos.town.countyId != xs_clickMapFutureId)
            {
                var dataN = {pbno:xs_clickMapFutureId.toString().slice(0,6)};
                XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTownsBaseInfoByareaId", dataN, function(json){
                    if(json && json.length>0){
                        XS.Main.CacheZoneInfos.town.data = json;
                        XS.Main.CacheZoneInfos.town.countyId = xs_clickMapFutureId.toString().slice(0,6);
                        for(var i in json){
                            if(json[i].TOWB_ID == xs_clickMapFutureId.toString().slice(0,9)){
                                xs_pkdc_preName = json[i].TOWB_NAME;
                                XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.village, xs_currentZoneFuture.data.乡镇代码, xs_clickMapFutureId);
                            }
                        }
                    }else{
                        XS.CommonUtil.showMsgDialog("","未找到相关数据！");
                    }
                });
            }else{
                var json = XS.Main.CacheZoneInfos.town.data;
                for(var i in json){
                    if(json[i].TOWB_ID == xs_clickMapFutureId){
                        xs_pkdc_preName = json[i].TOWB_NAME;
                        XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.town, xs_currentZoneFuture.data.乡镇代码, xs_clickMapFutureId);
                    }
                }
            }
        }else{
            XS.Main.Pkjc.showInfoWin(XS.Main.ZoneLevel.village, -1, xs_clickMapFutureId);
        }
    }
}

/**
 * 显示贫困仪表盘
 * @param pop 贫困人口
 * @param ratio 贫困发生率
 * @param family 贫困户
 */
XS.Main.Pkjc.showGaugeData = function(pop, ratio, family){
    if(!xs_pkdc_GaugeChart)
    {
        var gaugeTag = "<div id='xs_pkdc_gaugeC' style='z-index: 998;'>" +
            "<div id='xs_pkdc_gauge_bg1' style='width: 104px; height: 104px; position: absolute; top: 97px; right: 300px; z-index: 998;background: #15144a; border-radius: 53px;color: #00c400;font-size: 10px;line-height: 150px;text-align: center;'>人口</div>"+
            "<div id='xs_pkdc_gauge_bg1_pop' style='width: 104px; height: 15px;line-height: 15px;text-align: center; position: absolute; top: 178px; right: 300px; z-index: 999;color: #00bbee;font-size: 10px;text-align: center;'></div>"+
            "<div id='xs_pkdc_gauge_bg2' style='width: 136px; height: 136px; position: absolute; top: 78px; right: 152px; z-index: 998;background: #ffffff; border-radius: 68px;color: #ff0000;font-size: 13px;line-height: 100px;text-align: center;'>贫困率</div>"+
            "<div id='xs_pkdc_gauge_bg3' style='width: 104px; height: 104px; position: absolute; top: 98px; right: 36px; z-index: 998;background: #123c66; border-radius: 53px;color: #00c400;font-size: 10px;line-height: 147px;text-align: center;'>户数</div>"+
            "<div id='xs_pkdc_gauge_bg3_hub' style='width: 104px; height: 15px;line-height: 15px;text-align: center; position: absolute; top: 178px; right: 36px; z-index: 999;color: #00bbee;font-size: 10px;text-align: center;'></div>"+
            "<div id='xs_pkdc_gauge' style='width: 440px; height: 300px; position: absolute; top: 0px; right: 0px; z-index: 998; border: 0px;'></div>" +
            "</div>";

        $("#xs_MapContainer").append(gaugeTag);
        xs_pkdc_GaugeChart = echarts.init(document.getElementById("xs_pkdc_gauge"), "shine");

        //点击仪表盘指针事件处理
        xs_pkdc_GaugeChart.on('click', function (params)
        {
            if(xs_pkdc_isShowInfoWin){
                xs_pkdc_isShowInfoWin = false;
                xs_isShowUtfGridTip = true;
                XS.Main.Pkjc.closeInfoDialog();
            }else{
                if(xs_pkdc_isFirstShowInfoWin){
                    XS.Main.Pkjc.pkdc();
                }else{
                    XS.Main.Poor.clearRelocationLayer();
                    XS.Main.clearMap();
                    XS.Main.closeDialogs("xs_main_detail");
                    $('#xs_pkdc_msgWin').window('open');
                }
                xs_pkdc_isShowInfoWin = true;
            }
        });

        XS.Main.addDivHover2HiddenUTFGridTip("xs_pkdc_gaugeC");
    }
    xs_pkdc_PopRate = 1;
    xs_pkdc_HuRate = 1;

   var bpop = pop;
   var bfamily = family;

   if(pop>10&&pop<=100){
        pop = pop/10;
        xs_pkdc_PopRate = 10;
    }else if(pop>100&&pop<=1000){
        pop = pop/100;
        xs_pkdc_PopRate = 100;
    }else if(pop>1000&&pop<=10000){
        pop = pop/1000;
        xs_pkdc_PopRate = 1000;
    }else if(pop>10000&&pop<=100000){
        pop = pop/10000;
        xs_pkdc_PopRate = 10000;
    }else if(pop>100000&&pop<=1000000){
        pop = pop/100000;
        xs_pkdc_PopRate = 100000;
    }else if(pop>1000000&&pop<10000000){
        pop = pop/1000000;
        xs_pkdc_PopRate = 1000000;
    }

    if(family>10&&family<=100){
        family = family/10;
        xs_pkdc_HuRate = 10;
    }else if(family>100&&family<=1000){
        family = family/100;
        xs_pkdc_HuRate = 100;
    }else if(family>1000&&family<=10000){
        family = family/1000;
        xs_pkdc_HuRate = 1000;
    }else if(family>10000&&family<=100000){
        family = family/10000;
        xs_pkdc_HuRate = 10000;
    }else if(family>100000&&family<=1000000){
        family = family/100000;
        xs_pkdc_HuRate = 100000;
    }else if(family>1000000&&family<10000000){
        family = family/1000000;
        xs_pkdc_HuRate = 1000000;
    }

    //XS.LogUtil.log("ratio="+ratio);
    XS.Main.Pkjc.gaugeOption.series[0].data[0].value = new Number(ratio).toFixed(2); //发生率 0-100
    XS.Main.Pkjc.gaugeOption.series[1].data[0].value = pop; //贫困人口 0-10
    XS.Main.Pkjc.gaugeOption.series[2].data[0].value = family; //贫困户 0-10

    $("#xs_pkdc_gauge_bg1_pop").empty().append(bpop+"");
    $("#xs_pkdc_gauge_bg3_hub").empty().append(bfamily+"");

    $("#xs_pkdc_gaugeC").css("display", "block");
    xs_pkdc_GaugeChart.setOption(XS.Main.Pkjc.gaugeOption);
    xs_pkdc_isGaugeClose = false;
}

//关闭仪表盘
XS.Main.Pkjc.closeGaugeData = function(){
    /*$("#xs_pkdc_gaugeC").css("display", "none");
    xs_pkdc_isGaugeClose = true;*/
}

var xs_pkdc_isShowInfoWin = false; //是否显示贫困洞察窗口
var xs_pkdc_isFirstShowInfoWin = true; //是否第一次打开贫困洞察窗口
var xs_pkdc_currentStateCode = -1; //当前ID
var xs_pkdc_superStateCode = -1; //上一级Id
var xs_pkdc_cacheDataArr = []; //数据缓存
var xs_pkdc_zoneLevel = -1;
//点击仪表盘显示下级信息窗口 superId:通过查找当前的区域的信息，id 通过当前的ID查找下一级的信息
XS.Main.Pkjc.showInfoWin = function(level, superId, id){
   // XS.LogUtil.log($("#xs_pkdc_msgWin"));
    xs_pkdc_isShowInfoWin = true;
    xs_pkdc_isFirstShowInfoWin = false;
    $("#xs_echartjs").empty().append('<script src="../base/echart/echarts.js"></script>');
    xs_pkdc_isWinMin = false;
    xs_pkdc_superStateCode = superId;
    xs_pkdc_currentStateCode = id;
    xs_pkdc_BarChartDataIndex = 0;
    xs_pkdc_zoneLevel = level;
    //----------------------加载一次---------------------------------
    if(!document.getElementById("xs_pkdc_msgWin"))
    {
        var winTag =
        "<div id='xs_pkdc_msgWin' style='width: 100%; height: 100%;box-sizing: border-box;'>" +
        '<table cellpadding="2" bordercolor="#DBDBDB" border="1" style="border-collapse: collapse;width: 100%; height: 100%;font-size: 13px;">' +
            '<tr style="height: 30px;">' +
                '<td>' +
                    "<div id='xs_pkdc_linkButtonC' style='padding-top:2px;vertical-align: middle;'>" +
                        "<a id='xs_pkdc_backSuperBtn' href='javascript:void(0);' style='width: 80px;height:25px; margin-left:5px; display: inline-block;'>上一级</a>" +
                        //"<a id='xs_pkdc_positionBtn' href='javascript:void(0);'  style='width: 80px;height:25px; margin-left:20px; display: inline-block;'>定位</a>" +
                        "<a id='xs_pkdc_poorAdviceBtn' href='javascript:void(0);'  style='width: 80px;height:25px; margin-left:20px; display: inline-block;'>扶贫意见</a>" +
                    "</div>" +
                '</td>' +
            '</tr>'+
            '<tr style="height: 430px;">' +
                '<td>' +
                    "<div style='width: 100%;height: 430px;position: relative;'>"+
                        "<div id='xs_pkdc_mgsLeft' style='width:100%; height:100%;overflow:auto;'>" +
                            "<div id='xs_pkdc_msg_barC'  style='width: 560px;height: auto;'></div>" +
                        "</div>" +
                        "<div id='xs_pkdc_msg_pieC'  style='width: 200px; height: 200px;position: absolute;top: 80px;right: 80px;'></div>" +
                    "</div>"+
                '</td>' +
            '</tr>'+
            '<tr style="height: 70px;">' +
                '<td>' +
                    "<div  id='xs_pkdc_msg_tabC' style='width: 100%; height: 100%;'>" +
                        "<div  id='xs_pkdc_msg_btnC' style='width: 100%; height: 100%;text-align: center;padding-top: 5px;'>" +
                            "<a id='xs_pkdc_details' href='javascript:void(0);'  style='background: #304655;margin-right: 1px; color: #ffffff;'>详情</a>" +
                            "<a id='xs_pkdc_dataAnalysis' href='javascript:void(0);'  style='background: #304655;margin-right: 1px;color: #ffffff;'>数据分析</a>" +
                            "<a id='xs_pkdc_dutyMonitor' href='javascript:void(0);'  style='background: #304655;margin-right: 1px;color: #ffffff;'>责任监控</a>" +
                            "<a id='xs_pkdc_taskMonitor' href='javascript:void(0);'  style='background: #304655;margin-right: 1px;color: #ffffff;'>任务监控</a>" +
                            "<a id='xs_pkdc_itemFund' href='javascript:void(0);'  style='background: #304655;margin-right: 1px;;color: #ffffff;'>项目资金</a>" +
                            "<a id='xs_pkdc_itemRelocate' href='javascript:void(0);'  style='background: #304655;color: #ffffff;'>扶贫搬迁</a>" +
                        "</div>" +
                    "</div>" +
                '</td>' +
            '</tr>'+
        "</table>" +
        "</div>";
        $("#xs_MapContainer").append(winTag);

        //底部按钮
        $('#xs_pkdc_details').linkbutton({iconCls:'xs_pkdc_chart',iconAlign:'top',size:'large',width:80,height:64});
        $('#xs_pkdc_dataAnalysis').linkbutton({iconCls:'icon-main_tjfx',iconAlign:'top',size:'large',width:80,height:64});
        $('#xs_pkdc_dutyMonitor').linkbutton({iconCls:'icon-main_gtzz',iconAlign:'top',size:'large',width:80,height:64});
        $('#xs_pkdc_taskMonitor').linkbutton({iconCls:'xs_pkdc_task',iconAlign:'top',size:'large',width:80,height:64});
        $('#xs_pkdc_itemFund').linkbutton({iconCls:'xs_pkdc_money',iconAlign:'top',size:'large',width:80,height:64});
        $('#xs_pkdc_itemRelocate').linkbutton({iconCls:'xs_pkdc_family',iconAlign:'top',size:'large',width:80,height:64});

        //返回上一级
        $('#xs_pkdc_backSuperBtn').linkbutton({iconCls:'icon-back'});
        //定位
        //$('#xs_pkdc_positionBtn').linkbutton({iconCls:'icon-main_position'});
        //扶贫意见
        $('#xs_pkdc_poorAdviceBtn').linkbutton({iconCls:'e_icon-email_go'});
        //添加加载进度
        XS.CommonUtil.loadProgressCircleTag($("#xs_pkdc_mgsLeft"), "xs_pkdc_msgWin_p");

        //初始化窗口
        $('#xs_pkdc_msgWin').window({
            modal:false,
            iconCls:'icon-man',
            collapsible: false,
            minimizable: false,
            maximizable: false,
            resizable:false,
            closable: true,
            width:600,
            height:600,
            left:0,
            top:null,
            tools:[],
            onClose:function(){
                xs_pkdc_isShowInfoWin = false;
            }
        });

        //返回上一级事件处理
        $("#xs_pkdc_backSuperBtn").click(function () {
            if (xs_pkdc_zoneLevel == XS.Main.ZoneLevel.village) {
                switch (xs_user_regionLevel) {
                    case XS.Main.ZoneLevel.city:
                    case XS.Main.ZoneLevel.county:
                        xs_pkdc_currentStateCode = xs_pkdc_superStateCode;
                        xs_pkdc_superStateCode = Math.floor(xs_pkdc_superStateCode/1000);
                        xs_pkdc_currentName = xs_pkdc_preName;
                        xs_pkdc_preName = xs_pkdc_countyNames[xs_pkdc_superStateCode];
                        xs_pkdc_zoneLevel = xs_pkdc_zoneLevel - 1;

                        XS.Main.Pkjc.showInfoWin(xs_pkdc_zoneLevel, xs_pkdc_superStateCode, xs_pkdc_currentStateCode);
                        break;
                    case XS.Main.ZoneLevel.town:
                        xs_pkdc_currentName = xs_pkdc_preName;
                        xs_pkdc_preName = xs_pkdc_currentName;
                        xs_pkdc_zoneLevel = xs_pkdc_zoneLevel - 1;
                        XS.Main.Pkjc.showInfoWin(xs_pkdc_zoneLevel, Math.floor(xs_pkdc_superStateCode/1000), xs_pkdc_superStateCode);
                        break;
                    case XS.Main.ZoneLevel.village:
                        XS.CommonUtil.showMsgDialog("", "您的权限不够");
                        break;
                }
            } else if (xs_pkdc_zoneLevel == XS.Main.ZoneLevel.town) {
                switch (xs_user_regionLevel) {
                    case XS.Main.ZoneLevel.city:
                        xs_pkdc_currentName = xs_pkdc_preName;
                        xs_pkdc_preName = "毕节市";
                        xs_pkdc_zoneLevel = xs_pkdc_zoneLevel - 1;
                        XS.Main.Pkjc.showInfoWin(xs_pkdc_zoneLevel, xs_cityID, xs_pkdc_superStateCode);
                        break;
                    case XS.Main.ZoneLevel.county:
                        xs_pkdc_currentName = xs_pkdc_preName;
                        xs_pkdc_zoneLevel = xs_pkdc_zoneLevel - 1;
                        XS.Main.Pkjc.showInfoWin(xs_pkdc_zoneLevel, xs_cityID, xs_pkdc_superStateCode);
                        break;
                    case XS.Main.ZoneLevel.town:
                    case XS.Main.ZoneLevel.village:
                        XS.CommonUtil.showMsgDialog("", "您的权限不够");
                        break;
                }
            } else if (xs_pkdc_zoneLevel == XS.Main.ZoneLevel.county) {
                switch (xs_user_regionLevel) {
                    case XS.Main.ZoneLevel.city:
                        xs_pkdc_currentName = xs_pkdc_preName;
                        xs_pkdc_zoneLevel = xs_pkdc_zoneLevel - 1;
                        XS.Main.Pkjc.showInfoWin(xs_pkdc_zoneLevel, -1, xs_pkdc_superStateCode);
                        break;
                    case XS.Main.ZoneLevel.county:
                    case XS.Main.ZoneLevel.town:
                    case XS.Main.ZoneLevel.village:
                        XS.CommonUtil.showMsgDialog("", "您的权限不够");
                        break;
                }

            }
        });

        //定位事件处理
        /*$("#xs_pkdc_positionBtn").click(function(){
            XS.Main.Poor.clearRelocationLayer();
            if(XS.Main.CacheZoneInfos.town.data){

            }
            XS.Main.Poor.showPoors(xs_pkdc_cacheDataArr);
        });*/

        //扶贫意见事件处理
        $('#xs_pkdc_poorAdviceBtn').click(function(){
            XS.Main.showAdvanceFeedDialog(id);
        });
        //详情点击
        $('#xs_pkdc_details').click(function(){
            XS.Main.Pkjc.clickDetail(xs_pkdc_zoneLevel,xs_pkdc_currentName,xs_pkdc_currentStateCode,true);
        });
        //数据分析点击
        $('#xs_pkdc_dataAnalysis').click(function(){
            XS.Main.Pkjc.clickAnalysis(xs_pkdc_zoneLevel,xs_pkdc_currentStateCode,xs_pkdc_currentName,true);
        });
        //责任监控
        $("#xs_pkdc_dutyMonitor").click(function(){
            XS.Main.Pkjc.closeInfoDialog();
            XS.Main.Poor.clearRelocationLayer();
            XS.Main.Pkjc.clickDutyChain(xs_pkdc_zoneLevel, xs_pkdc_currentStateCode,xs_pkdc_currentName);
        });
        //任务监控
        $("#xs_pkdc_taskMonitor").click(function(){
            if(xs_pkdc_currentStateCode== xs_cityID){
                XS.CommonUtil.showMsgDialog("","毕节市太大，请先选择下级区县");
                return;
            }
            XS.Main.Pkjc.closeInfoDialog();
            XS.Main.Poor.clearRelocationLayer();
            XS.Main.Pkjc.clickTaskMonitor(xs_pkdc_zoneLevel, xs_pkdc_currentStateCode,xs_pkdc_currentName);
        });
        //项目资金点击
        $('#xs_pkdc_itemFund').click(function(){
            XS.Main.Pkjc.clickItemFund(xs_pkdc_currentName);
        });
        //扶贫搬迁点击
        $("#xs_pkdc_itemRelocate").click(function(){
            XS.Main.Pkjc.closeInfoDialog();
            XS.Main.Poor.clearRelocationLayer();
            XS.Main.Poor.povertyRelocation(xs_pkdc_zoneLevel, xs_pkdc_currentStateCode);
        });

        XS.Main.addDivHover2HiddenUTFGridTip("xs_pkdc_msgWin");
    }
    //-------------------------加载一次 结束-----------------------------------
    $('#xs_pkdc_msgWin').window({"title":xs_pkdc_currentName + "-贫困洞察"/*, width:1020,height:600*/}).window('open');
    $("#xs_pkdc_backSuperBtn").linkbutton({text: xs_pkdc_preName});
    $("#xs_pkdc_msg_pieC").css("display","block");

    if(!xs_pkdc_PieChart){
        xs_pkdc_PieChart = echarts.init(document.getElementById("xs_pkdc_msg_pieC"));
    }
    $("#xs_pkdc_msg_barC").empty();

    xs_pkdc_categoryData = [];
    xs_pkdc_barChartData = {poorHSeries:[],poorPSeries:[]};
    xs_pkdc_poorOccurRate = [];
    xs_pkdc_cacheDataArr  = [];
    $('#xs_pkdc_backSuperBtn').linkbutton({disabled:false});
    //$('#xs_pkdc_positionBtn').linkbutton({disabled:true});
    $("#xs_pkdc_msg_barC").css({width:"560px",overflowY: "auto"});
    $('#xs_pkdc_poorHbBtn,#xs_pkdc_positionBtn').remove();

    if(xs_pkdc_zoneLevel == XS.Main.ZoneLevel.city)
    {
        $('#xs_pkdc_backSuperBtn').linkbutton({disabled:true});
        if(XS.Main.CacheZoneInfos.county.length<1)
        {
            var data = {pbno: id};
            $("#xs_pkdc_msgWin_p").css("display", "block");
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryCountyBaseInfoByareaId", data, function(json){
                $("#xs_pkdc_msgWin_p").css("display", "none");
                if(json && json.length>0){
                    XS.Main.CacheZoneInfos.county = json;
                    xs_pkdc_cacheDataArr = json;
                    XS.Main.Pkjc.showBar("CBI_ID","CBI_NAME","cps_poor_hhnum","cps_poor_pop","cps_Poverty_rate");
                }
            });
        }else{
            xs_pkdc_cacheDataArr = XS.Main.CacheZoneInfos.county;
            XS.Main.Pkjc.showBar("CBI_ID","CBI_NAME","cps_poor_hhnum","cps_poor_pop","cps_Poverty_rate");
        }
    }else if(xs_pkdc_zoneLevel == XS.Main.ZoneLevel.county)
    {
        if(id != XS.Main.CacheZoneInfos.town.countyId){
            var dataN = {pbno: id};
            $("#xs_pkdc_msgWin_p").css("display", "block");
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTownsBaseInfoByareaId", dataN, function(json){
                $("#xs_pkdc_msgWin_p").css("display", "none");
                if(json && json.length>0){
                    xs_pkdc_cacheDataArr = json;
                    XS.Main.CacheZoneInfos.town.data = json;
                    XS.Main.CacheZoneInfos.town.countyId = id;
                    XS.Main.Pkjc.showBar("TOWB_ID","TOWB_NAME","TOWB_HouseNum","TOWB_PeopleNum","tpl_PoorRate");
                }
            });
        }else{
            xs_pkdc_cacheDataArr = XS.Main.CacheZoneInfos.town.data;
            XS.Main.Pkjc.showBar("TOWB_ID","TOWB_NAME","TOWB_HouseNum","TOWB_PeopleNum","tpl_PoorRate");
        }
    }else if(xs_pkdc_zoneLevel == XS.Main.ZoneLevel.town)
    {
        if(id != XS.Main.CacheZoneInfos.village.townId){
            var dataN = {pbno: id};
            $("#xs_pkdc_msgWin_p").css("display", "block");
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryVillBaseByareaId", dataN, function(json){
                $("#xs_pkdc_msgWin_p").css("display", "none");
                if(json && json.length>0)
                {
                    xs_pkdc_cacheDataArr = json;
                    XS.Main.CacheZoneInfos.village.townId = id;
                    XS.Main.CacheZoneInfos.village.data = json;
                    XS.Main.Pkjc.showBar("VBI__ID","VBI_NAME","VBI_HouseNum","VBI_PeopleNum","VillPoorRate");
                }
            });
        }else{
            xs_pkdc_cacheDataArr = XS.Main.CacheZoneInfos.village.data;
            XS.Main.Pkjc.showBar("VBI__ID","VBI_NAME","VBI_HouseNum","VBI_PeopleNum","VillPoorRate");
        }
    }else if(xs_pkdc_zoneLevel == XS.Main.ZoneLevel.village)
    {
        //$('#xs_pkdc_positionBtn').linkbutton({disabled:false});
        $("#xs_pkdc_msg_pieC").css("display","none");
        $("#xs_pkdc_msg_barC").css({width:"100%",height:"auto",overflowY: "hidden"});
        var xs_pkdc_detailCash = [];
        var xs_pkdc_detailCashJson = null;
        var xs_pkdc_detailClickNum = 0;
        data = {pd_id:id};
        $("#xs_pkdc_msgWin_p").css("display", "block");
        XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryVillBaseById", data, function(json) {
            $("#xs_pkdc_msgWin_p").css("display", "none");
            if(json && xs_pkdc_detailClickNum == 0) {
                xs_pkdc_detailCashJson = json;
                var villBaseInfNameField = XS.Main.Pkjc.detailKV.village.tabs[0].name;
                var villBaseInfValueField = XS.Main.Pkjc.detailKV.village.tabs[0].value;
                for(var i in villBaseInfNameField){
                    if(villBaseInfNameField[i] == "贫困发生率" || villBaseInfNameField[i] == "贫困发生率(%)"){
                        xs_pkdc_detailCash.push({name:villBaseInfNameField[i],value:json[villBaseInfValueField[i]] || json[villBaseInfValueField[i]]==0 ? json[villBaseInfValueField[i]].toFixed(2) : ""});
                    }else{
                        xs_pkdc_detailCash.push({name:villBaseInfNameField[i],value:json[villBaseInfValueField[i]] || json[villBaseInfValueField[i]]==0 ? json[villBaseInfValueField[i]] : ""});
                    }
                }
                $("#xs_pkdc_msg_barC").empty().append(XS.Main.Poor.createTable(xs_pkdc_detailCash, 2, 50,"","color:#00bbee"));
                $(".datagrid-wrap").css("width","auto");
            }else{

                //$('#xs_pkdc_tabsContentDom').empty().append('<div style="position: absolute;color:#ff0000;font-size: 40px;left: 44%;top: 48%;">暂无相关数据</div>');
            }
        });

        var xs_pkdc_poorHBtn = "<a id='xs_pkdc_poorHbBtn' href='javascript:void(0);'  style='width: 80px;height:25px; margin-left:20px;display: inline-block;'>贫困户</a>";
        $('#xs_pkdc_linkButtonC').append(xs_pkdc_poorHBtn);
        $('#xs_pkdc_poorHbBtn').linkbutton({iconCls:'icon-man'});
        $('#xs_pkdc_poorHbBtn').click(function(){
            if(xs_pkdc_detailClickNum == 0){
                $('#xs_pkdc_poorHbBtn').linkbutton({text:"基本信息"});
                xs_pkdc_detailClickNum = 1;

                var xs_pkdc_positionBtn = "<a id='xs_pkdc_positionBtn' href='javascript:void(0);'  style='width: 80px;height:25px; margin-left:20px;'>定位</a>";
                $('#xs_pkdc_linkButtonC').append(xs_pkdc_positionBtn);
                $('#xs_pkdc_positionBtn').linkbutton({iconCls:'icon-main_position'});
                $('#xs_pkdc_positionBtn').click(function(){
                    XS.Main.Poor.clearRelocationLayer();
                    if(xs_pkdc_detailCashJson.VBI_LONGITUDE && xs_pkdc_detailCashJson.VBI_LATITUDE){
                        var lonLat = new SuperMap.LonLat(xs_pkdc_detailCashJson.VBI_LONGITUDE, xs_pkdc_detailCashJson.VBI_LATITUDE);
                        XS.Main.readyAddMarkers(lonLat,XS.Main.ZoneLevel.village,xs_pkdc_detailCashJson.VBI__ID);
                    }
                });

                var xs_pkdc_village = '<table id="xs_pkdc_village" class="easyui-datagrid" style="width:100%;height:100%;overflow: hidden;"></table>';
                $("#xs_pkdc_msg_barC").empty().append(xs_pkdc_village);
                if(id != XS.Main.CacheZoneInfos.poorH.villageId){
                    var dataN = {pbno: id,pageNo:1,pageSize:15};
                    $("#xs_pkdc_msgWin_p").css("display", "block");
                    //http://61.159.185.196:7060/Service2.svc/QueryHousePeoByHidOfPage?pbno=52242810102&pageNo=1
                    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHousePeoByHidOfPage", dataN, function(json){
                        $("#xs_pkdc_msgWin_p").css("display", "none");
                        if(json && json.length>0 && xs_pkdc_detailClickNum == 1) {
                            xs_pkdc_cacheDataArr = json;
                            XS.Main.CacheZoneInfos.poorH.villageId = id;
                            XS.Main.CacheZoneInfos.poorH.data = json;
                            XS.Main.Pkjc.showHouseDataGrid();
                        }
                    });
                }else{
                    xs_pkdc_cacheDataArr = XS.Main.CacheZoneInfos.poorH.data;
                    XS.Main.Pkjc.showHouseDataGrid();
                }
            }else{
                $('#xs_pkdc_positionBtn').remove();
                $("#xs_pkdc_msgWin_p").css("display", "none");
                $('#xs_pkdc_poorHbBtn').linkbutton({text:"贫困户"});
                xs_pkdc_detailClickNum = 0;

                $("#xs_pkdc_msg_barC").empty().append(XS.Main.Poor.createTable(xs_pkdc_detailCash, 2, 50,"","color:#00bbee"));
                $(".datagrid-wrap").css("width","auto");
            }
        });
    }

}

//点击左贫困柱Bar图时更新右贫困率饼图
XS.Main.Pkjc.showOccurRatioPie = function(name, ratio){
    XS.Main.Pkjc.pieOption.series[0].data[0].value = ratio;
    XS.Main.Pkjc.pieOption.series[0].data[1].value =100-ratio;

    XS.Main.Pkjc.pieOption.title = {
        top:240,
        text: '贫困率(' + name +  ')',
        left: 'center',
        show:false
    };
    // 使用配置项和数据显示贫困发生率的饼图。
    xs_pkdc_PieChart.setOption(XS.Main.Pkjc.pieOption);

}

//选中贫困户事件处理
XS.Main.Pkjc.onSelectedRowHandler = function(rowIndex, rowData){
    xs_pkdc_cacheDataArr = [];
    xs_pkdc_cacheDataArr.push(rowData);
    XS.Searchbox.baseInfoClick(XS.Main.ZoneLevel.poor,rowData.vid,"贫困户",0);
}
/**
 * 获取当前级别的和上一级的name
 */
XS.Main.Pkjc.reqCurrAndPreName = function(){
    var isCashEmpty = false;
    var action = "";
    switch (xs_pkdc_zoneLevel){
        case XS.Main.ZoneLevel.city:
        {

            break;
        }
        case XS.Main.ZoneLevel.county:
        {
            isCashEmpty = XS.Main.CacheZoneInfos.county.length==0;
            action = "QueryCountyBaseInfoByareaId";
            break;
        }
        case XS.Main.ZoneLevel.town:
        {
            isCashEmpty = xs_pkdc_superStateCode==XS.Main.CacheZoneInfos.town.countyId;
            action = "QueryTownsBaseInfoByareaId";
            break;
        }
        case XS.Main.ZoneLevel.village:
        {
            isCashEmpty = xs_pkdc_superStateCode==XS.Main.CacheZoneInfos.village.townId;
            action = "QueryVillBaseByareaId";
            break;
        }
    }
    if(!isCashEmpty){
        var dataN = {pbno: xs_pkdc_superStateCode};
        $("#xs_pkdc_msgWin_p").css("display", "block");
        XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, dataN, function(json){
            $("#xs_pkdc_msgWin_p").css("display", "none");
            if(json && json.length>0){
                switch (xs_pkdc_zoneLevel) {
                    case XS.Main.ZoneLevel.city:
                    {

                        break;
                    }
                    case XS.Main.ZoneLevel.county:
                    {
                        XS.Main.CacheZoneInfos.county = json;
                        XS.Main.Pkjc.preAndCurrentName([],XS.Main.CacheZoneInfos.county,"","","CBI_ID","CBI_NAME");
                        if(xs_pkdc_zoneLevel == xs_user_regionLevel){
                            xs_pkdc_preName = xs_pkdc_currentName;
                        }else{
                            xs_pkdc_preName = "毕节市";
                        }
                        break;
                    }
                    case XS.Main.ZoneLevel.town:
                    {
                        XS.Main.CacheZoneInfos.town.data = json;
                        XS.Main.CacheZoneInfos.town.countyId = xs_pkdc_superStateCode;
                        if(xs_pkdc_zoneLevel == xs_user_regionLevel){
                            XS.Main.Pkjc.preAndCurrentName([],XS.Main.CacheZoneInfos.town.data,"","","TOWB_ID","TOWB_NAME");
                            xs_pkdc_preName = xs_pkdc_currentName;
                        }else{
                            XS.Main.Pkjc.preAndCurrentName(XS.Main.CacheZoneInfos.county,XS.Main.CacheZoneInfos.town.data,"CBI_ID","CBI_NAME","TOWB_ID","TOWB_NAME");
                        }
                        break;
                    }
                    case XS.Main.ZoneLevel.village:
                    {
                        XS.Main.CacheZoneInfos.village.townId = xs_pkdc_superStateCode;
                        XS.Main.CacheZoneInfos.village.data = json;
                        if(xs_pkdc_zoneLevel == xs_user_regionLevel){
                            XS.Main.Pkjc.preAndCurrentName([],XS.Main.CacheZoneInfos.village.data,"","","VBI__ID","VBI_NAME");
                            xs_pkdc_preName = xs_pkdc_currentName;
                        }else{
                            XS.Main.Pkjc.preAndCurrentName(XS.Main.CacheZoneInfos.town.data,XS.Main.CacheZoneInfos.village.data,"TOWB_ID","TOWB_NAME","VBI__ID","VBI_NAME");
                        }
                        break;
                    }
                }
                $('#xs_pkdc_msgWin').window({"title":xs_pkdc_currentName + "-贫困洞察"/*, width:1020,height:600*/}).window('open');
                $("#xs_pkdc_backSuperBtn").linkbutton({text: xs_pkdc_preName});
            }
        });
    }else{
        switch (xs_pkdc_zoneLevel) {
            case XS.Main.ZoneLevel.city:
            {

                break;
            }
            case XS.Main.ZoneLevel.county:
            {
                XS.Main.Pkjc.preAndCurrentName([],XS.Main.CacheZoneInfos.county,"","","CBI_ID","CBI_NAME");
                if(xs_pkdc_zoneLevel == xs_user_regionLevel){
                    xs_pkdc_preName = xs_pkdc_currentName;
                }else{
                    xs_pkdc_preName = "毕节市";
                }
                break;
            }
            case XS.Main.ZoneLevel.town:
            {
                if(xs_pkdc_zoneLevel == xs_user_regionLevel){
                    XS.Main.Pkjc.preAndCurrentName([],XS.Main.CacheZoneInfos.town.data,"","","TOWB_ID","TOWB_NAME");
                    xs_pkdc_preName = xs_pkdc_currentName;
                }else{
                    XS.Main.Pkjc.preAndCurrentName(XS.Main.CacheZoneInfos.county,XS.Main.CacheZoneInfos.town.data,"CBI_ID","CBI_NAME","TOWB_ID","TOWB_NAME");
                }
                break;
            }
            case XS.Main.ZoneLevel.village:
            {
                if(xs_pkdc_zoneLevel == xs_user_regionLevel){
                    XS.Main.Pkjc.preAndCurrentName([],XS.Main.CacheZoneInfos.village.data,"","","VBI__ID","VBI_NAME");
                    xs_pkdc_preName = xs_pkdc_currentName;
                }else{
                    XS.Main.Pkjc.preAndCurrentName(XS.Main.CacheZoneInfos.town.data,XS.Main.CacheZoneInfos.village.data,"TOWB_ID","TOWB_NAME","VBI__ID","VBI_NAME");
                }
                break;
            }
        }
        $('#xs_pkdc_msgWin').window({"title":xs_pkdc_currentName + "-贫困洞察"}).window('open');
        $("#xs_pkdc_backSuperBtn").linkbutton({text: xs_pkdc_preName});
    }
}
/**
 * 显示市级的下层bar
 * @param regionId
 * @param regionName
 * @param poorH
 * @param poorP
 * @param poorRate
 */
XS.Main.Pkjc.showBar = function(regionId,regionName,poorH,poorP,poorRate){
    var json = xs_pkdc_cacheDataArr;
    for(var i=0;i<json.length;i++){
        xs_pkdc_categoryData.push(json[i][regionName]);
        xs_pkdc_barChartData.poorHSeries.push(json[i][poorH]);
        xs_pkdc_barChartData.poorPSeries.push(json[i][poorP]);
        xs_pkdc_poorOccurRate.push(json[i][poorRate]);
    }

    var gridN = xs_pkdc_categoryData.length;
    if(gridN >=10){
        $("#xs_pkdc_msg_barC").css("height",gridN * 39 + 90);
    }else{
        $("#xs_pkdc_msg_barC").css("height","100%");
    }
    var xs_pkdc_BarChart = echarts.init(document.getElementById("xs_pkdc_msg_barC"), "shine");
    xs_pkdc_BarChart.on("click",function(params) {
        xs_pkdc_BarChartDataIndex = params.dataIndex;
        xs_pkdc_zoneLevel = xs_pkdc_zoneLevel+1;

        xs_pkdc_preName = xs_pkdc_currentName;
        var nameField = "";
        var idField = "";
        switch (xs_pkdc_zoneLevel){
            case XS.Main.ZoneLevel.county:
            {
                nameField = "CBI_NAME";
                idField = "CBI_ID";
                break;
            }
            case XS.Main.ZoneLevel.town:
            {
                nameField = "TOWB_NAME";
                idField = "TOWB_ID";
                break;
            }
            case XS.Main.ZoneLevel.village:
            {
                nameField = "VBI_NAME";
                idField = "VBI__ID";
                break;
            }
        }
        for(var i in xs_pkdc_cacheDataArr){
            if(xs_pkdc_cacheDataArr[xs_pkdc_BarChartDataIndex][regionId] == xs_pkdc_cacheDataArr[i][idField]){
                xs_pkdc_currentName = xs_pkdc_cacheDataArr[i][nameField];
                break;
            }
        }
        XS.Main.Pkjc.showInfoWin(xs_pkdc_zoneLevel, xs_pkdc_currentStateCode, xs_pkdc_cacheDataArr[xs_pkdc_BarChartDataIndex][regionId]);
    });
    // 使用配置项和数据显示贫困户及贫困人口的柱状图表。
    XS.Main.Pkjc.barOption.grid.height = gridN * 39;
    XS.Main.Pkjc.barOption.yAxis.data = xs_pkdc_categoryData;
    XS.Main.Pkjc.barOption.series[0].data = xs_pkdc_barChartData.poorHSeries;
    XS.Main.Pkjc.barOption.series[1].data = xs_pkdc_barChartData.poorPSeries;

    xs_pkdc_BarChart.setOption(XS.Main.Pkjc.barOption);
    XS.Main.Pkjc.showOccurRatioPie(xs_pkdc_categoryData[0],xs_pkdc_poorOccurRate[0]);

    xs_pkdc_BarChart.on("mouseover",function(params) {
        if (xs_pkdc_BarChartDataIndex == params.dataIndex) {
            return;
        }
        xs_pkdc_BarChartDataIndex = params.dataIndex;
        XS.Main.Pkjc.showOccurRatioPie(xs_pkdc_categoryData[xs_pkdc_BarChartDataIndex],xs_pkdc_poorOccurRate[xs_pkdc_BarChartDataIndex]);
    });
}

//显示村级的下层grid
XS.Main.Pkjc.showHouseDataGrid = function(){
    var json = xs_pkdc_cacheDataArr;
    $("#xs_pkdc_msg_barC").css("height","100%");
    $('#xs_pkdc_village').datagrid({
        data: json,
        pagination: true,
        pageSize: 15,
        pageList: [15],
        striped: true,
        onSelect:XS.Main.Pkjc.onSelectedRowHandler,
        singleSelect: true,
        loadingMessage:"Loading",
        pageNumber: 1,
        loadMsg:"努力加载中...",
        rownumbers: true,
        columns: [[
            {field: 'name', title: '姓名', width: '16%', resizable: false},
            {field: 'num', title: '家庭人数', width: '16%', resizable: false},
            {field: 'income', title: '年收入', width: '16%', resizable: false},
            {field: 'CertNo', title: '身份证', width: '30%', resizable: false},
            {field: 'Altitude', title: '海拔', width: '16%', resizable: false}
        ]]
    });
    var pager = $("#xs_pkdc_village").datagrid("getPager");
    pager.pagination({
        total:json[0].TotolSum,
        showPageList: false,
        onSelectPage:function (pageNumber, pageSize) {

            var dataN = {pbno: xs_pkdc_currentStateCode,pageNo:pageNumber,pageSize:pageSize};
            $("#xs_pkdc_msgWin_p").css("display", "block");
            //http://61.159.185.196:7060/Service2.svc/QueryHousePeoByHidOfPage?pbno=52242810102&pageNo=1
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryHousePeoByHidOfPage", dataN, function(json){
                $("#xs_pkdc_msgWin_p").css("display", "none");
                if(json && json.length>0){
                    xs_pkdc_cacheDataArr = json;
                    $("#xs_pkdc_village").datagrid("loadData", json);
                    pager.pagination('refresh', {
                        showPageList: false,
                        total:json[0].TotolSum,
                        pageNumber:pageNumber
                    });
                }
            });
        }
    });
}
XS.Main.Pkjc.preAndCurrentName = function(preJson,currentJson,superId,superName,currentId,currentName){
    if(superId != "" && superName !=""){
        for(var i in preJson){
            if(preJson[i][superId] == xs_pkdc_superStateCode){
                xs_pkdc_preName = preJson[i][superName];
            }
        }
    }
    if(currentId != "" && currentName != ""){
        for(var i in currentJson){
            if(currentJson[i][currentId] == xs_pkdc_currentStateCode){
                xs_pkdc_currentName = currentJson[i][currentName];
            }
        }
    }
}
/**
 * 点击责任链分析
 * @param zoneLevel 区域级别
 * @param stateCode 行政区域ID
 */
XS.Main.Pkjc.clickDutyChain = function(zoneLevel, stateCode){
    //请求数据
    //{"__type":"WorkRegion:#WcfService2","region_fullname":"毕节市大方县",
    // "region_shortname":"大方县","regionid":"5224","workid":"522400045",
    // "workname":"蔡志君","workpost":"省政协副主席","worktel":"0","workunit":""}
    XS.Main.Pkjc.minInfoWinDialog();
    var data = {pd_id:stateCode};
    XS.CommonUtil.showLoader();
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryBrigInviBySId", data, function (json) {
        XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryDutyHelp", data, function (nextjson)
        {
            XS.CommonUtil.hideLoader();
            var obj = {};
            if(json && json.length > 0){
                obj.name = "&nbsp;" + json[0].workname + "[" + json[0].region_shortname + "]";
                obj.workpost = json[0].workpost;
            }else{
                XS.CommonUtil.showMsgDialog("", "没有相关责任人");
            }
            if (nextjson && nextjson.length > 0){
                obj.children = [];
                for(var i in nextjson){
                    var nobj = nextjson[i];
                    obj.children.push({name:nobj.workname + "[" + nobj.region_shortname + "]", workpost:nobj.workpost, regionid:nobj.regionid});
                }
            }else{
                XS.CommonUtil.showMsgDialog("", "没有下级相关责任人");
                $("#xs_pkdc_msgWin").window("open");
            }
            if(obj.name || obj.children){
                if(!obj.name){
                    obj.name = "暂无责任人";
                }
                if(!obj.workpost){
                    obj.workpost = "";
                }
                var content = '<div id="xs_pkdc_orgchart_container" style="width:auto; min-width: 100%; height:100%; text-align: center;position: relative; top: 0px; left: 0px;line-height: 100%;vertical-align: middle;overflow:auto;background: #ffffff;"></div>';
                XS.CommonUtil.openDialog("xs_main_detail", "责任链", "icon-man", content, false, true, true, 1000, 350,null,null,function(){
                    $("#xs_main_detail").dialog("destroy");
                    $("#xs_pkdc_msgWin").window("open");
                });
                $('#xs_pkdc_orgchart_container').orgchart({
                    'data' : obj,
                    'depth': 5,
                    'nodeContent': 'workpost',
                    'pan': true,
                    'zoom': true,
                    'exportButton': true,
                    'exportFilename': 'dutyChainChart',
                    'createNode': function($node, data) {
                        $node.on('click', function (event) {
                            if (!$(event.target).is('.edge')) {
                            }
                        });
                    }
                });
                $('#xs_pkdc_orgchart_container>.oc-export-btn').empty().append("<i class='fa fa-save fa-1x'></i>");
            }
        },function(e){XS.CommonUtil.hideLoader();});
    },function(e){XS.CommonUtil.hideLoader();});
}

/**
 * 点击任务监控
 * @param zoneLevel 区域级别
 * @param zoneCode 行政区域ID
 */
XS.Main.Pkjc.clickTaskMonitor = function(zoneLevel, zoneCode, zoneName){
    XS.Main.Pkjc.minInfoWinDialog();
    XS.Main.Pkjc.closeInfoDialog();
    if(XS.StrUtil.isEmpty(zoneCode)){
        XS.CommonUtil.showMsgDialog("","请先选择区域");
        return;
    }
    if(zoneCode== xs_cityID){
        XS.CommonUtil.showMsgDialog("","毕节市太大，请先选择下级区县");
        return;
    }
    if(document.getElementById("xs_pkdc_taskC")){
        $("#xs_pkdc_taskC").remove();
    }
    var content =
        '<div id="xs_pkdc_taskC" style="width: 100%; height:100%;padding: 5px;box-sizing: border-box;">';
            content += '<input id="xs_pkdc_task_search" style="width: 92%;height: 26px;"/>';
            content +=
                '<div id="xs_pkdc_task_search_menu" style="display: none;">'+
                    '<div data-options="name:\'all\'"><i style=" margin-right: 2px;" class="fa fa-filter"></i>所有</div>'+
                    '<div data-options="name:\'line\'"><i style=" margin-right: 2px;" class="fa fa-wifi"></i>在线</div>'+
                    '<div data-options="name:\'name\'"><i style=" margin-right: 2px;" class="fa fa-male"></i>姓名</div>'+
                    '<div data-options="name:\'tele\'"><i style=" margin-right: 2px;" class="fa fa-phone"></i>电话</div>'+
                '</div>';
            content += '<div style="margin:5px 0px;"><label>起始:</label><input id="xs_pkdc_task_ds" style="width: 37%;" class="easyui-datebox" data-options="formatter:XS.CommonUtil.dateFormatter,parser:XS.CommonUtil.dateParser"/>';
            content += '<label>&nbsp;终止:</label><input id="xs_pkdc_task_dd" style="width: 37%;" class="easyui-datebox" data-options="formatter:XS.CommonUtil.dateFormatter,parser:XS.CommonUtil.dateParser"/></div>';
            content += '<a href="javascript:0;" id="xs_pkdc_task_linebtn" style="width: 40%; margin-right: 5px;" class="easyui-linkbutton"><i style="color: #1b1b1b; margin-right: 4px;" class="fa fa-search"></i>轨迹</a>';
    /*content += '<a href="javascript:0;" id="xs_pkdc_task_taskbtn" style="width: 22%; margin-right: 5px;" class="easyui-linkbutton"><i style="color: #1b1b1b; margin-right: 4px;" class="fa fa-tasks"></i>任务</a>';
            content += '<a href="javascript:0;" id="xs_pkdc_task_alertbtn" style="width: 22%; margin-right: 5px;" class="easyui-linkbutton"><i style="color: #1b1b1b; margin-right: 4px;" class="fa fa-warning"></i>预警</a>';*/
            content += '<a href="javascript:0;" id="xs_pkdc_task_monitorbtn" style="width: 40%;" class="easyui-linkbutton"><i style="color: #1b1b1b; margin-right: 4px;"class="fa fa-map-marker"></i>动态</a>';
            content += '<div style="margin-top: 5px;position: relative;">' +
            '<div id="xs_pkdc_task_tabC" style="width:100%;height:415px;"></div>' +
            '<i id="xs_pkdc_task_loading" style="position: absolute;top: 50%; left: 50%;margin-left: -25px;margin-top: -25px;visibility: visible;" class="fa fa-spinner fa-pulse fa-3x fa-fw xs_loading"></i>'+
            '</div>';
        content += '</div>';
    //id, title, iconCls, content, resizable, maximizable, modal, width, height, left, top, closeCallback, maximizeCallback, minimizeCallback
    XS.CommonUtil.openDialog("xs_main_detail", zoneName + "-任务监控", "icon-man", content, false, true, false, 350, 550,0,null,function(){
        if(xs_animatorVectorLayer != null){
            xs_MapInstance.getMapObj().removeLayer(xs_animatorVectorLayer);
            xs_animatorVectorLayer = null;
        }
        $("#xs_main_detail").dialog("destroy");
        $("#xs_pkdc_msgWin").window("open");
        xs_clusterLayer.destroyCluster();
        xs_clusterControl.deactivate();
        xs_vectorLayer.removeAllFeatures();
        XS.CommonUtil.closeDialog("xs_main_detail_1");
        xs_isShowUtfGridTip = true;
    });
    XS.Main.addDivHover2HiddenUTFGridTip("xs_main_detail");

    //轨迹查询
    $("#xs_pkdc_task_linebtn").click(XS.Main.Pkjc.task_queryLine);
    /*$("#xs_pkdc_task_taskbtn").click(null);
    $("#xs_pkdc_task_alertbtn").click(null);*/

    //动态
    $("#xs_pkdc_task_monitorbtn").click(function(){
        xs_pkdc_tasker_isFirstReq = true;
        XS.Main.Pkjc.reqOnLineTasker(zoneCode);
    });

    $('#xs_pkdc_taskC>#xs_pkdc_task_search').searchbox({
        searcher:function(value,name){
            //请求数据
            if(name=='all'){
                name = "";
            }
            if(XS.StrUtil.isEmpty(value)){
                value = "";
            }
            XS.Main.Pkjc.reqTasker(zoneCode, type=name, value=value);
        },
        menu:'#xs_pkdc_taskC>#xs_pkdc_task_search_menu',
        prompt:'请输入查询内容'
    });
    //请求数据
    xs_pkdc_task_rdata = null;
    XS.Main.Pkjc.reqTasker(zoneCode, type="", value="");
}

/**
 * 请求任务监控人数据
 * @param regionid 区域ID
 * @param type 类型
 * @param value 查询内容
 */
XS.Main.Pkjc.reqTasker = function(regionid, type, value){
    $("#xs_pkdc_task_loading").css({"visibility":"visible"});
    var data = {regionid: regionid, type:type, value:value};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QuerySysUserByRegionidAndOption", data, function (json) {
        $("#xs_pkdc_task_loading").css({"visibility":"hidden"});
        if(json && json.length>0)
        {
            //{"__type":"SYS_USER:#WcfService2","SU_ACCOUNT":"18334276943","SU_CREATETIME":null,"SU_FLAGONLINE":"不在线",
            // "SU_ID":"","SU_ISLOCKED":0,"SU_LOGINCOUNTER":0,"SU_MEMO":"",
            // "SU_PASSWORD":null,"SU_REGIONID":"522401200","SU_TEL":"18334276943","SU_USERNAME":"梁仕城"}
            xs_pkdc_task_rdata = null;
            $("#xs_pkdc_task_tabC").empty().append('<table id="xs_pkdc_task_dg" class="easyui-datagrid" style="width:100%;height:100%;" title="任务人员列表"></table>');
            $('#xs_pkdc_task_dg').datagrid({
                data: json,
                pagination: true,
                pageSize: 13,
                pageList: [13,20,30],
                striped: true,
                onSelect:XS.Main.Pkjc.onTaskRowSelecte,
                singleSelect: true,
                rownumbers: true,
                columns: [[
                    //{"__type":"SYS_USER:#WcfService2","SU_ACCOUNT":"18334276943","SU_CREATETIME":null,"SU_FLAGONLINE":"不在线",
                    // "SU_ID":"","SU_ISLOCKED":0,"SU_LOGINCOUNTER":0,"SU_MEMO":"",
                    // "SU_PASSWORD":null,"SU_REGIONID":"522401200","SU_TEL":"18334276943","SU_USERNAME":"梁仕城"}
                    {field: 'SU_USERNAME', title: '姓名',width:'30%'},
                    {field: 'SU_ACCOUNT', title: '手机号',width:'33%'},
                    {field: 'SU_FLAGONLINE', title: '是否在线',width:'30%'}
                ]]
            });
            $("#xs_pkdc_task_dg").datagrid("getPager").pagination({displayMsg:""});
            $('#xs_pkdc_task_dg').datagrid('clientPaging');
        }else{
            XS.CommonUtil.showMsgDialog("","该区域没有责任人");
        }
    },function(e){$("#xs_pkdc_task_loading").css({visibility:"hidden"});});
}

var xs_pkdc_task_rdata = null;
/**
 * 点击任务监控人数据行事件处理
 * @param index
 * @param data
 */
XS.Main.Pkjc.onTaskRowSelecte = function (index, data){
    XS.Main.Pkjc.minInfoWinDialog();
    xs_pkdc_task_rdata = data;
}

//轨迹查询
XS.Main.Pkjc.task_queryLine = function(){
    if(xs_pkdc_task_rdata == null){
        XS.CommonUtil.showMsgDialog("","请选择责任人");
        return;
    }
    //$('#dd').datebox('getValue');
    var sdate = $("#xs_pkdc_task_ds").datebox('getValue');
    if(XS.StrUtil.isEmpty(sdate)){
        XS.CommonUtil.showMsgDialog("","请选择开始日期");
        return;
    }
    var ddate = $("#xs_pkdc_task_dd").datebox('getValue');
    if(XS.StrUtil.isEmpty(ddate)){
        XS.CommonUtil.showMsgDialog("","请选择终止日期");
        return;
    }
    //轨迹查询
    XS.Main.clearMap();
    XS.Main.clearMarker();
    $("#xs_pkdc_task_loading").css({"visibility":"visible"});
    //string workid,string begintime,string endtime
    var data = {workid: xs_pkdc_task_rdata.SU_ACCOUNT, begintime:sdate, endtime:ddate};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryRealStrailByIdtime", data, function (json) {
        $("#xs_pkdc_task_loading").css({"visibility":"hidden"});
        var p_style = {
            externalGraphic:"../img/icon/xs_main_marker.png",
            allowRotate:true,
            graphicWidth:16,
            graphicHeight:12
        }
        //xs_walking.png
        var a_style = {
            /* externalGraphic:"../img/icon/marker.png",
             allowRotate:false,
             graphicWidth:43,
             graphicHeight:33*/
            fillColor: "#ff0000",
            fillOpacity: 1,
            strokeOpacity: 0,
            pointRadius: 13
        };
        if(json && json.length>0)
        {
            var pArr = [];
            var a_features = [];
            var p_features = [];

            for(var i=0; i<json.length;i++)
            {
                var obj = json[i];
                var p_point = new SuperMap.Geometry.Point(obj.LONGITUDE, obj.LATITUDE);
                pArr.push(p_point);
                //p_point.style = p_style;

                var p_feature = new SuperMap.Feature.Vector(p_point);
                p_feature.style = p_style;
                if(i==0){
                    p_feature.style = {
                        externalGraphic:"../img/icon/xs_start.png",
                        graphicWidth:32,
                        graphicHeight:32
                    }
                }else if(i==json.length-1){
                    p_feature.style = {
                        externalGraphic:"../img/icon/xs_end.png",
                        graphicWidth:32,
                        graphicHeight:32
                    }
                }else{
                    p_feature.style = p_style;
                }
                p_feature.info = obj;
                //标注点类型
                p_feature.info.xt_ctype = XS.Main.ClusterPointerStyle.pkdc_tasker;
                p_features.push(p_feature);

                var a_point = new SuperMap.Geometry.Point(obj.LONGITUDE, obj.LATITUDE);
                var a_feature = new SuperMap.Feature.Vector(a_point,
                    {
                        FEATUREID:0,
                        //根据节点生成时间
                        TIME:i
                    },a_style
                );
                a_features.push(a_feature);
            }
            XS.LogUtil.log("ZoomLevels="+xs_MapInstance.getMapObj().getNumZoomLevels());
            xs_MapInstance.getMapObj().setCenter(new SuperMap.LonLat(pArr[0].x, pArr[0].y), 9);

            //1.vectorlayer 画线
            XS.GeometryUtil.createLineStr(xs_vectorLayer, pArr,{
                stroke:true,
                strokeColor:"#ff0000",
                strokeWidth:2,
                strokeDashstyle:"solid"
            });
            XS.GeometryUtil.createLineStr(xs_vectorLayer, pArr,{
                stroke:true,
                strokeColor:"#efefef",
                strokeWidth:1,
                strokeDashstyle:"dash"
            });

            //2.添加聚散点
            XS.Main.addVectorPoint2ClusterLayer(p_features, XS.Main.ClusterPointerStyle.pkdc_tasker);

            //3.添加动画layer
            if(xs_animatorVectorLayer != null){
                xs_MapInstance.getMapObj().removeLayer(xs_animatorVectorLayer);
                xs_animatorVectorLayer = null;
            }
            xs_animatorVectorLayer = new SuperMap.Layer.AnimatorVector("persons", {rendererType:"TadpolePoint"},{
                //设置速度为每帧播放0.05小时的数据
                speed:0.005,
                //开始时间为0晨
                startTime:0,
               /* frameRate:12,*/
                //结束时间设置为最后运行结束的汽车结束时间
                endTime:json.length-1
            });
            xs_MapInstance.getMapObj().addLayer(xs_animatorVectorLayer);
            xs_MapInstance.getMapObj().setLayerIndex(xs_animatorVectorLayer, xs_MapInstance.getMapObj().getLayerIndex(xs_clusterLayer));
            xs_animatorVectorLayer.removeFeatures();

            xs_animatorVectorLayer.addFeatures(a_features);
            xs_animatorVectorLayer.animator.start();
        }else{
            XS.CommonUtil.showMsgDialog("","该责任人此时间内没有移动轨迹");
        }
    },function(e){$("#xs_pkdc_task_loading").css({visibility:"hidden"});});
}


var xs_pkjc_IntervalId = null; //实时在线任务人 window.Interval ID
var xs_pkdc_tasker_isFirstReq = true; //是否首次查询
/**
 * 根据区域ID查询在线任务监督人 --动态
 * @param regionid
 */
XS.Main.Pkjc.reqOnLineTasker = function(regionid){
    clearInterval(xs_pkjc_IntervalId);
    xs_tasker_labelLayer.removeAllFeatures();
    xs_tasker_animatorVectorLayer.removeAllFeatures();

    xs_tasker_animatorVectorLayer.setVisibility(true);
    xs_tasker_labelLayer.setVisibility(true);
    XS.Main.clearMap();
    XS.Main.clearMarker();

    XS.CommonUtil.showLoader();
    var data = {regionid: regionid};
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryRealStrailBytime", data, function (json)
    {
        XS.CommonUtil.hideLoader();
        if(json && json.length>0)
        {
            //[{"__type":"HOUSE_LONG_LAT:#WcfService2","GTIME":"2016\/8\/12 15:02:54","LATITUDE":27.147510,"LONGITUDE":105.715991,"NAME":"余廷菊","WORKID":"15902597932"},
            // {"__type":"HOUSE_LONG_LAT:#WcfService2","GTIME":"2016\/8\/12 15:02:56","LATITUDE":27.320448,"LONGITUDE":106.017913,"NAME":"周龙江","WORKID":"13885735559"}]

            var geotextFeatures = [];
            var a_features = [];
            var a_style = {
                fillColor: "#ff0000",
                fillOpacity: 0.5,
                strokeOpacity: 0,
                pointRadius: 5
            };
            for(var i=0; i<json.length; i++){
                var obj = json[i];
                var geoText = new SuperMap.Geometry.GeoText(obj.LONGITUDE, obj.LATITUDE,obj.NAME);
                var geotextFeature = new SuperMap.Feature.Vector(geoText);
                geotextFeatures.push(geotextFeature);

                var a_point = new SuperMap.Geometry.Point(obj.LONGITUDE, obj.LATITUDE);
                var a_feature = new SuperMap.Feature.Vector(a_point,
                    {
                        FEATUREID:i,
                        //根据节点生成时间
                        TIME:0
                    },a_style
                );
                a_features.push(a_feature);
            }
            if(xs_pkdc_tasker_isFirstReq){
                xs_MapInstance.getMapObj().setCenter(new SuperMap.LonLat(a_features[0].geometry.x, a_features[0].geometry.y), 3);
                xs_pkdc_tasker_isFirstReq = false;
            }

            xs_tasker_labelLayer.addFeatures(geotextFeatures);

            xs_tasker_animatorVectorLayer.addFeatures(a_features);
            xs_tasker_animatorVectorLayer.animator.start();

            xs_pkjc_IntervalId = window.setInterval(function(){
                XS.LogUtil.log("regionid="+regionid);
               clearInterval(xs_pkjc_IntervalId);
                XS.Main.Pkjc.reqOnLineTasker(regionid);
            }, 1000*60*5);
        }else{
            XS.CommonUtil.showMsgDialog("","该区域暂无在线责任人");
        }
    },function(e){ XS.CommonUtil.hideLoader();});
}

//点击聚散点--查看采集人的基本信息
XS.Main.Pkjc.clickClusterCallback = function(f){
    var obj = f.info;
    var xy = XS.GeometryUtil.getPixelFromGeoXY(f.geometry.x, f.geometry.y, xs_MapInstance.getMapObj());
    var contentTag =
        '<div style="border: 2px solid transparent; box-sizing: border-box; width: 180px; height: 160px;"><table border="1" style="width: 100%; height: 100%;border: 1px solid rgba(128, 128, 128, 0.16);border-collapse: collapse;font-size: 13px;">';
    contentTag +=  '<tr><td>采集人</td><td>'+obj.NAME+'</td></tr>';
    contentTag +=  '<tr><td>手机号码</td><td>'+obj.WORKID+'</td></tr>';
    contentTag +=  '<tr><td>位置经度</td><td>'+obj.LONGITUDE+'</td></tr>';
    contentTag +=  '<tr><td>位置纬度</td><td>'+obj.LATITUDE+'</td></tr>';
    contentTag +=  '<tr><td>采集时间</td><td>'+obj.GTIME+'</td></tr>';
    contentTag += '</table></div>';

    XS.CommonUtil.openDialog("xs_main_detail_1", "采集人信息", "icon-man", contentTag, false, false, false,null, null,xy.x+15, xy.y+5);
}

//最小化信息窗口
XS.Main.Pkjc.minInfoWinDialog = function(){
}

//关闭贫困洞察Dialog
XS.Main.Pkjc.closeInfoDialog = function(){
    xs_isShowUtfGridTip = true;
    if(document.getElementById("xs_pkdc_msgWin")){
        $('#xs_pkdc_msgWin').window('close');
    }
}
