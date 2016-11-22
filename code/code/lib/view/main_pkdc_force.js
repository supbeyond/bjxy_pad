/**
 * Created by GZXS on 2016/7/19.
 */

var xs_pkdc_itemFoundForceOpt = {
    title : {
        text: '',
        x:'center',
        y:20
    },
    tooltip : {
        trigger: 'item',
        formatter: null//'{b} : {c}'
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
        y:'bottom',
        data:[]
    },
    series : [
        {
            type:'force',
            name : "Force tree",
            ribbonType: false,
            categories : [],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    nodeStyle : {
                        //brushType : 'both',
                        borderColor : 'rgba(255,215,0,0.6)',
                        borderWidth : 1
                    }
                }
            },
            minRadius : 5,
            maxRadius : 10,
            coolDown: 0.995,
            steps: 1,
            nodes : [],
            links : []
        }
    ]
};

var xs_pkdc_itemFoundFNodes = [];
var xs_pkdc_itemFoundFLinks = [];
var xs_pkdc_itemFoundFMaxDepth = -1;
var xs_pkdc_itemFoundFJsonData = [[],[],[],[]];
var xs_pkdc_itemFoundFJsonData_update = [[],[],[],[]];
var xs_pkdc_itemFoundFIndex = -1;
var xs_pkdc_itemFoundFRegion = xs_pkdc_currentStateCode;
var xs_pkdc_itemFoundChart = null;

/**
 * 双击项目资金的行数据展示该项目的层级关系
 * @param rowIndex 行编号
 * @param rowData 行数据
 */
 XS.Main.Pkjc.selectItemFoundRowData = function(rowIndex,rowData){
     xs_pkdc_itemFoundChart = null;
     xs_pkdc_itemFoundClickRow = rowData;
     //$("#xs_pkdc_detailDialog").dialog("close");
     var projectName = rowData.PROJECTNAME;
     xs_pkdc_itemFoundFJsonData = [[],[],[],[]];
     xs_pkdc_itemFoundFJsonData_update = [[],[],[],[]];
    var data = {regionid: xs_pkdc_currentStateCode};
     $("#xs_pkdc_itemFound_rowLoading").css({"visibility":"visible"});
     XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryProjecFundByRegionidLike", data, function(json){
         if(json && json.length > 0){
             for(var i=0;i<json.length;i++){
                 if(json[i].FOUNDNUM == rowData.FOUNDNUM){
                    if(json[i].REGIONID.length == 4){
                        xs_pkdc_itemFoundFJsonData[0].push(json[i]);
                        xs_pkdc_itemFoundFJsonData_update[0].push(json[i]);
                    }else if(json[i].REGIONID.length == 6){
                        xs_pkdc_itemFoundFJsonData[1].push(json[i]);
                        xs_pkdc_itemFoundFJsonData_update[1].push(json[i]);
                    }else if(json[i].REGIONID.length == 9){
                        xs_pkdc_itemFoundFJsonData[2].push(json[i]);
                        xs_pkdc_itemFoundFJsonData_update[2].push(json[i]);
                    }else if(json[i].REGIONID.length == 11 || json[i].REGIONID.length == 12){
                        xs_pkdc_itemFoundFJsonData[3].push(json[i]);
                        xs_pkdc_itemFoundFJsonData_update[3].push(json[i]);
                    }
                 }
             }

             for(var i in xs_pkdc_itemFoundFJsonData_update){
                 for(var j=0;j<xs_pkdc_itemFoundFJsonData_update[i].length;j++){
                     xs_pkdc_itemFoundFJsonData_update[i][j].FINAFOUND_UPDATE = xs_pkdc_itemFoundFJsonData_update[i][j].FINAFOUND;
                     for(var k=j+1;k<xs_pkdc_itemFoundFJsonData_update[i].length;k++){
                         if(xs_pkdc_itemFoundFJsonData_update[i][j].REGIONID == xs_pkdc_itemFoundFJsonData_update[i][k].REGIONID){
                             xs_pkdc_itemFoundFJsonData_update[i][k].FINAFOUND_UPDATE = xs_pkdc_itemFoundFJsonData_update[i][k].FINAFOUND;
                             xs_pkdc_itemFoundFJsonData_update[i][j].FINAFOUND_UPDATE = xs_pkdc_itemFoundFJsonData_update[i][j].FINAFOUND_UPDATE + xs_pkdc_itemFoundFJsonData_update[i][k].FINAFOUND_UPDATE;
                             xs_pkdc_itemFoundFJsonData_update[i].splice(k,1);
                             k--;
                         }
                     }
                 }
             }

             var legend = [];
             if(xs_pkdc_itemFoundFJsonData_update[0].length == 1){
                 xs_pkdc_itemFoundFIndex = 0;
                 legend = ["市","县","镇","村"];
             }else if(xs_pkdc_itemFoundFJsonData_update[1].length == 1){
                 xs_pkdc_itemFoundFIndex = 1;
                 legend = ["县","镇","村"];
             }else if(xs_pkdc_itemFoundFJsonData_update[2].length == 1){
                 xs_pkdc_itemFoundFIndex = 2;
                 legend = ["镇","村"];
             }else if(xs_pkdc_itemFoundFJsonData_update[3].length == 1){
                 xs_pkdc_itemFoundFIndex = 3;
                 legend = ["村"];
             }else{
                 XS.CommonUtil.showMsgDialog("","该项目存在多个根目录");
                 return;
             }
             XS.Main.Pkjc.itemFoundNodesCreate(xs_pkdc_itemFoundFIndex);
             xs_pkdc_itemFoundForceOpt.title.text = projectName;

             xs_pkdc_itemFoundForceOpt.tooltip.formatter = function(params){
                 var region_id = params.data.region_id;
                 var tipStr = "";
                 if(region_id){
                     var tipProjectName = params.data.name;
                     var index = params.data.depth + xs_pkdc_itemFoundFIndex;
                     tipStr = tipProjectName + '<br/><hr border="1" color="gray"/>';
                     for(var i in xs_pkdc_itemFoundFJsonData[index]){
                         if(xs_pkdc_itemFoundFJsonData[index][i].REGIONID == region_id) {
                             tipStr += xs_pkdc_itemFoundFJsonData[index][i].PROJECTNAME + ": ";
                             tipStr += xs_pkdc_itemFoundFJsonData[index][i].FINAFOUND + "<br/>";
                         }
                     }
                 }else if(params.data.target){
                     tipStr = params.name + ": " + params.data.value;
                 }
                 return tipStr;
             }

             xs_pkdc_itemFoundForceOpt.legend.data = [];
             xs_pkdc_itemFoundForceOpt.series[0].categories = [];

                    switch (xs_pkdc_itemFoundFMaxDepth){
                        case 0:
                            legend = [legend[0]];
                            break;
                        case 1:
                            legend = [legend[0],legend[1]];
                            break;
                        case 2:
                            legend = [legend[0],legend[1],legend[2]];
                            break;
                        case 3:
                            legend = legend;
                            break;
                    }
                     xs_pkdc_itemFoundForceOpt.legend.data = legend;
                     for(var i in legend){
                         xs_pkdc_itemFoundForceOpt.series[0].categories.push({name:legend[i]});
                     }

             xs_pkdc_itemFoundForceOpt.series[0].nodes = xs_pkdc_itemFoundFNodes;
             xs_pkdc_itemFoundForceOpt.series[0].links = xs_pkdc_itemFoundFLinks;

             xs_pkdc_itemFoundChart = echarts.init(document.getElementById("xs_pkdc_itemFundRowDataTree"));
             xs_pkdc_itemFoundChart.setOption(xs_pkdc_itemFoundForceOpt);
             $("#xs_pkdc_itemFound_rowLoading").css({"visibility":"hidden"});

            //资金流节点  点击事件
             xs_pkdc_itemFoundChart.on("click",function(params){
                 if(params.data.target)return;
                 //$("#xs_pkdc_detailDialog").dialog("close");
                 var content = '<div style="height: 100%;padding: 5px;box-sizing: border-box;width: 1000px;">' +
                     '<div style="height: 100%; width: 900px;">' +
                         '<div id="xs_pkdc_itemFundTree_click" style="height: 100%;"></div>' +
                         '</div>' +
                     '</div>' +
                 '</div>';

                 XS.CommonUtil.openDialog("xs_main_itemFoundNode", params.name + "-" + projectName, "icon-man", content, true, false, false, 500, 300,null,null,function(){
                     //$("#xs_pkdc_itemFundRowDataWin").dialog("open");
                 });
                 XS.Main.addDivHover2HiddenUTFGridTip("xs_main_itemFoundNode");

                 var nodeDataArr = [];
                 var index = params.data.depth + xs_pkdc_itemFoundFIndex;
                 var num = 0;
                 for(var i in xs_pkdc_itemFoundFJsonData[index]){
                     if(xs_pkdc_itemFoundFJsonData[index][i].REGIONID == params.data.region_id){
                         xs_pkdc_itemFoundFJsonData[index][i].serialNo = num
                         nodeDataArr.push(xs_pkdc_itemFoundFJsonData[index][i]);
                         num ++;
                     }
                 }

                 $('#xs_pkdc_itemFundTree_click').datagrid({
                     data: nodeDataArr,
                     fit: true,
                     striped: true,
                     singleSelect: false,
                     rownumbers: false,
                     rowStyler: function(rowIndex,rowData){
                         return 'height:40px;';
                     },
                     columns: XS.Main.Pkjc.itemFundGridColumns(xs_pkdc_itemFundGridField,'7%',[[0,'4%'],[4,'4%'],[9,'8%'],[10,'9%']])
                 });
             });
         }else{
             $("#xs_pkdc_itemFound_rowLoading").css({"visibility":"hidden"});
             XS.CommonUtil.showMsgDialog("", "获取数据失败！");
         }
     });
 }
/**
 * 创建节点
 * @param depth 力向导图的层级
 * @param i
 * @returns {{name: *, value: number, id: *, depth: *, category: *}}
 */
XS.Main.Pkjc.itemFoundNodeCreate = function (index,i) {
    var name = "";
    switch (index){
        case 0:
        case 1:
            name = xs_pkdc_itemFoundFJsonData_update[index][i].COUNTY;
            break;
        case 2:
            name = xs_pkdc_itemFoundFJsonData_update[index][i].TOWN;
            break;
        case 3:
            name = xs_pkdc_itemFoundFJsonData_update[index][i].VILL;
    }
    xs_pkdc_itemFoundFRegion =xs_pkdc_itemFoundFJsonData_update[index][i].REGIONID;
    var node = {
        name : name,
        value : xs_pkdc_itemFoundFJsonData_update[index][i].FINAFOUND_UPDATE,
        // Custom properties
        id : xs_pkdc_itemFoundFNodes.length,
        depth : index - xs_pkdc_itemFoundFIndex,
        category : index - xs_pkdc_itemFoundFIndex,
        region_id:xs_pkdc_itemFoundFRegion
    }
    xs_pkdc_itemFoundFNodes.push(node);
    return node;
}
/**
 * 创建所有的节点
 * @param index
 * @param name
 */
XS.Main.Pkjc.itemFoundNodesCreate = function (index) {
    xs_pkdc_itemFoundFLinks = [];
    xs_pkdc_itemFoundFNodes = [];
    xs_pkdc_itemFoundFRegion = xs_pkdc_currentStateCode;
    xs_pkdc_itemFoundFMaxDepth = 0;
    var rootNode = XS.Main.Pkjc.itemFoundNodeCreate(index,0);
    XS.Main.Pkjc.itemFoundMock(rootNode, index + 1);
}
/**
 *
 * @param parentNode
 * @param depth
 */
XS.Main.Pkjc.itemFoundMock = function (parentNode, index) {
    var nChildren = [];
    var currentDepthDigit = xs_pkdc_itemFoundFRegion.toString().length;
    for(var i in xs_pkdc_itemFoundFJsonData_update[index]){
        if(xs_pkdc_itemFoundFJsonData_update[index][i].REGIONID.substr(0,currentDepthDigit) == xs_pkdc_itemFoundFRegion){
            nChildren.push(i);
        }
    }
    if(nChildren.length == 0){
        return;
    }
    if(index - xs_pkdc_itemFoundFIndex > xs_pkdc_itemFoundFMaxDepth){
        xs_pkdc_itemFoundFMaxDepth = index - xs_pkdc_itemFoundFIndex;
    }
    for (var i = 0; i < nChildren.length; i++) {
        var childNode = XS.Main.Pkjc.itemFoundNodeCreate(index,nChildren[i]);
        xs_pkdc_itemFoundFLinks.push({
            source : parentNode.id,
            target : childNode.id,
            weight : 1,
            value:parentNode.value + " - " + childNode.value
        });
        XS.Main.Pkjc.itemFoundMock(childNode, index + 1);
    }
}