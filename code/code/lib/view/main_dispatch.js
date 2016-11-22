/**
 * 调度指挥
 * Created by GZXS on 2016/10/12.
 */
XS.Main.Dispatchcmmd = {};

XS.Main.Dispatchcmmd.tasker = {
    level:
        [
            {name:"特急", icon:"../img/tasker/xs_priority_1.png"},
            {name:"紧急", icon:"../img/tasker/xs_priority_2.png"},
            {name:"一般", icon:"../img/tasker/xs_priority_3.png"},
            {name:"不急", icon:"../img/tasker/xs_priority_4.png"}
        ],
    progress:
        [
            {name:"暂停", icon:"../img/tasker/xs_progress_pause.png"},
            {name:"开始", icon:"../img/tasker/xs_progress_0.png"},
            {name:"1/8", icon:"../img/tasker/xs_progress_1.png"},
            {name:"1/4", icon:"../img/tasker/xs_progress_2.png"},
            {name:"3/8", icon:"../img/tasker/xs_progress_3.png"},
            {name:"1/2", icon:"../img/tasker/xs_progress_4.png"},
            {name:"5/8", icon:"../img/tasker/xs_progress_5.png"},
            {name:"3/4", icon:"../img/tasker/xs_progress_6.png"},
            {name:"7/8", icon:"../img/tasker/xs_progress_7.png"},
            {name:"完成", icon:"../img/tasker/xs_progress_8.png"}
        ]
};

/**
 * 调度指挥
 */
XS.Main.Dispatchcmmd.dispatchCommd = function(){
    XS.Main.Dispatchcmmd.dispatchCommd_send("毕节市", null);
}

/**
 * 调度指挥发送指令
 * @param receiver
 * @param receiverID
 */
var xs_dispatch_state = 1; //记录任务的状态 0表示修改 1表添加
XS.Main.Dispatchcmmd.dispatchCommd_send = function(receiver, receiverID){
    XS.Main.Pkjc.closeInfoDialog();
    XS.Main.Poor.clearRelocationLayer();
    XS.Main.clearMap();
    xs_dispatch_state = 1;
    var content = '<div id="xs_dc_tab" class="easyui-tabs" style="width:410px; height: 530px;box-sizing: border-box;">'+
        '<i id="xs_dc_loading" style="position: absolute;top: 50%; left: 50%;margin-left: -25px;margin-top: 80px;z-index:5; visibility: hidden;" class="fa fa-spinner fa-pulse fa-3x fa-fw xs_loading"></i>'+
        '</div>';

    XS.CommonUtil.openDialog("xs_main_detail", "调度指挥", "icon-man", content, false, false, false,null, null,0);
    XS.Main.addDivHover2HiddenUTFGridTip("xs_main_detail");

    var tag_sender =
        '<div id="xs_dc_tab_sender" style="padding: 5px; height: 100%; box-sizing: border-box;">'+
        '<table cellpadding="4" bordercolor="#DBDBDB" border="1" style="border-collapse: collapse;width: 100%; height: 100%;font-size: 13px;">' +
            '<tr>' +
                '<td style="width: 60px;">发送者</td>' +
                '<td><input id="xs_dcs_sender" style="width: 100%; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>' +
                '<td>发送者ID</td>' +
                '<td><input id="xs_dcs_senderid" style="width: 100%; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>'+
            '</tr>'+
            '<tr>' +
                '<td>接收者</td>' +
                '<td><input id="xs_dcs_receiver" style="width: 100%; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>' +
                '<td>任务ID</td>' +
                '<td><input id="xs_dcs_taskid" style="width: 100%; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>'+
            '</tr>'+
            '<tr>' +
                '<td>名称</td>' +
                '<td><input id="xs_dcs_name" style="width: 100%;height: 50px;" class="easyui-textbox" type="text" data-options="multiline:true"/></td>' +
                '<td>类型</td>' +
                '<td >' +
                    '<select id="xs_dcs_type" style="height: 30px;width: 100%;" class="easyui-combobox">'+
                    '<option value="1">资金</option>' +
                    '<option value="2">项目</option>' +
                    '<option value="0">其他</option>' +
                    '</select>'+
                '</td>' +
            '</tr>'+
            '<tr>' +
                '<td>开始时间</td>' +
                '<td ><input id="xs_dcs_ds" style="width: 125px;height: 25px;" class="easyui-datetimebox" data-options=""/></td>' +
                '<td>结束时间</td>' +
                '<td ><input id="xs_dcs_dd" style="width: 125px;height: 25px;" class="easyui-datetimebox" data-options=""/></td>' +
            '</tr>'+
            '<tr>' +
                '<td>发送时间</td>' +
                '<td ><input id="xs_dcs_dsender" style="width: 125px;height: 25px;" class="easyui-textbox" data-options="multiline:true"/></td>' +
                '<td>完成时间</td>' +
                '<td ><input id="xs_dcs_dfinish" style="width: 125px;height: 25px;" class="easyui-datetimebox" data-options=""/></td>' +
            '</tr>'+
            '<tr>' +
                '<td>内容</td>' +
                '<td colspan="3"><input id="xs_dcs_content" style="height:200px;width: 100%;" class="easyui-textbox" name="message" data-options="multiline:true"/></td>' +
            '</tr>'+
            '<tr>' +
                '<td colspan="3">' +
                    '<span>紧急度:</span>'+
                        '<select id="xs_dcs_level" style="height: 25px;width: 60px;" class="easyui-combobox">' +
                        '<option value="1">特急</option>' +
                        '<option value="2">紧急</option>' +
                        '<option value="3">一般</option>' +
                        '<option value="4">不急</option>' +
                        '</select>'+
                    '<span style="margin-left: 5px;">进度:</span>'+
                    '<select id="xs_dcs_progress" style="height: 25px;width: 80px;" class="easyui-combobox">' +
                        '<option value="-2">未开始</option>' +
                        '<option value="-1">暂停</option>' +
                        '<option value="0">开始</option>' +
                        '<option value="1">1/8</option>' +
                        '<option value="2">1/4</option>' +
                        '<option value="3">3/8</option>' +
                        '<option value="4">1/2</option>' +
                        '<option value="5">5/8</option>' +
                        '<option value="6">3/4</option>' +
                        '<option value="7">7/8</option>' +
                        '<option value="8">完成</option>' +
                    '</select>'+
                '</td>' +
                '<td  style="text-align: center;">' +
                    '<a id="xs_dcs_btn_send" style="display: inline-block;" class="easyui-linkbutton"><span style="width:50px; height: 25px; text-align: center;line-height: 25px;font-size: 15px;font-weight: bold; display: inline-block;">发送</span></a>' +
                    '<a id="xs_dcs_btn_clear" style="display: inline-block;margin-left: 5px;" class="easyui-linkbutton"><span style="width:50px; height: 25px; text-align: center;line-height: 25px;font-size: 15px;font-weight: bold; display: inline-block;">清空</span></a>' +
                '</td>' +
        '</tr>'+
        '</table>'+
        '</div>';

    var tag_list =
        '<div id="xs_dc_tab_list" style="padding: 5px; height: 100%; box-sizing: border-box;">'+
        '<table cellpadding="2" bordercolor="#DBDBDB" border="1" style="border-collapse: collapse;width: 100%; height: 190px;font-size: 13px;">' +
        '<tr>' +
        '<td>接收者</td>' +
        '<td colspan="2"><input id="xs_dcl_receiver" style="width: 80%; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>' +
        '<td style="text-align: center;"><a id="xs_dcl_btn_search" class="easyui-linkbutton"><span style="width:50px; height: 25px; text-align: center;line-height: 25px;font-size: 15px;font-weight: bold; display: inline-block;">查询</span></a></td>'+
        '</tr>'+
        '<tr>' +
        '<td>发送者</td>' +
        '<td><input id="xs_dcl_sender" style="width: 125px; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>' +
        '<td>发送者ID</td>' +
        '<td><input id="xs_dcl_senderid" style="width: 125px; height: 25px;" class="easyui-textbox" type="text" data-options="multiline:true" value=""/></td>' +
        '</tr>'+
        '<tr>' +
        '<td>名称</td>' +
        '<td><input id="xs_dcl_name" style="width: 125px;height: 30px;" class="easyui-textbox" type="text" data-options="multiline:true"/></td>' +
        '<td>任务ID</td>' +
        '<td><input id="xs_dcl_taskid" style="width: 125px;height: 30px;" class="easyui-textbox" type="text" data-options="multiline:true"/></td>' +
        '</tr>'+
        '<tr>' +
        '<td>开始时间</td>' +
        '<td ><input id="xs_dcl_ds" style="width: 120px;height: 25px;" class="easyui-datebox" data-options="formatter:XS.CommonUtil.dateFormatter,parser:XS.CommonUtil.dateParser"/></td>' +
        '<td>结束时间</td>' +
        '<td ><input id="xs_dcl_dd" style="width: 120px;height: 25px;" class="easyui-datebox" data-options="formatter:XS.CommonUtil.dateFormatter,parser:XS.CommonUtil.dateParser"/></td>' +
        '</tr>'+
        '<tr>' +
        '<td>发送时间</td>' +
        '<td ><input id="xs_dcl_dsender" style="width: 120px;height: 25px;" class="easyui-datebox" data-options="formatter:XS.CommonUtil.dateFormatter,parser:XS.CommonUtil.dateParser"/></td>' +
        '<td>完成时间</td>' +
        '<td ><input id="xs_dcl_dfinish" style="width: 120px;height: 25px;" class="easyui-datebox" data-options="formatter:XS.CommonUtil.dateFormatter,parser:XS.CommonUtil.dateParser"/></td>' +
        '</tr>'+
        '<tr>' +
        '<td>紧急度</td>' +
        '<td>' +
        '<select id="xs_dcl_level" style="height: 25px;width: 120px;" class="easyui-combobox">' +
        '<option value="-1">--选择--</option>' +
        '<option value="1">特急</option>' +
        '<option value="2">紧急</option>' +
        '<option value="3">一般</option>' +
        '<option value="4">不急</option>' +
        '</select>'+
        '</td>' +
        '<td>进度</td>' +
        '<td>'+
        '<select id="xs_dcl_progress" style="height: 25px;width: 120px;" class="easyui-combobox">' +
        '<option value="-3">--选择--</option>' +
        '<option value="-2">未开始</option>' +
        '<option value="-1">暂停</option>' +
        '<option value="0">开始</option>' +
        '<option value="1">1/8</option>' +
        '<option value="2">1/4</option>' +
        '<option value="3">3/8</option>' +
        '<option value="4">1/2</option>' +
        '<option value="5">5/8</option>' +
        '<option value="6">3/4</option>' +
        '<option value="7">7/8</option>' +
        '<option value="8">完成</option>' +
        '</select>'+
        '</td>' +
        '</tr>'+
        '<tr>'+
        '<tr>'+
        '<td colspan="4">'+
        '<div id="xs_dcl_dgC" style="width: 100%;height: 295px;box-sizing: border-box;margin-top: 2px;"></div>'+
        '</td>'+
        '</table>'+
        '</div>';

    $('#xs_dc_tab').tabs('add',{
        title:'发送任务',
        content:tag_sender
    });
    $('#xs_dc_tab').tabs('add',{
        title:'任务清单',
        content:tag_list
    });
    //-----------------------------------------------------------

    $("#xs_dcs_ds").datetimebox({showSeconds:false});
    $("#xs_dcs_dd").datetimebox({showSeconds:false});

    $("#xs_dcs_dsender").textbox("disable");
    $("#xs_dcs_dfinish").datetimebox({showSeconds:false});

    $("#xs_dcs_sender").textbox({
        'disabled':true,
        'value':xs_Username
    });
    $("#xs_dcs_senderid").textbox({
        'disabled':true,
        'value':xs_user_regionId
    });
    $("#xs_dcs_receiver").textbox({
        'disabled':true
    });
    $("#xs_dcs_taskid").textbox({
        'disabled':true
    });
    //
    $("#xs_dcs_name").textbox();
    $("#xs_dcs_type").textbox();
    $("#xs_dcs_level").combobox({
        'panelHeight':85
    });
    $("#xs_dcs_type").combobox({
        'panelHeight':85
    });
    $("#xs_dcs_progress").combobox();

    //发送信息
    $("#xs_dcs_btn_send").linkbutton({'onClick':function()
        {
            //为空判断
            var taskid = $("#xs_dcs_taskid").textbox('getValue');
            var taskname = $("#xs_dcs_name").textbox('getValue');

            var sendername = $("#xs_dcs_sender").textbox('getValue');
            var senderid = $("#xs_dcs_senderid").textbox('getValue');

            var acceptid = xs_currentZoneCode;
            var acceptname = $("#xs_dcs_receiver").textbox('getValue');

            var tasktype = $("#xs_dcs_type").textbox('getValue');

            var begindate = $("#xs_dcs_ds").textbox('getValue');
            var enddate = $("#xs_dcs_dd").textbox('getValue');

            var complete = $("#xs_dcs_progress").combobox('getValue') //完成度

            var gdate = $("#xs_dcs_dsender").textbox('getValue'); //录入日期
            var competedate = $("#xs_dcs_dfinish").textbox('getValue'); //完成时间

            var content = $("#xs_dcs_content").textbox('getValue'); //内容

            var importent = $("#xs_dcs_level").combobox('getValue'); //紧急度
            var IsNew = xs_dispatch_state; //0表示修改 1表修改

            //-----------------------------------------
            if(xs_dispatch_state==1){ //添加
                gdate = XS.DateUtil.getCurTime2Min();
                taskid = new Date().getTime();
            }

            var action = "";
            if(xs_dispatch_state==1)
            {
                action = "AddTbTask";
                if(XS.StrUtil.isEmpty(taskname)){
                    XS.CommonUtil.showMsgDialog("","任务名称必填");
                    return;
                }
                if(XS.StrUtil.isEmpty(content)){
                    XS.CommonUtil.showMsgDialog("","任务内容必填");
                    return;
                }
                if(XS.StrUtil.isEmpty(acceptid)||XS.StrUtil.isEmpty(acceptname)){
                    XS.CommonUtil.showMsgDialog("","接收者必填");
                    return;
                }
                if(XS.StrUtil.isEmpty(begindate)){
                    XS.CommonUtil.showMsgDialog("","开始时间必填");
                    return;
                }
                if(XS.StrUtil.isEmpty(enddate)){
                    XS.CommonUtil.showMsgDialog("","结束时间必填");
                    return;
                }
                if(XS.StrUtil.isEmpty(enddate)){
                    XS.CommonUtil.showMsgDialog("","结束时间必填");
                    return;
                }
                if(XS.StrUtil.isEmpty(competedate)){
                    XS.CommonUtil.showMsgDialog("","完成时间必填");
                    return;
                }

                //发送消息
                var data = {
                    taskid:taskid,
                    taskname:taskname,
                    content:content,
                    tasktype:tasktype,
                    sendername:sendername,
                    senderid:senderid,
                    acceptid:acceptid,
                    acceptname:acceptname,
                    begindate:begindate,
                    enddate:enddate,
                    complete:complete,
                    gdate:gdate,
                    competedate:competedate,
                    importent:importent,
                    IsNew:1
                };
            }else
            {
                action = "ModifyTbTask";
                var data = {
                    taskid:taskid,
                    complete:complete,
                    IsNew:0
                };
            }
            $("#xs_dc_loading").css({"visibility":"visible"});
            XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, action, data, function (json) {
                $("#xs_dc_loading").css({"visibility":"hidden"});
                if(json)
                {
                    if(xs_dispatch_state==0){
                        XS.CommonUtil.showMsgDialog("","修改成功");
                        XS.Main.Dispatchcmmd.search();
                    }else{
                        XS.CommonUtil.showMsgDialog("","发送成功");
                    }

                    XS.Main.Dispatchcmmd.clearSearchTab();
                    $("#xs_dcl_name").textbox('setValue',taskname);
                    $("#xs_dcl_taskid").textbox('setValue',taskid);
                   /* $("#xs_dcl_ds").textbox('setValue',begindate.replace(new RegExp("/","gm"),"-"));
                    $("#xs_dcl_dd").textbox('setValue',enddate.replace(new RegExp("/","gm"),"-"));*/

                    $('#xs_dc_tab').tabs("select",1);

                    XS.Main.Dispatchcmmd.search();
                }else{
                    XS.CommonUtil.showMsgDialog("","发送失败");
                }
            },function(e){$("#xs_dc_loading").css({visibility:"hidden"});});
        }
        });

    $("#xs_dcs_btn_clear").linkbutton({"onClick":function(){
        XS.Main.Dispatchcmmd.clearSenderTab();
    }});
    $("#xs_dcs_receiver").textbox('setValue', xs_currentZoneName);

    //-----------------------------------------------------------------------------------------------
    $("#xs_dcl_dsender").datebox();
    $("#xs_dcl_dfinish").datebox();
    $("#xs_dcl_ds").datebox();
    $("#xs_dcl_dd").datebox();

    $("#xs_dcl_sender").textbox();
    $("#xs_dcl_senderid").textbox();

    $("#xs_dcl_receiver").textbox({
        'disabled':true
    });
    $("#xs_dcl_name").textbox();
    $("#xs_dcl_taskid").textbox();

    $("#xs_dcl_level").combobox({
        'panelHeight':105
    });
    $("#xs_dcl_progress").combobox();
    $("#xs_dcl_btn_search").linkbutton({
        'onClick': function ()
        {
            XS.Main.Dispatchcmmd.search();
        }
    });

    $("#xs_dcl_receiver").textbox('setValue', xs_currentZoneName);

   $('#xs_dc_tab').tabs("select",0);
}

//任务查询
var xs_dispatch_selectedData = null;
XS.Main.Dispatchcmmd.search = function(){

    xs_dispatch_selectedData = null;

    var taskname = $("#xs_dcl_name").textbox('getValue');
    var taskid = $("#xs_dcl_taskid").textbox('getValue');

    var sendname = $("#xs_dcl_sender").textbox('getValue');
    var sendid = $("#xs_dcl_senderid").textbox('getValue');

    var acceptid = xs_currentZoneCode;

    var begindate = $("#xs_dcl_ds").textbox('getValue');
    var enddate = $("#xs_dcl_dd").textbox('getValue');

    var complete = $("#xs_dcl_progress").combobox('getValue') //完成度

    var gdate = $("#xs_dcl_dsender").textbox('getValue'); //录入日期
    var competedate = $("#xs_dcl_dfinish").textbox('getValue'); //完成时间

    var importent = $("#xs_dcl_level").combobox('getValue'); //紧急度

    var data = {
        taskname:taskname,
        tasktid:taskid,
        sendname:sendname,
        sendid:sendid,
        acceptid:acceptid,
        begiontime:begindate,
        endtime:enddate,
        gdate:gdate,
        completetime:competedate
    };
    if(complete != '-3'){
        data.complete = complete;
    }
    if(importent != '-1'){
        data.importent = importent;
    }
    $("#xs_dcl_dgC").empty();

    $("#xs_dc_loading").css({"visibility":"visible"});
    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "QueryTbTaskByALL", data, function (json) {
        $("#xs_dc_loading").css({"visibility":"hidden"});
        if(json && json.length>0)
        {
            for(var i in json){
                var progress = parseInt(json[i].COMPLETE);
                var level = parseInt(json[i].IMPORTENT);
                if(progress==-2){
                    json[i].xs_progress_icon = '';
                }else{
                    json[i].xs_progress_icon = '<img src=\''+XS.Main.Dispatchcmmd.tasker.progress[progress+1].icon + '\'/>';
                }
                json[i].xs_level_name = XS.Main.Dispatchcmmd.tasker.level[level-1].name;
            }
            $("#xs_dcl_dgC").empty().append('<table id="xs_dcl_dg" class="easyui-datagrid" style="width:100%;height:100%;" title=""></table>');
            $('#xs_dcl_dg').datagrid({
                data: json,
                pagination: true,
                toolbar: [{
                    iconCls: 'icon-edit',
                    handler: function()
                    {  //修改进度
                        if(!xs_dispatch_selectedData){
                            XS.CommonUtil.showMsgDialog("","请先选中需要处理的数据");
                            return;
                        }
                        if(xs_dispatch_selectedData.SENDERNAME!=xs_Username||xs_dispatch_selectedData.SENDERID!=xs_user_regionId){
                            XS.CommonUtil.showMsgDialog("","你无权修改这条任务");
                            return;
                        }
                        XS.Main.Dispatchcmmd.clearSenderTab();
                        xs_dispatch_state = 0;
                        $("#xs_dcs_btn_send").linkbutton({"text":'<span style="width:50px; height: 25px; text-align: center;line-height: 25px;font-size: 15px;font-weight: bold; display: inline-block;">修改</span>'});

                        $("#xs_dcs_taskid").textbox('setValue',xs_dispatch_selectedData.TASKID);
                        $("#xs_dcs_name").textbox('setValue',xs_dispatch_selectedData.TASKNAME);


                        $("#xs_dcs_sender").textbox('setValue',xs_dispatch_selectedData.SENDERNAME);
                        $("#xs_dcs_senderid").textbox('setValue',xs_dispatch_selectedData.SENDERID);

                        $("#xs_dcs_receiver").textbox('setValue',xs_dispatch_selectedData.ACCEPTNAME);

                        $("#xs_dcs_ds").textbox('setValue',xs_dispatch_selectedData.BEGINDATE);
                        $("#xs_dcs_dd").textbox('setValue',xs_dispatch_selectedData.ENDDATE);

                        $("#xs_dcs_type").combobox('setValue',xs_dispatch_selectedData.TASKTTYPE); //任务类型

                        $("#xs_dcs_progress").combobox('setValue',xs_dispatch_selectedData.COMPLETE) //完成度

                        $("#xs_dcs_dsender").textbox('setValue',xs_dispatch_selectedData.GDATE); //录入日期
                        $("#xs_dcs_dfinish").textbox('setValue',xs_dispatch_selectedData.COMPLETEDATE); //完成时间

                        $("#xs_dcs_content").textbox('setValue',xs_dispatch_selectedData.CONTENT); //内容
                        $("#xs_dcs_level").combobox('setValue',xs_dispatch_selectedData.IMPORTENT); //紧急度

                        $("#xs_dcs_name").textbox("disable");
                        $("#xs_dcs_content").textbox("disable"); //内容
                        $("#xs_dcs_ds").datetimebox("disable");
                        $("#xs_dcs_dd").datetimebox("disable");
                        $("#xs_dcs_dfinish").datetimebox("disable"); //完成时间

                        $("#xs_dcs_level").combobox("disable"); //紧急度
                        $("#xs_dcs_type").combobox("disable");

                        $('#xs_dc_tab').tabs("select",0);
                    }
                },'-',{
                    iconCls: 'icon-remove',
                    handler: function()
                    {
                        if(!xs_dispatch_selectedData){
                            XS.CommonUtil.showMsgDialog("","请先选中需要处理的数据");
                            return;
                        }
                        //判断是否是本人
                        if(xs_dispatch_selectedData.SENDERNAME==xs_Username&&xs_dispatch_selectedData.SENDERID==xs_user_regionId){
                            $.messager.confirm('温馨提示', '你确认删除这条任务吗?', function(r){
                                if(r)
                                {
                                    $("#xs_dc_loading").css({"visibility":"visible"});
                                    var data = {
                                        taskid:xs_dispatch_selectedData.TASKID
                                    };
                                    XS.CommonUtil.ajaxHttpReq(XS.Constants.web_host, "DeleteTbTask", data, function (json) {
                                        $("#xs_dc_loading").css({"visibility":"hidden"});
                                        if(json)
                                        {
                                            XS.CommonUtil.showMsgDialog("","删除成功");
                                            XS.Main.Dispatchcmmd.search();
                                        }else{
                                            XS.CommonUtil.showMsgDialog("","删除失败");
                                        }
                                    },function(e){$("#xs_dc_loading").css({visibility:"hidden"});});
                                }
                            });
                        }else{
                            XS.CommonUtil.showMsgDialog("","你无权删除这条任务");
                        }
                    }
                },'-',{
                    iconCls: 'icon-search',
                    handler: function()
                    {
                        //查看详细内容
                        if(!xs_dispatch_selectedData){
                            XS.CommonUtil.showMsgDialog("","请先选中需要处理的数据");
                            return;
                        }
                        XS.Main.Dispatchcmmd.clearSenderTab();

                        $("#xs_dcs_btn_send").linkbutton("disable");

                        $("#xs_dcs_taskid").textbox('setValue',xs_dispatch_selectedData.TASKID);
                        $("#xs_dcs_name").textbox('setValue',xs_dispatch_selectedData.TASKNAME);

                        $("#xs_dcs_type").combobox('setValue',xs_dispatch_selectedData.TASKTTYPE);

                        $("#xs_dcs_sender").textbox('setValue',xs_dispatch_selectedData.SENDERNAME);
                        $("#xs_dcs_senderid").textbox('setValue',xs_dispatch_selectedData.SENDERID);

                        $("#xs_dcs_receiver").textbox('setValue',xs_dispatch_selectedData.ACCEPTNAME);

                        $("#xs_dcs_ds").textbox('setValue',xs_dispatch_selectedData.BEGINDATE);
                        $("#xs_dcs_dd").textbox('setValue',xs_dispatch_selectedData.ENDDATE);

                        $("#xs_dcs_progress").combobox('setValue',xs_dispatch_selectedData.COMPLETE) //完成度

                        $("#xs_dcs_dsender").textbox('setValue',xs_dispatch_selectedData.GDATE); //录入日期
                        $("#xs_dcs_dfinish").textbox('setValue',xs_dispatch_selectedData.COMPLETEDATE); //完成时间

                        $("#xs_dcs_content").textbox('setValue',xs_dispatch_selectedData.CONTENT); //内容
                        $("#xs_dcs_level").combobox('setValue',xs_dispatch_selectedData.IMPORTENT); //紧急度

                        $("#xs_dcs_name").textbox("disable");
                        $("#xs_dcs_type").combobox("disable");
                        $("#xs_dcs_content").textbox("disable"); //内容
                        $("#xs_dcs_ds").datetimebox("disable");
                        $("#xs_dcs_dd").datetimebox("disable");
                        $("#xs_dcs_dfinish").datetimebox("disable"); //完成时间
                        $("#xs_dcs_progress").combobox("disable") //完成度
                        $("#xs_dcs_level").combobox("disable"); //紧急度

                        $('#xs_dc_tab').tabs("select",0);
                    }
                }],
                pageSize: 8,
                pageList: [8,15,20],
                striped: true,
                onSelect:function(index, data){
                    xs_dispatch_selectedData = data;
                },
                singleSelect: true,
                rownumbers: true,
                /**
                 * ACCEPTID":"522401",
                 * "ACCEPTNAME":"七星关区",
                 * "ACCEPTTYPE":"",
                 * "BEGINDATE":"2016\/10\/15 19:59:00",
                 * "COMPLETE":"-2",
                 * "COMPLETEDATE":"2016\/10\/25 19:59:00",
                 * "CONTENT":"2222",
                 * "ENDDATE":"2016\/10\/15 19:59:00",
                 * "GDATE":"2016\/10\/15 19:59:00",
                 * "IMPORTENT":"1",
                 * "SENDERID":"522401",
                 * "SENDERNAME":"15286555007",
                 * "TASKID":"1476532767913",
                 * "TASKNAME":"22",
                 * "TASKTTYPE":"22"
                 */
                columns: [[
                    {field: 'SENDERNAME', title: '发送者',width:'20%'},
                    {field: 'ACCEPTNAME', title: '接收者',width:'23%'},
                   /* {field: 'BEGINDATE', title: '开始时间',width:'15%'},*/
                    {field: 'ENDDATE', title: '结束时间',width:'32%'},
                    {field: 'xs_level_name', title: '紧急度',width:'12%'},
                    {field: 'xs_progress_icon', title: '进度',width:'10%'},
                ]]
            });
            $("#xs_dcl_dg").datagrid("getPager").pagination({displayMsg:""});
            $('#xs_dcl_dg').datagrid('clientPaging');
        }else{
            XS.CommonUtil.showMsgDialog("","没有数据");
        }
    },function(e){$("#xs_dc_loading").css({visibility:"hidden"});});
}

//清空发送Tab 查询条件
XS.Main.Dispatchcmmd.clearSenderTab = function(){
    $("#xs_dcs_taskid").textbox('setValue',"");
    $("#xs_dcs_name").textbox('setValue',"");

    $("#xs_dcs_sender").textbox('setValue',xs_Username);
    $("#xs_dcs_senderid").textbox('setValue',xs_user_regionId);

    $("#xs_dcs_receiver").textbox('setValue',xs_currentZoneName);

    $("#xs_dcs_type").combobox('setValue',"1");
    $("#xs_dcs_ds").textbox('setValue',"");
    $("#xs_dcs_dd").textbox('setValue',"");
    $("#xs_dcs_progress").combobox('setValue',"-2") //完成度
    $("#xs_dcs_dsender").textbox('setValue',""); //录入日期
    $("#xs_dcs_dfinish").textbox('setValue',""); //完成时间
    $("#xs_dcs_content").textbox('setValue',""); //内容
    $("#xs_dcs_level").combobox('setValue',"1"); //紧急度

    $("#xs_dcs_name").textbox("enable");
    $("#xs_dcs_type").combobox("enable");
    $("#xs_dcs_content").textbox("enable"); //内容
    $("#xs_dcs_ds").datetimebox("enable");
    $("#xs_dcs_dd").datetimebox("enable");
    $("#xs_dcs_dfinish").datetimebox("enable"); //完成时间
    $("#xs_dcs_progress").combobox("enable") //完成度
    $("#xs_dcs_level").combobox("enable"); //紧急度

    $("#xs_dcs_btn_send").linkbutton({"text":'<span style="width:50px; height: 25px; text-align: center;line-height: 25px;font-size: 15px;font-weight: bold; display: inline-block;">发送</span>'}).linkbutton("enable");

    xs_dispatch_state = 1;
}
//清空查询Tab 查询条件

XS.Main.Dispatchcmmd.clearSearchTab = function(){
    $("#xs_dcl_name").textbox('setValue',"");
    $("#xs_dcl_taskid").textbox('setValue',"");
    $("#xs_dcl_sender").textbox('setValue',"");
    $("#xs_dcl_senderid").textbox('setValue',"");
    $("#xs_dcl_ds").textbox('setValue',"");
    $("#xs_dcl_dd").textbox('setValue',"");
    $("#xs_dcl_progress").combobox('setValue',"-3") //完成度
    $("#xs_dcl_dsender").textbox('setValue',""); //录入日期
    $("#xs_dcl_dfinish").textbox('setValue',""); //完成时间
    $("#xs_dcl_level").combobox('setValue',"-1"); //紧急度
}