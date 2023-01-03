/**
 * Created by xgh on 2019-7-4.
 */

function checkIsNotEmpty(fData) {
    return !((fData == null) || (fData == undefined) || (fData == "null") || (fData == "undefined") || (fData.length == 0) )
}

function isEmail(str){
    var reg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    return reg.test(str);
}

function checkMobile(str) {
    var reg = /^1\d{10}$/
    return reg.test(str);
}

function checkNumber(str){
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    return reg.test(str);
}

function checkPhone(str){
    var reg = /^0\d{2,3}-?\d{7,8}$/;
    return reg.test(str);
}

/**
 * 格式化金额 50000 => 50,000.00
 * @param {String,Number} num 金额 50000
 * @param {String,Number} num 保留多少位小数
 * @returns 50,000.00
 */
 function formatCurrency(num, count) {
    if (!checkIsNotEmpty(num)) {
        return num;
    }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * (count ? Math.pow(10, count) : 100) + 0.50000000001);
    cents = num % (count ? Math.pow(10, count) : 100);
    num = Math.floor(num / (count ? Math.pow(10, count) : 100)).toString();
    if (count) {
        cents = cents.toString().padStart(count, '0');
    } else {
        if (cents < 10) {
            cents = "0" + cents;
        }
    }

    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}

/**
 * 格式化时间 YYYY-MM-DD hh:mm:ss => YYYY-MM-DD
 * @param {String} v 时间 YYYY-MM-DD hh:mm:ss
 * @returns YYYY-MM-DD
 */
 function formatDate(v) {
    if (v && v.length > 10){
        return v.substring(0, 10);
    }
    return v ? v : '';
}

function formatModelDate(modelDate, key) {
    if (modelDate && modelDate.length > 0) {
        viewModel.model.set(key, formatDate(modelDate));
    }
}

function formatDateTime(v) {
    if (v.length > 19) {
        return v.substring(0, 19);
    }
    return v;
}

function formatBooleanField(fieldValue, key) {
    if (checkIsNotEmpty(fieldValue)) {
        if (fieldValue == 1) {
            viewModel.model.set(key, "是");
        }
        if (fieldValue == 0) {
            viewModel.model.set(key, "否");
        }
    }
}

function formatBooleanFieldMeaning(fieldValue) {
    if (fieldValue != null) {
        if (fieldValue == 1) {
            return "是";
        }
        if (fieldValue == 0) {
            return "否";
        }
    }
}

function formatEnum(enumArr, keyValues, key) {
    var formatValue = "";
    keyValues.forEach(function (keyValue) {
        for (i = 0; i < enumArr.length; i++) {
            if (keyValue == enumArr[i].value) {
                if (formatValue.length > 0) {
                    formatValue += ",";
                }
                formatValue += enumArr[i].meaning;
            }
        }
    });
    if (formatValue.length == 0) {
        formatValue = keyValues[0];
    }
    viewModel.model.set(key, formatValue);
}

function formatCommonEnum(enumArr, keyValues) {
    var formatValue = "";
    keyValues.forEach(function (keyValue) {
        for (i = 0; i < enumArr.length; i++) {
            if (keyValue == enumArr[i].value) {
                if (formatValue.length > 0) {
                    formatValue += ",";
                }
                formatValue += enumArr[i].meaning;
            }
        }
    });
    if (formatValue.length == 0) {
        formatValue = keyValues[0];
    }
    return formatValue;
}

function formatPrice(data, key) {
    if (checkIsNotEmpty(data)) {
        var formatData = formatCurrency(data);
//                    console.log(data+"=>"+formatData);
        viewModel.model.set(key, formatData);
    }
}

function array_contain(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == obj)//如果要求数据类型也一致，这里可使用恒等号===
            return true;
    }
    return false;
}


function dateChange(dateDayNum,date) {
    if (!date) {
        date = new Date();//没有传入值时,默认是当前日期
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
    date += " 00:00:00";//设置为当天凌晨12点
    date = Date.parse(new Date(date))/1000;//转换为时间戳
    date += (86400) * dateDayNum;//修改后的时间戳
    var newDate = new Date(parseInt(date) * 1000);//转换为时间
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
}

function setSelectText(data){
    for (let i = 0; i < data.length; i++) {
        data[i].text = data[i].meaning;
    }
    return data;
}

function filterSelect(code,deptCode){
    let  data = ajaxSync("/common/codeByDept/"+code+"/"+deptCode,"GET",{});
    return setSelectText(data);
}

function getACCList(orgCode){
    let  data = ajaxSync("/common/bankAccByOrgCode/"+orgCode,"GET",{});
    return data.rows;
}

function getProcinstByKey(data){
    return ajaxSync("/yc/common/queryActHiProcinstByKey","POST",data);;
}

function statusSelect(dataSource,match){
    var filterSource = [];
    for (let i = 0; i < dataSource.length ; i++) {
        var matchs = match.split(',');
        var flag = false;
        for (let j = 0; j < matchs.length; j++) {
            if(matchs[j] == dataSource[i].value){
                flag = true;
                break;
            }
        }
        if(flag){
            filterSource.push(dataSource[i]);
        }
    }
    if(filterSource.length == 0){
        return dataSource;
    }

    return filterSource;
}


function getDataText(value,type){
    var result = value;
    if(type=='product'){
        $.each(productOwnerDataSource,function (i,v) {
            if ((v.value || '').toLowerCase() == (result || '').toLowerCase()) {
                result=v.meaning;
                return false;
            }
        })
        return result||'';
    }
    if(type=='cost'){
        $.each(costDimensionDataSource,function (i,v) {
            if ((v.value || '').toLowerCase() == (result || '').toLowerCase()) {
                result=v.meaning;
                return false;
            }
        })
        return result||'';
    }
    if(type=='customer'){
        $.each(customerBrandDataSource,function (i,v) {
            if ((v.value || '').toLowerCase() == (result || '').toLowerCase()) {
                result=v.meaning;
                return false;
            }
        })
        return result||'';
    }
}

//如果有小数才保存两位小数，并且过滤异常数据，包括“0055”，“undefind”之类的
function toFixed(t) {
    if (checkIsNotEmpty(t)) {
        if (isNaN(Number(t))) {
            return null;
        } else {
            if (t.toString().indexOf(".") > -1) {
                return Number(t).toFixed(2);
            } else {
                return Number(t);
            }
        }
    } else {
        return null;
    }
}

function showErrorMsg(msg){
    Hap.showToast({
        type: 'error',
        message: msg
    });
}

function queryUpcoming() {
    var dto = {
        order: "desc",
        size: 999999,
        sort: "priority",
        start: 0
    };
    return ajaxSync("/wfl/query/tasks","POST",JSON.stringify(dto));
}

function jumpeal(applyNo) {
    var dto = {
        order: "desc",
        size: 999999,
        sort: "priority",
        start: 0
    };
    dto.businessKey = applyNo;
    var result = ajaxSync("/wfl/query/tasks","POST",JSON.stringify(dto));
    if(result.success){
        if (result.data.length == 0) {
            errorToast("该单据不在我代办的流程中！")
        } else {
            var row = result.data[0];
            if (window.parent.openTab) {
                window.parent.openTab("PROCESS_TASK_" + row.id, row.processName + '-' + row.startUserName, _basePath +'/activiti/task_detail.html?taskId=' + row.id + '&processInstanceId=' + row.processInstanceId, true);
            } else {
                window.top.openTab("PROCESS_TASK_" + row.id, row.processName + '-' + row.startUserName, _basePath+'/activiti/task_detail.html?taskId=' + row.id + '&processInstanceId=' + row.processInstanceId, true);
            }
        }
    }
}

function successToast(message){
    Hap.showToast({
        type: 'success',
        message: message
    });
}

function errorToast(message){
    Hap.showToast({
        type: 'error',
        message: message
    });
}

/**
 * 翻译字典内容
 * @param {String} value 需要翻译的值
 * @param {Array} data 字典数组
 * @returns 返回字典中文内容 meaning
 */
 function translate (value, data) {
    var arr = data.filter(item => value === item.value);
    return arr[0] ? arr[0].meaning : '';
  }

function translateByMeaning (meaning, data) {
    var arr = data.filter(item => meaning === item.meaning);
    return arr[0] ? arr[0].value : '';
}


function getDictObject (value, data) {
    var arr = data.filter(item => value === item.value);
    return arr[0];
}


/**
 * 格式化月份 YYYY-MM-DD hh:mm:ss => YYYYMM
 * @param {String} v 时间 YYYY-MM-DD hh:mm:ss
 * @returns YYYYMM
 */
function formatMonth(v) {
    if(v && v.length > 7) {
        var result = v.substring(0, 8)
        return result.replace(/-/g,'')
    }
    return v;
}

/**
 * 去掉字符串所有空格
 * @param {String} val
 * @return 没有空格的字符串
 */
function trimAll(val) {
    return val.replace(/\s*/g, "");
}


/**
 * 比较时间大小
 * @param {String} date1 日期1
 * @param {String} date2 日期2
 * @returns {Boolean}
*/
function compareDate(date1,date2){
    var oDate1 = new Date(date1);
    var oDate2 = new Date(date2);
    console.log(oDate1)
    if(oDate1.getTime() > oDate2.getTime()){
        return true; //第一个大
    } else {
        return false; //第二个大
    }
}

//部门选择弹框
function openSelectDept(eleId,
                        code,name,
                        singleFlag,
                        deptLevel,
                        changeFlag,
                        callback) {
    var assignDialog = $("#"+eleId).kendoWindow({
        width: 820,
        height: 600,
        title: '选择部门',
        visible: false,
        iframe: true,
        modal: true,
        actions: [
            "Minimize",
            "Maximize",
            "Close"
        ],
        resizable: false,
        content: _basePath + '/hr/unit_select.html?' +
            'codeDataStr=' + code +
            '&nameDataStr=' + name +
            '&singleFlag='+ singleFlag +
            '&deptLevel='+ deptLevel +
            '&changeFlag='+changeFlag,
        close: function (e) {
            callback();
        }
    }).data("kendoWindow");
    assignDialog.center().open();
}

function openSelectEmployee(eleId,
                            resultCode,
                            codeAttr,
                            resultName,
                            nameAttr,
                            resultPosition,
                            positionAttr,
                            unitCode,
                            singleFlag,
                            changeFlag,
                            callback
                            ){
    var employeeSelectWindow = $("#"+eleId).kendoWindow({
        width: 820,
        height: 600,
        title: '选择员工',
        visible: false,
        iframe: true,
        modal: true,
        actions: [
            "Minimize",
            "Maximize",
            "Close"
        ],
        resizable: false,
        content: _basePath + '/hr/employee_select.html?' +
            'employeeCodeStr=' + resultCode +
            '&employeeNameStr=' + resultName +
            '&positionNameStr=' + resultPosition +
            '&singleFlag='+ singleFlag +
            '&changeFlag=' + changeFlag +
            '&resultEmployeeCodeStr=' + codeAttr +
            '&resultEmployeeNameStr= ' + nameAttr +
            '&resultPositionNameStr=' +  positionAttr +
            (!unitCode ? '' : '&unitCode='+unitCode),
        close: function (e) {
            callback();
        }
    }).data("kendoWindow");
    employeeSelectWindow.center().open();
}

function openWindow(eleId,title,url,callback){
    var win = $('#'+eleId).kendoWindow({
        width: '95%',
        height: '90%',
        title: title,
        content: url,
        scrollable: false,
        resizable: false,
        iframe: true,
        visible: false,
        modal: true,
        close:function (){
            if(callback){
                callback();
            }
        }
    }).data("kendoWindow");
    win.center().open();
    return win;
}

function openWindowSize(eleId,title,url,callback,width,height){
    var win = $('#'+eleId).kendoWindow({
        width: width,
        height: height,
        title: title,
        content: url,
        scrollable: false,
        resizable: false,
        iframe: true,
        visible: false,
        modal: true,
        close:function (){
            if(callback){
                callback();
            }
        }
    }).data("kendoWindow");
    win.center().open();
    return win;
}


function getContentType(param){

    if(typeof param == 'string'){
        return 'application/json;charset=UTF-8';
    }

    return 'application/x-www-form-urlencoded;charset=UTF-8';
}


function ajaxSync(url,type,param){
    var resultData;
    $.ajax({
        url: _basePath+url,
        headers: {'X-CSRF-TOKEN': document.getElementsByTagName('meta')['_csrf'].content},
        contentType: getContentType(param),
        type: type,
        data: param,
        async: false,
        success: function (data) {
            resultData = data;
        },
        error : function(e) {
            errorToast('请求失败:'+e.status)
            resultData = e;
        }
    });
    return resultData;
}

function ajaxPromise(url,type,param){
    return new Promise((resolve,reject) => {
        $.ajax({
            url: _basePath+url,
            headers: {'X-CSRF-TOKEN': document.getElementsByTagName('meta')['_csrf'].content},
            contentType: getContentType(param),
            type: type,
            data: param,
            success: function (data) {
                resolve(data);
            },
            error : function(e) {
                errorToast('请求失败:'+e.status)
                reject(e);
            }
        });
    });
}

function muiAjaxSync(url,type,param){
    var resultData;
    mui.ajax(_basePath+url, {
        type: type,
        data: param,
        headers: {'X-CSRF-TOKEN': document.getElementsByTagName('meta')['_csrf'].content},
        contentType: getContentType(param),
        async: false,
        success: function (data) {
            resultData = data;
        },
        error: function (xhr, status, err) {
            mui.toast('请求失败:'+err)
            resultData = xhr;
        }
    });
    return resultData;
}

function muiAjaxPromise(url,type,param){
    return new Promise((resolve,reject) => {
        mui.ajax(_basePath+url, {
            type: type,
            data: param,
            headers: {'X-CSRF-TOKEN': document.getElementsByTagName('meta')['_csrf'].content},
            contentType: getContentType(param),
            success: function (data) {
                resolve(data);
            },
            error: function (xhr, status, err) {
                mui.toast('请求失败:'+err)
                reject(xhr);
            }
        });
    });
}


//初始化页面数据
function initEmpData(row1){
    viewModel.model.set('applyByName',row1.name);
    viewModel.model.set('applyPostName',row1.postName);
    viewModel.model.set('occupation',row1.occupation);
    viewModel.model.set('applyOrgName',row1.orgName);
    viewModel.model.set('nameAndCode',row1.name+"("+viewModel.model.employeeCode+")");

    if (row1.deptName1) {
        viewModel.model.set('applyDepartmentMcode',row1.pkDept1);
        if (row1.deptName2) {
            viewModel.model.set('deptName',row1.deptName1 + "-" + row1.deptName2);
            viewModel.model.set('applyKsMcode',row1.pkDept2);
        } else if (row1.deptName3){
            viewModel.model.set('deptName',row1.deptName1 + "-" + row1.deptName3);
            viewModel.model.set('applyKsMcode',row1.pkDept3);
        } else {
            viewModel.model.set('deptName',row1.deptName1);
        }
    } else if (row1.deptName2) {
        viewModel.model.set('applyDepartmentMcode',row1.pkDept2);
        viewModel.model.set('applyKsMcode',row1.pkDept2);
        if (row1.deptName2) {
            viewModel.model.set('deptName',row1.deptName2);
        }
    } else if (row1.deptName3) {
        viewModel.model.set('applyDepartmentMcode',row1.pkDept3);
        if (row1.deptName2) {
            viewModel.model.set('deptName',row1.deptName3);
        }
    }

    viewModel.model.set('applyBy',row1.mdmCode);
    viewModel.model.set('applyOrgMcode',row1.pkOrg);
    viewModel.model.set('applyPostMcode',row1.pkPost);
    viewModel.model.set('applyDepartmentCode',row1.deptCode);

    viewModel.model.set('applyOrgCode',row1.orgCode);
    viewModel.model.set('applyDeptCode',row1.deptCode);
}

//初始化页面数据
function initMobileEmpData(row1){
    viewModel.model.applyByName = row1.name;
    viewModel.model.applyPostName = row1.postName;
    viewModel.model.occupation = row1.occupation;
    viewModel.model.applyOrgName = row1.orgName;
    viewModel.model.nameAndCode =  row1.name+"("+viewModel.model.employeeCode+")";

    if (row1.deptName1) {
        viewModel.model.applyDepartmentMcode = row1.pkDept1;
        if (row1.deptName2) {
            viewModel.model.deptName = row1.deptName1 + "-" + row1.deptName2;
            viewModel.model.applyKsMcode = row1.pkDept2;
        } else if (row1.deptName3){
            viewModel.model.deptName = row1.deptName1 + "-" + row1.deptName3;
            viewModel.model.applyKsMcode = row1.pkDept3;
        } else {
            viewModel.model.deptName = row1.deptName1;
        }
    } else if (row1.deptName2) {
        viewModel.model.applyDepartmentMcode = row1.pkDept2;
        viewModel.model.applyKsMcode = row1.pkDept2;
        if (row1.deptName2) {
            viewModel.model.deptName = row1.deptName2;
        }
    } else if (row1.deptName3) {
        viewModel.model.applyDepartmentMcode = row1.pkDept3;
        if (row1.deptName2) {
            viewModel.model.deptName = row1.deptName3;
        }
    }

    viewModel.model.applyBy = row1.mdmCode;
    viewModel.model.applyOrgMcode = row1.pkOrg;
    viewModel.model.applyPostMcode = row1.pkPost;
    viewModel.model.applyDepartmentCode = row1.deptCode;
}

/**
 * 数组转成树结构数组
 * @param {Array} arrList 需要转成树结构的原数组
 * @param {String} id 子级 id
 * @param {String} fid 父级id
 * @param {String} children 子集 集合key 默认 children
 * @returns 树结构数组
 */
function getArrayTree(arrList, id, fid, children = 'children') {
    let map = []
    arrList.forEach(item => {
      let up = arrList.filter(x => x[id] == item[fid])
      let sit = arrList.filter(x => x[fid] == item[id])
      if (sit.length) {
        item[children] = sit
      }
      if (!(up.length && !sit.length)){
        map.push(item)
      }
    })
    if (arrList.length == map.length) return map
    else return getArrayTree(map, id, fid)
}



function getEmployeeData(){
    //所有员工数据
    return  new kendo.data.DataSource({
        transport: {
            read: {
                url: _basePath + "/hr/employee/queryEmployeesForAuto",
                dataType: "json"
            }
        },
        schema: {
            model: {
                expanded: true
            },
            parse: function (response) {
                var products = [];
                console.log();
                for (var i = 0; i < response.total; i++) {
                    var le = response.rows[i];
                    var product = {
                        text: le.name,
                        value: le.employeeCode,
                        positionName: le.positionName
                    };
                    products.push(product);
                }
                return products;
            }
        }
    });
}

function getUnitsData(){
    //所有部门数据
   return  new kendo.data.DataSource({
        transport: {
            read: {
                url: _basePath + "/hr/unit/queryUnits",
                dataType: "json"
            }
        },
        schema: {
            model: {
                expanded: true
            },
            parse: function (response) {
                var products = [];
                for (var i = 0; i < response.total; i++) {
                    var le = response.rows[i];
                    var product = {
                        text: le.name,
                        value: le.unitCode
                    };
                    products.push(product);
                }
                return products;
            }
        }
    });
}


function loadFileUpload(prefix,eleId){
    var mydate = new Date();
    //根据时间来自动生成uuid
    var tempKey = (""+mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds());
    // viewModel.model.tempKey = tempKey;
    viewModel.model.set('tempKey', viewModel.model.tempKey||tempKey);
    //是否显示上传、删除按钮 true(显示) false(隐藏)
    var showImportBtn = viewModel.model.edit;
    //applyId是申请单主表的主键
    var url = _basePath +"/upload/upload_img_show.html?tempKey=" + viewModel.model.tempKey + '&uploadTypePrefix='+prefix+'&buttonShow='+showImportBtn+'&associationTableId='+viewModel.model.id;
    $("#"+eleId).load(url);
}

/***
 * 获取当前日期（年份，月份，时间）：
 * @param type
 * @returns {string|number}
 */
function getDateTime (type) {
    var date = new Date();
    var hengGang = "-";
    var maoHao = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var curDate = date.getDate();
    var curHours = date.getHours();
    var curMinutes = date.getMinutes();
    var curSeconds = date.getSeconds();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (curDate >= 0 && curDate <= 9) {
        curDate = "0" + curDate;
    }
    if (curHours >= 0 && curHours <= 9) {
        curHours = "0" + curHours;
    }
    if (curMinutes >= 0 && curMinutes <= 9) {
        curMinutes = "0" + curMinutes;
    }
    if (curSeconds >= 0 && curSeconds <= 9) {
        curSeconds = "0" + curSeconds;
    }
    var currentdate = "";
    if (type == "year") {
        currentdate = year;
        return currentdate;
    } else if (type == "month") {
        currentdate = year + hengGang + month;
        return currentdate;
    } else {
        currentdate = year + hengGang + month + hengGang + curDate + " " + curHours + maoHao + curMinutes + maoHao + curSeconds;
        return currentdate;
    }
}

/**
 * 数组转成树结构数组
 * @param {Array} arrList 需要转成树结构的原数组
 * @param {String} id 子级 id
 * @param {String} fid 父级id
 * @param {String} children 子集 集合key 默认 children
 * @returns 树结构数组
 */
function getArrayTree(arrList, id, fid, children = 'children') {
    let map = []
    arrList.forEach(item => {
      let up = arrList.filter(x => x[id] == item[fid])
      let sit = arrList.filter(x => x[fid] == item[id])
      if (sit.length) {
        item[children] = sit
      }
      if (!(up.length && !sit.length)){
        map.push(item)
      }
    })
    if (arrList.length == map.length) return map
    else return getArrayTree(map, id, fid)
}



/***
 * @param uploadURL 上传路径
 * @param downloadURL 下载模版路径
 * @param windowId
 * @param gridId
 */
function importExcelOpen(uploadURL,downloadURL,windowId,gridId){
    uploadURL = _basePath+uploadURL;
    downloadURL = _basePath+downloadURL;
    var requestMess=uploadURL+":"+downloadURL+":"+windowId+":"+gridId;
    var importDiv = $("#"+windowId).kendoWindow({
        width: 600,
        height: 400,
        title: '导入excel',
        visible: false,
        iframe: true,
        modal: true,
        resizable: false,
        content: _basePath+"/sys/excel_import.html?requestMess="+requestMess,
        close: function (e) {
            $("#"+gridId).data("kendoGrid").dataSource.read();
            $("#"+gridId).data("kendoGrid").dataSource.page(1);
        }
    }).data("kendoWindow");
    importDiv.center().open();
}

function createEnum(definition) {
    const strToValueMap = {}
    const numToDescMap = {}
    for (const enumName of Object.keys(definition)) {
        const [value, desc] = definition[enumName]
        strToValueMap[enumName] = value
        numToDescMap[value] = desc
    }
    return {
        ...strToValueMap,
        getDesc(enumName) {
            return (definition[enumName] && definition[enumName][1]) || ''
        },
        getDescFromValue(value) {
            return numToDescMap[value] || ''
        }
    }
}

function getDictEnum(dataList){
    var result = new Object();
    for (let i = 0; i < dataList.length; i++) {
        result[dataList[i].code+'_'+dataList[i].value] = [ dataList[i].value , dataList[i].meaning]
    }
    return  createEnum(result);
}

// 在校验时 必填输入框失去焦点清除前后空格(kendo ui必填校验允许填空格通过校验，此方法为了解决这个问题)
if(typeof(kendo) != "undefined") {
    kendo.ui.validator.rules.required = function (input) {
        if (input.is('[required]')) {
            if(input.val() && input.val() != undefined) {
                input.val(input.val().trim());
            }
            if(!input.val() || input.val() == undefined || input.val() == '') {
                return false;
            }
        }
        return true;
    };
}

function deleteEmptyProperty(object){
    for (var i in object) {
        var value = object[i];
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                if (value.length == 0) {
                    delete object[i];
                    continue;
                }
            }
            this.deleteEmptyProperty(value);
            if (this.isEmpty(value)) {
                delete object[i];
            }
        } else {
            if (value === '' || value === null || value === undefined) {
                delete object[i];
            } else {
            }
        }
    }
}
function isEmpty(object) {
    for (var name in object) {
        return false;
    }
    return true;
}

function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        var propA = a[propName]
        var propB = b[propName]
        // 这里忽略了值为undefined的情况
        // 故先判断两边都有相同键名
        if(!b.hasOwnProperty(propName)) return false
        if ((propA instanceof Object)) {
            if (this.isObjectValueEqual(propA, propB)) {
                // return true     这里不能return ,后面的对象还没判断
            } else {
                return false
            }
        } else if (propA !== propB) {
            return false
        } else { }
    }
    return true
}


// toFixed 将数据Num保留2位小数，则表示为：toFixed(Num)；但是其四舍五入的规则与数学中的规则不同，使用的是银行家舍入规则 四舍六入五考虑，五后非零就进一，五后为零看奇偶，五前为偶应舍去，五前为奇要进一
// tofixed 方法重写解决精度丢失
Number.prototype.toFixed = function (n) {
    // n为期望保留的位数，超过限定，报错！
    if (n > 20 || n < 0) {
      throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    // 获取数字
    const number = this;
    // 如果是NaN,或者数字过大，直接返回'NaN'或者类似'1e+21'的科学计数法字符串
    if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString();
    }
    // 默认保留整数
    if (typeof (n) == 'undefined' || n == 0) {
      return (Math.round(number)).toString();
    }
  
    // 先获取字符串
    let result = number.toString();
    // 获取小数部分
    const arr = result.split('.');
  
    // 整数的情况，直接在后面加上对应个数的0即可
    if (arr.length < 2) {
      result += '.';
      for (let i = 0; i < n; i += 1) {
        result += '0';
      }
      return result;
    }
  
    // 整数和小数
    const integer = arr[0];
    const decimal = arr[1];
    // 如果已经符合要求位数，直接返回
    if (decimal.length == n) {
        return result;
    }
    // 如果小于指定的位数，补上
    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i += 1) {
        result += '0';
      }
      return result;
    }
    // 如果到这里还没结束，说明原有小数位多于指定的n位
    // 先直接截取对应的位数
    result = integer + '.' + decimal.substr(0, n);
    // 获取后面的一位
   let last = decimal.substr(n, 1);
   if (/^\d(9){5,}[89]$/.test(decimal.substr(n))) {
      last += last + 1;
    }
    // number大于等于0 大于等于5统一进一位
    if (parseInt(last, 10) >= 5 && number >= 0) {
      // 转换倍数，转换为整数后，再进行四舍五入
      const x = Math.pow(10, n);
      // 进一位后，转化还原为小数
      result = (Math.round((parseFloat(result) * x)) + 1) / x;
      // 再确认一遍
      result = result.toFixed(n);
    } else if (parseInt(last, 10) == 5 && number < 0) {
      // number小于0 等于5统舍去
      // 转换倍数，转换为整数后，再进行四舍五入
      const x = Math.pow(10, n);
      // 进一位后，转化还原为小数
      result = (Math.round((parseFloat(result) * x))) / x;
      // 再确认一遍
      result = result.toFixed(n);
    }  else if (parseInt(last, 10) > 5 && number < 0) {
      // number小于0 大于5统一进一位
      // 转换倍数，转换为整数后，再进行四舍五入
      const x = Math.pow(10, n);
      // 进一位后，转化还原为小数
      result = (Math.round((parseFloat(result) * x)) - 1) / x;
      // 再确认一遍
      result = result.toFixed(n);
    }
  
    return result;
  };


/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(num1,num2)
 ** 返回值：num1加上num2的精确结果
 **/
Number.prototype.accAdd=function (num2) {
    // 获取数字
    let num1 = this;
    var r1, r2, m, c;
    try {
        r1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            num1 = Number(num1.toString().replace(".", ""));
            num2 = Number(num2.toString().replace(".", "")) * cm;
        } else {
            num1 = Number(num1.toString().replace(".", "")) * cm;
            num2 = Number(num2.toString().replace(".", ""));
        }
    } else {
        num1 = Number(num1.toString().replace(".", ""));
        num2 = Number(num2.toString().replace(".", ""));
    }
    return Number((num1 + num2) / m);
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(num1,num2)
 ** 返回值：num1加上num2的精确结果
 **/
Number.prototype.accSub=function (num2) {
    let num1 = this;
    var r1, r2, m, n;
    try {
        r1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return Number(((num1 * m - num2 * m) / m).toFixed(n));
}
/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(num1,num2)
 ** 返回值：num1乘以 num2的精确结果
 **/
Number.prototype.accMul=function (num2) {
    let num1 = this;
    var m = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(num1,num2)
 ** 返回值：num1除以num2的精确结果
 **/
Number.prototype.accDiv=function (num2) {
    let num1 = this;
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(num1.toString().replace(".", ""));
        r2 = Number(num2.toString().replace(".", ""));
        return Number((r1 / r2) * pow(10, t2 - t1));
    }
}

/** 
 * 格式化时间 时间格式转成字符串时间
*/
function formatTime(date) {
    var time = new Date();
    if(date) {
        time = new Date(date);
    }
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

}