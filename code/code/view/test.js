/**
 * Created by GZXS on 2016/7/6.
 */
//http://61.159.180.162:9876/
//http://61.159.185.196:7060/Service2.svc
//市  admin  xxgcxyadmin  md5:e179f046a1191ba0a31ca43416583fe0
//县 15519362488  123456
//镇 15885861601   123456
//村 13698557885   123456
//公网访问：http://219.141.106.195:8090

//树测试
function _force_est(){
    var content = '<script src="../base/echart2/dist/echarts-all.js"></script>' +
        '<div id="xs_tree_dialog" style="width: 100%; height: 100%;"></div>';
    //XS.CommonUtil.openDialog("xs_main_detail", "任务监控", "icon-man", content, false, true, false, 350, 600,100,null,function(){
    $("#xs_echartjs").empty();
    XS.CommonUtil.openDialog("xs_test", "测试", "icon-man", content, false, false, true, 800, 500,null,null,function(){
        $("#xs_test").remove();
        $("#xs_echartjs").append('<script src="../base/echart/echarts.js"></script>');
    });

    var nodes = [];
    var links = [];
    var constMaxDepth = 2;
    var constMaxChildren = 7;
    var constMinChildren = 4;
    var constMaxRadius = 10;
    var constMinRadius = 2;
    function rangeRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    function createRandomNode(depth) {
        var node = {
            name : 'NODE_' + nodes.length,
            value : rangeRandom(constMinRadius, constMaxRadius),
            // Custom properties
            id : nodes.length,
            depth : depth,
            category : depth === constMaxDepth ? 0 : 1
        }
        nodes.push(node);
        return node;
    }
    function forceMockThreeData() {
        var depth = 0;
        var rootNode = {
            name : 'ROOT',
            value : rangeRandom(constMinRadius, constMaxRadius),
            // Custom properties
            id : 0,
            depth : 0,
            category : 2
        }
        nodes.push(rootNode);
        function mock(parentNode, depth) {
            var nChildren = Math.round(rangeRandom(constMinChildren, constMaxChildren));
            for (var i = 0; i < nChildren; i++) {
                var childNode = createRandomNode(depth);
                links.push({
                    source : parentNode.id,
                    target : childNode.id,
                    weight : 1
                });
                if (depth < constMaxDepth) {
                    mock(childNode, depth + 1);
                }
            }
        }
        mock(rootNode, 0);
    }
    forceMockThreeData();
    option = {
        title : {
            text: 'Force',
            subtext: 'Force-directed tree',
            x:'right',
            y:'bottom'
        },
        tooltip : {
            trigger: 'item',
            formatter: '{a} : {b}'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        legend: {
            x: 'left',
            data:['叶子节点','非叶子节点', '根节点']
        },
        series : [
            {
                type:'force',
                name : "Force tree",
                ribbonType: false,
                categories : [
                    {
                        name: '叶子节点'
                    },
                    {
                        name: '非叶子节点'
                    },
                    {
                        name: '根节点'
                    }
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        nodeStyle : {
                            brushType : 'both',
                            borderColor : 'rgba(255,215,0,0.6)',
                            borderWidth : 1
                        }
                    }
                },
                minRadius : constMinRadius,
                maxRadius : constMaxRadius,
                coolDown: 0.995,
                steps: 10,
                nodes : nodes,
                links : links,
                steps: 1
            }
        ]
    };
    var  echart = echarts.init(document.getElementById("xs_tree_dialog"));
    echart.setOption(option);
}

function fullScreen() {
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

function exitFullScreen() {
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
            wscript.SendKeys("{F11}");
        }
    }
}

$(function(){
    var date = strFormatToDate("yyyy-MM-dd", "2016-10-01");

    console.log(date);
});

/**
 * 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
 */
function strFormatToDate(formatStr, dateStr){
    var year = 0;
    var start = -1;
    var len = dateStr.length;
    if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
        year = dateStr.substr(start, 4);
    }
    var month = 0;
    if((start = formatStr.indexOf('MM')) > -1  && start < len){
        month = parseInt(dateStr.substr(start, 2)) - 1;
    }
    var day = 0;
    if((start = formatStr.indexOf('dd')) > -1 && start < len){
        day = parseInt(dateStr.substr(start, 2));
    }
    var hour = 0;
    if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
        hour = parseInt(dateStr.substr(start, 2));
    }
    var minute = 0;
    if((start = formatStr.indexOf('mm')) > -1  && start < len){
        minute = dateStr.substr(start, 2);
    }
    var second = 0;
    if((start = formatStr.indexOf('ss')) > -1  && start < len){
        second = dateStr.substr(start, 2);
    }
    return new Date(year, month, day, hour, minute, second);
}
//getTime