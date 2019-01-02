var calendar = require('../../utils/calendar.js')
var util = require('../../utils/util.js')
const App = getApp()
var interval;//录音显示
const conf = {
  data: {
    isShowBottomBar:true,//是否显示右下角快捷按钮
    //scrollViewHeight:1000,//屏幕高度计算
    isShowTagNameStat:false,
    tagName:"记事", //当前切换的Tag名称
    tagBgColor:"#2F74D0",
    tagMyId:"",    //当前切换的我的Tag ID
    showAddTag:false, //是否显示新增Tag输入框

    isShowAlertPanel:false,//是否显示提醒面板

    hasEmptyGrid: false,
    critical: 100, //触发切换日历的临界值
    animationData:"", 
    showModalStatus:false,
    isFes:false,
    fexName:"",
    tasks:[],
    uploadPath:App.Config.uploadPath,
    cur_path:[],
    cur_spath:[],

    //当前选中的日期的整数
    cDateInt:new Date().getTime(),

    //语音备忘
    recording:false,
    recordTime:0,
    recording_finished:false,

    playTime:0,
    hasRecord:false,
    formatedRecordTime:"00:00:00",
    formatedPlayTime:"00:00:00",
    //日历翻页动画
    animation:{},
    open : false,
    mytags:[],
    tags:[],  //所有服务端支持的Tag列表
    propValues:{},  //自定义控件值ID表
    propIndexes:{}, //自定义控件索引表，用于方便UI显示
    fangjia:{
      "2017-01-01":"2","2017-01-02":"1","2017-01-22":"1","2017-02-04":"1","2017-01-27":"2",
"2017-01-28":"2","2017-01-29":"2","2017-01-30":"2","2017-01-31":"2","2017-02-01":"2",
"2017-02-02":"2","2017-04-02":"2", "2017-04-03":"2","2017-04-04":"2","2017-04-01":"1",
"2017-05-01":"2","2017-05-27":"1", "2017-05-28":"2","2017-05-29":"2","2017-05-30":"2","2017-09-30":"1","2017-10-01":"2","2017-10-02":"2","2017-10-03":"2","2017-10-04":"2","2017-10-05":"2","2017-10-06":"2","2017-10-07":"2","2017-10-08":"2","2018-01-01": "2",
"2018-02-15": "2","2018-02-16": "2","2018-02-17": "2","2018-02-18": "2","2018-02-19": "2",
"2018-02-20": "2","2018-02-21": "2","2018-04-05": "2","2018-04-06": "2","2018-04-07": "2","2018-04-08": "1","2018-04-28": "1","2018-04-29": "2","2018-04-30": "2","2018-05-01": "2",
"2018-06-16": "2","2018-06-17": "2","2018-06-18": "2","2018-09-22": "2","2018-09-23": "2",
"2018-09-24": "2","2018-09-29": "1","2018-09-30": "1","2018-10-01": "2","2018-10-02": "2",
"2018-10-03": "2","2018-10-04": "2","2018-10-05": "2","2018-10-06": "2","2018-10-07": "2",
      "2018-12-29":"1",
      "2018-12-31": "2",
      "2019-01-01": "2",
      "2019-02-02": "1",
      "2019-02-03": "1",
      "2019-02-04": "2",
      "2019-02-05": "2",
      "2019-02-06": "2",
      "2019-02-07": "2",
      "2019-02-08": "2",
      "2019-02-09": "2",
      "2019-02-10": "2",
      "2019-04-05": "2",
      "2019-04-06": "2",
      "2019-04-07": "2",
      "2019-05-01": "2",
      "2019-06-07": "2",
      "2019-06-08": "2",
      "2019-06-09": "2",
      "2019-09-13": "2",
      "2019-09-14": "2",
      "2019-09-15": "2",
      "2019-09-29": "1",
      "2019-10-01": "2",
      "2019-10-02": "2",
      "2019-10-03": "2",
      "2019-10-04": "2",
      "2019-10-05": "2",
      "2019-10-06": "2",
      "2019-10-07": "2",
      "2019-10-12": "1",

    }
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  toggleAlertPanel(e){
      this.setData({
        isShowAlertPanel:!this.data.isShowAlertPanel
      });
  },
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      console.log(res)
      if(res.windowHeight*res.pixelRatio<1000){
        this.setData({
          scrollViewHeight: 1000,
          ratio:res.pixelRatio,
          height:res.windowHeight
        });
      }else{
        this.setData({
          scrollViewHeight: (res.windowHeight*res.pixelRatio),
          ratio:res.pixelRatio,
          height:res.windowHeight
        });
      }
      console.log("==========="+this.data.scrollViewHeight)
    } catch (e) {
      console.log(e);
    }
  },
  bindAlertDateChange: function(e) {
        this.setData({
            alertDate: e.detail.value
        })
    },
  bindAlertTimeChange: function(e) {
        this.setData({
            alertTime: e.detail.value
        })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },

  calWeekFromThisYear(date){
    var getWeekOfYear = function (today) {
      var firstDay = new Date(today.getFullYear(), 0, 1);
      var dayOfWeek = firstDay.getDay();
      var spendDay = 1;
      if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1;
      }
      firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
      var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
      var result = Math.ceil(d / 7);
      return result + 1;
    };
     return getWeekOfYear(date);
  },
  planMonth(){
    var _m = this.data.cur_year + "" + (this.data.cur_month<10?("0"+this.data.cur_month):this.data.cur_month);
    App.WxService.navigateTo('/pages/plan/index?stype=m&stypeArg='+_m);
  },
  logWeek(e){
    var _date = e.currentTarget.dataset.date;
    App.WxService.navigateTo('/pages/plan/index?stype=w&stypeArg='+_date);
  },
  calculateDays(year, month) {
    let days = {};
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var lunar = calendar.cal.solar2lunar(year,month,i);
      var cDate = new Date(year,month-1,i);
      var cDateStr = util.dateFormat(cDate,"yyyy-MM-dd")
      var cName = lunar.IDayCn;
      if(lunar.Term && lunar.Term!=null){
        cName = lunar.Term;       
      }else if(lunar.lDay == 1){
        cName = lunar.IMonthCn;  
      }
      var isToday = (new Date().toDateString() === cDate.toDateString());
      
      days[cDateStr]={
        day:i,
        nl:cName,
        date: cDate.getTime(),
        "isToday":isToday,
        nWeek:lunar.nWeek
      };

      //在days数组里的周六后面跟上一个当前第几周
      if(lunar.nWeek === 6){
            var _nWeek = year + ""+this.calWeekFromThisYear(cDate);
            days[cDateStr+"x"] = {
                day:this.calWeekFromThisYear(cDate),
                nl:"",
                date: _nWeek,
                "isToday":false,
                nWeek:99
            };
      }

      if(this.data.fangjia[cDateStr])
      {
        days[cDateStr].fj = this.data.fangjia[cDateStr];
      }
      //var _tasks = this.listTaskFromCacheSync(cDateStr);
      //days[cDateStr].tasks = _tasks;
      days[cDateStr].tasks = new Array();
    }
    this.setData({
      days:days
    });
  },
  onLoad(options) {
      //缓存版本号,第一次启动时加载Splash窗口并引导
      // if ( App.getCacheSync("version") != App.Config.version ){
      //   wx.showModal({
      //     title: '确认',
      //     content: '请花1分钟时间为我们的小程序做个小调查吧？',
      //     success: function (res) {
      //       if (res.confirm) {
      //         App.WxService.navigateTo("/pages/eform/index?id=m5y3veg1z4");
      //       }
      //     }
      //   });       
      // }
      App.putCacheSync("version", App.Config.version);
      this.init();
      this.i = 1;
      this.animation = wx.createAnimation({
          duration:300,
          timingFunction:"ease-in",
          delay:0
      });
      const date = new Date();
      const cur_year = date.getFullYear();
      const cur_month = date.getMonth() + 1;
      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六','W'];
      this.setData({
        cur_year,
        cur_month,
        weeks_ch
      })
      /*
      //TODO:根据消息卡片切换到那天
      if(options.dt && options.dt!=""){
          var that = this;
          var __dt = new Date(parseInt(options.dt));
          var _dateStr = util.dateFormat(__dt,"yyyy-MM-dd");
          var _year = __dt.getFullYear();
          var _month = __dt.getMonth() + 1;
          window.setTimeout(function(){
            that.goDay(_year,_month);
            that.goToDay(_dateStr);
          },1500);
      }else{
          
      }
      */
      this.switchToday();
      
  },
  init(){
      var that = this;
      this.getSystemInfo();
      var cTag = App.getCacheSync("cTag");
      if(cTag){
        this.setData({
          tagBgColor:cTag.tagBgColor,
          tagName:cTag.tagName,
          isShowTagNameStat:(cTag.tagName.indexOf("账")>=0),
          tagTag:cTag.tagTag,
          tagMyId:cTag.tagMyId
        });
      }
      this.setData({
          tags:App.getCacheSync("tags"),
          mytags:App.getCacheSync("mytags")
      });
  },
  

  propChange(e){
      var _v = e.detail.value;
      var selectArray = e.currentTarget.dataset.array;
      var _propId = e.currentTarget.dataset.propId || e.currentTarget.dataset.propid;
      if(selectArray){
        this.data.propValues[_propId] = selectArray[_v].id;
        this.data.propIndexes[_propId] = _v;
        console.log(this.data.propIndexes, this.data.propValues);
        this.setData({
          propValues:this.data.propValues,
          propIndexes:this.data.propIndexes
        });
      }else{
        this.data.propValues[_propId] = _v;
        this.setData({
          propValues:this.data.propValues
        });
      }

      
  },
  
  addTag:function(){
    this.setData({
      showAddTag:true
    });
  },
  doAddTagBlur:function(e){
    var that = this;
    var _tagName = e.detail.value;
    if(_tagName === ""){
      this.setData({
          showAddTag:false
      });      
    }
    wx.showModal({
      title: '确认',
      content: '是否保存当前分类？',
      success: function(res) {
        if (res.confirm) {
          that.doAddTagOK(e);
        }
      }
    });           
  },
    //新增Tag
  doAddTagOK:function(e){
    var that = this;
    var _tagName = e.detail.value;
    if(_tagName === ""){
      this.setData({
          showAddTag:false
      });
      return;
    }
    return App.HttpService.tagAdd({"token":App.globalData.token,"t":_tagName}).then(json => {
      console.log("**********doAddTagOK*************",json)
      if(json.res){
        this.setData({
          showAddTag:false
        });
        App.initLoadMyTags({time:0}).then(json => {
          that.setData({
            mytags:App.getCacheSync("mytags")
          });
        });
      }else{
        wx.showToast({
          title: '添加Tag失败！',
          icon: 'success',
          duration: 2000
        })
      }
      
    });
  },

  switchMyTag:function(){
      var that = this;
      var _mytags = App.getCacheSync("mytags");
      var _itemsList = ["记事"];
      var _itemsListObject = [""];
      var index = 0;
      for(var i in _mytags){
        ++index;
        if(index>5) break;
        _itemsList.push(_mytags[i].label);
        _itemsListObject.push(_mytags[i]);
      }
      wx.showActionSheet({
        itemList: _itemsList,
        success: function(res) {
            if(res.tapIndex>0){
              var _item = _itemsListObject[res.tapIndex];
              const id = _item.id;
              const bgcolor = _item.bg_color;
              const _label = _item.label;
              const _tag = _item.tag_id;
              that.setData({
                tagBgColor:bgcolor,
                tagName:_label,
                isShowTagNameStat:(_label.indexOf("账")>=0),
                tagTag:_tag,
                tagMyId:id
              });
              App.putCacheSync("cTag",{"tagBgColor":bgcolor,"tagName":_label,"tagTag":_tag,tagMyId:id});
            }else{
              that.setData({
                tagBgColor:"#2F74D0",
                tagName:"记事",
                isShowTagNameStat:false,
                tagTag:"",
                tagMyId:""
              });
              App.putCacheSync("cTag",{});
            }
        }
      });
  },

  changeTag(e){
      const id = e.currentTarget.dataset.id;
      const bgcolor = e.currentTarget.dataset.bgcolor;
      const _label = e.currentTarget.dataset.label;
      const _tag = e.currentTarget.dataset.tag;
      this.setData({
        open : false,
        tagBgColor:bgcolor,
        tagName:_label,
        isShowTagNameStat:(_label.indexOf("账")>=0),
        tagTag:_tag,
        tagMyId:id
      });
      App.putCacheSync("cTag",{"tagBgColor":bgcolor,"tagName":_label,"tagTag":_tag,tagMyId:id});
  },
  onShow(){
    console.log("******trigger index onshow...")
    var that = this;
    var _theme = App.getTheme();
    this.setData({
      theme:_theme
    });

    var that = this;
    
    
    this.listRefreshTasks(function () {
      if (that.data.cDateInt > 0) {
        that.goToDay(that.data.cDateInt);
      } else {
        that.goToDay(new Date().getTime());
      }
    });
    App.initLoadMyTags({time:0}).then(json => {
      that.setData({
        mytags:App.getCacheSync("mytags")
      });
    });

  },
  initLoadMyTask(time,cb){
      var that = this;
      return App.HttpService.listTask({
        time:time.time,
        "token":App.globalData.token
      }).then(
        tasks => {
          console.log("*mytasks from server*",tasks);   
          if(tasks){ 
            App.putCacheSync("mytasks",tasks);
            App.putCacheSync("lasttime",time.time);
            that.formatTasks2Days(tasks);
            if(typeof cb === "function"){
              cb();
            }
          }
      });
  },
  listRefreshTasks(cb){
    var that = this;
    var lastTime = App.getCacheSync("lasttime");
    if(lastTime){
      App.HttpService.taskLastTime({"token":App.globalData.token}).then(time => {
          if(lastTime < time.time*1000){
              return that.initLoadMyTask({time:new Date().getTime()},cb);
          }else{
              that.renderMyTasks();
          }
        });
    }else{
      return that.initLoadMyTask({time:new Date().getTime()},cb);
    }
  },
  removeTaskIt(task){
    var that = this;
    var curDate = task.dt;
    var tasks = this.getTasksByDate(curDate);
    if(tasks){
      for(var index in tasks){
        if(typeof tasks[index] === "object" && (tasks[index].id == task.id)){
          tasks.splice(index,1);
        }
      }
      this.data.days[curDate].tasks = tasks;
      that.refreshCacheDays(this.data.days);
      this.setData({
              "tasks":tasks
      });
    }
  },

  moremenu:function(){
      /*
      wx.showActionSheet({
        itemList: ['周计划','月计划','扫一扫'],
        success: function(res) {
          
        }
      });
      */
       App.WxService.navigateTo('/pages/help/index');
  },
  refreshCacheDays:function(days){
    this.setData({
          "days":this.data.days
    });
    //App.putCache("days",days);
  },
  renderMyTasks(){
    var tasks = App.getCacheSync("mytasks");
    this.formatTasks2Days(tasks);
  },
  formatTasks2Days(tasks){
    var days = this.data.days; 
    for(var _d in days){
      days[_d].tasks = [];
    }
    for(var _t in tasks){
      if(typeof tasks[_t] === "object"){
        var _dt = tasks[_t].dt;
        if(typeof days[_dt] != "undefined")
          days[_dt].tasks.push(tasks[_t]);
      }
    }
    this.refreshCacheDays(days);
  },
  addNewTask(tasks,_task){
      for(var i=0;i<tasks.length;i++){
          var _t = tasks[i];
          if(typeof _t === "object"){
            if(_t.id === _task.id){
              console.log("update task:",_task.id);
              tasks[i] = _task;
              return tasks;
            }
          }
      }
      console.log("add task:",_task.id);
      tasks.push(_task);
      return tasks;
  },
  getTasksByDate(dt){
      if(this.data.days[dt]){
        var tasks = this.data.days[dt].tasks;
        return tasks;
      }
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    if (handle === 'prev') {
       this.goPrevMonth();
    } else {
       this.goNextMonth();
    }
  },
  goPrevMonth:function(){
      const cur_year = this.data.cur_year;
      const cur_month = this.data.cur_month;
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.goDay(newYear,newMonth)
  },
  goNextMonth:function(){
      const cur_year = this.data.cur_year;
      const cur_month = this.data.cur_month;
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.goDay(newYear,newMonth)
  },
  switchToday:function(){
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        this.goDay(cur_year,cur_month);
        App.globalData.cDate = date;
        this.goToDay(App.globalData.cDate.getTime());
  },
  goDay:function(newYear,newMonth){
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
      if(this.animation){
        this.animation.rotateY(this.i * 360).step();
        this.i += 1;
        this.setData({
            animation:this.animation.export()
        });
      }
      //this.listRefreshTasks();
      this.renderMyTasks();
  },
  onShareAppMessage() {
    return {
      title:App.Config.appName,
      desc: App.Config.appDesc,
      path: 'pages/index/index'
    }
  },
  doScan: function () {
    App.doScan();
  },
  goPageStat:function(e){
      const _id = this.data.tagMyId;
      App.WxService.navigateTo('/pages/stat/stat?id='+_id);
  },
  //显示待办事宜页面
  showTODOPage:function(){
      //App.WxService.navigateTo('/pages/logs/logs')
      wx.switchTab({
        url: '/pages/logs/logs'
      })
  },
  //添加事件对话框
  showModal: function () { 
    // 显示遮罩层 
    var animation = wx.createAnimation({ 
      duration: 200, 
      timingFunction: "ease-in", 
      delay: 0 
    }); 
    this.animation = animation 
    animation.translateY(300).step() 
    this.setData({ 
      isShowBottomBar: false,
      animationData: animation.export(), 
      showModalStatus: true 
    }) 
    setTimeout(function () { 
      animation.translateY(0).step() 
      this.setData({ 
        animationData: animation.export() 
      }) 
    }.bind(this), 200) 
  }, 
  hideModal: function () { 
    if(this.data.recording){
       this.stopRecording();
    }
    this.setData({
          //图片列表清空
          isShowBottomBar:true,
          imageList: [],
          propValues:{},
          propIndexes:{},
          //上传的原图和缩略图清空
          cur_path:[],
          cur_spath:[],
          //录音文件清空
          recordTempFilePath:""
    });
    // 隐藏遮罩层 
    var animation = wx.createAnimation({ 
        duration: 200, 
        timingFunction: "linear", 
        delay: 0 
    }); 
    this.animation = animation 
    animation.translateY(300).step() 
    this.setData({ 
        animationData: animation.export(), 
    }); 
    setTimeout(function () { 
      animation.translateY(0).step() 
      this.setData({ 
        animationData: animation.export(), 
        showModalStatus: false 
      }) 
    }.bind(this), 200); 
  }, 
  //日期长按按
  addTask:function(e){
    const _date = e.currentTarget.dataset.date || App.globalData.cDate.getTime();
    var _dateStr = util.dateFormat(new Date(_date),"yyyy-MM-dd")
    //查看是否有自定义字段
    var _tag = this.getTag(this.data.tagTag);
    var _tagProps = [];
    var _pp = this.data.propIndexes;
    if(_tag!=null){
      _tagProps = _tag.props;
      for(var _idx in _tagProps){
          if(_tagProps[_idx].component === "select"){
            _pp[_tagProps[_idx].id] = 0;
          }
      }
      this.setData({
        propIndexes:_pp
      });
      console.log(_pp);
    }
    
    this.setData({
      cDateStr:_dateStr,
      tagProps:_tagProps,
      recording_finished:false,
      alertDate:_dateStr,
      alertTime:"09:00"
    })
    App.globalData.cDate = new Date(_date);
    this.showModal(); 
  },
  getTag:function(id){
    var _tags = App.getCacheSync("tags");
    for(var s in _tags){
        if(_tags[s].id && _tags[s].id===id){
          return _tags[s];
        }
    }
    return null;
  },
  addTask_click_cancel:function(){
     this.hideModal();
  },
  input_content: function(e) {
    App.globalData.content = e.detail.value
  },
  removeTaskFromCache:function(tasks,task){
    var cArray = [];
    for(var t in tasks){
        if(tasks[t].id != task.id){
            cArray.push(tasks[t]);
        }
    }  
    return cArray;
  },
  deleteTask:function(e){
    const task = e.currentTarget.dataset.task;
    console.log(task)
    var that = this;
    wx.showActionSheet({
        itemList: ["详情","删除"],
        success: function(res) {
            if(res.tapIndex == 0){
                App.WxService.navigateTo('/pages/note/detail?id='+task.id);
            }else if(res.tapIndex == 1){
                wx.showModal({
                  title: '确认',
                  content: '是否确定删除该事件？',
                  success: function(res) {
                    if (res.confirm) {
                      App.HttpService.removeTask({
                          "token":App.globalData.token, 
                            id: task.id
                      }).then(res => {
                          if(res.res){
                              that.removeTaskIt(task);
                          }
                      });
                    }
                  }
                });        
            }
        }
    });            
  },
  getCTagPropValues(values){
      var _tag = this.getTag(this.data.tagTag);
      var _tagProps = [];
      if(_tag!=null){
        _tagProps = _tag.props;
        for(var _idx in _tagProps){
            var _prop = _tagProps[_idx];
            if(typeof values[_prop.id] === "undefined"){
              values[_prop.id] = _prop.input_defaultValue;
            }
        }
      }
      console.log("values:",values);
      return values;
  },
  addTaskPic(e){
     //console.log(this.data.imageList);
     //console.log(App.globalData.content)
     var _formId = e.detail.formId;
     console.log(_formId);
     //如果正在录音，则关闭录音并上传录音文件
     if(this.data.recording){
       this.stopRecording();
       return;
     }
     var _alertDate = (this.data.isShowAlertPanel?this.data.alertDate:"")
     var _alertTime = (this.data.isShowAlertPanel?this.data.alertTime:"")
     var that = this;
     var _dateStr = util.dateFormat(new Date(App.globalData.cDate),"yyyy-MM-dd");
     var token = App.globalData.token;

     if(typeof that.data.recordTempFilePath !== "undefined" && that.data.recordTempFilePath!=""){
              that.uploadFile2ServerByFilePath("录音上传",that.data.recordTempFilePath,function(url,surl){
                  console.log("持久化语音备忘录：",that.data.recordTempFilePath);
                  App.HttpService.addTask({
                      formId:_formId,
                      "token":App.globalData.token, 
                      content: App.globalData.content,
                      dt:_dateStr,
                      alertDate:_alertDate,
                      alertTime:_alertTime,
                      path:url,
                      spath:surl,
                      props:that.getCTagPropValues(that.data.propValues),
                      mytagid:that.data.tagMyId
                    }).then(res => {
                      that.listRefreshTasks(function(){
                        that.goToDay(App.globalData.cDate.getTime());
                      });
                      
                      that.hideModal();
                    });
                });
     }else if(that.data.imageList && that.data.imageList.length>0){
        that.uploadFile2Server(function(){
          App.HttpService.addTask({
              formId:_formId,
              "token":token, 
              content: App.globalData.content,
              dt:_dateStr,
              alertDate:_alertDate,
              alertTime:_alertTime,
              path:that.data.cur_path.join(","),
              spath:that.data.cur_spath.join(","),
              props:that.getCTagPropValues(that.data.propValues),
              mytagid:that.data.tagMyId
            }).then(res => {
              console.log(res)
              that.hideModal();
              that.listRefreshTasks(function(){
                that.goToDay(App.globalData.cDate.getTime());
              });
              
            });
        });
      }else{
        App.HttpService.addTask({
          formId:_formId,
          "token":token, 
          content: App.globalData.content,
          dt:_dateStr,
          alertDate:_alertDate,
          alertTime:_alertTime,
          props:that.getCTagPropValues(that.data.propValues),
          mytagid:that.data.tagMyId
        }).then(res => {
              that.hideModal();
              that.listRefreshTasks(function(){
                that.goToDay(App.globalData.cDate.getTime());
              });
              
        });
     }
     
    
  },
  uploadFile2ServerByFilePath:function(msg,filePath,cb){
      wx.showToast({
        title: msg,
        icon: 'success'
      });
      App.WxService.uploadFile({
          url: App.Config.basePath + 'task/uploadFile.jhtml',
          filePath: filePath,
          name: 'file'
      }).then(res => {
        var ret = JSON.parse(res.data);
        console.log(ret);
        if(ret.res){
          console.log("ret.path:",ret.path);
          cb(ret.path,ret.spath);
          wx.hideToast();
        }
      });  
  },
  uploadFile2Server:function(cb){
    var that = this;
    if(this.data.imageList.length>0){
      var _path = this.data.imageList.pop();
      wx.showToast({
        title: '正在上传...',
        icon: 'success'
      })
      App.WxService.uploadFile({
          url: App.Config.basePath + 'task/uploadFile.jhtml',
          filePath: _path,
          name: 'file'
      }).then(res => {
        //console.log(res.data)
        var ret = JSON.parse(res.data);
        console.log("------------");
        console.log(ret);
        if(ret.res){
          that.data.cur_path.push(ret.path);
          that.data.cur_spath.push(ret.spath);
          console.log("that.data.cur_path")
          console.log(that.data.cur_path);
          /*
          that.setData({
            "cur_path":that.data.cur_path,
            "cur_spath":that.data.cur_spath
          });
          */
          wx.hideToast();
        }
        that.uploadFile2Server(cb);
      }); 
    }else{
      cb();
    }
  },
  chooseAudio:function(){
      var that = this;
      //如果正在录音，则关闭录音
      if(this.data.recording){
          this.stopRecording();
          this.setData({recording_finished:true});
          return;
      }

      this.setData({
          imageList:[]
      });

      this.setData({recording:true});
      
      interval = setInterval(function(){
         that.data.recordTime += 1;
         that.setData({
            formatedRecordTime:util.formatRecordTime(that.data.recordTime)
         });
      },1000);

      App.WxService.startRecord().then(res => {
          console.log(res)
          that.setData({
              recording:false,
              hasRecord:true,
              recordTempFilePath : res.tempFilePath,
              formatedRecordTime:util.formatRecordTime(that.data.playTime)
          });
          clearInterval(interval);
          var _dateStr = util.dateFormat(App.globalData.cDate,"yyyy-MM-dd");
          console.log(that.data.recordTempFilePath,_dateStr);
      });
  },
  stopRecording:function(){
    var that = this;
    wx.stopRecord();
    this.setData({
       recording:false,recordTime:0,formatedRecordTime:"00:00:00"
    });
    clearInterval(interval);
  },
  playAudio:function(e){
    const url = e.currentTarget.dataset.url;
    console.log('start download:',url);
    wx.downloadFile({
      "url": url,
      success: function(res) {
        console.log(res)
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    })
  },
  //首页添加图片/语音
  chooseImageTake: function () {
    if(this.data.recording){
      wx.showToast({
        title: "语音备忘不能添加图片",
        icon: 'success'
      });
      return;
    }
    var that = this
    wx.chooseImage({
      sourceType: ['camera'],
      sizeType: ['compressed'],
      count: 9,
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  chooseImage: function () {
    if(this.data.recording){
      wx.showToast({
        title: "语音备忘不能添加图片",
        icon: 'success'
      });
      return;
    }
    var that = this
    wx.chooseImage({
      sourceType: ['album'],
      sizeType: ['compressed'],
      count: 9,
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  //长按从ImageList中删除
  removeFromImageList:function(e){
    var current = e.target.dataset.src;
    for(var i=0;i<this.data.imageList.length;i++){
      if(current === this.data.imageList[i]){
        this.data.imageList.splice(i,1);
      }
    }
    this.setData({
      imageList:this.data.imageList
    });
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  previewImageTask: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //点击某个日期加载任务列表
  tapOneDay:function(e){
    const _date = e.currentTarget.dataset.date;
    App.globalData.cDate = new Date(_date);
    this.goToDay(_date);
  },
  goToDay:function(_date){
    //console.log(typeof(_date))
    _date = parseInt(_date);
    var dateFes = new Date(_date);    
    var lunar = calendar.cal.solar2lunar(dateFes.getFullYear(),dateFes.getMonth()+1,dateFes.getDate());
    if(lunar.Term && lunar.Term!=""){
      this.setData({
          isFes:true,
          fesName:lunar.Term
      });
    }else{
      this.setData({
          isFes:false
      });
    }
    var _dateStr = util.dateFormat(new Date(_date),"yyyy-MM-dd");
    this.setData({
            "tasks":this.getTasksByDate(_dateStr),
            cDateStr:_dateStr,
            cDateInt:_date
    });
  },
  goPageMy:function(e){    
        App.WxService.navigateTo('/pages/mine/mine')
  },
  doTagMgr:function(){
        App.WxService.navigateTo('/pages/mine/tag/index')
  },
  clickmemo:function(e){    
        //App.WxService.navigateTo('/pages/memo/memo')
        if(this.data.open){
          this.setData({
            open : false
          });
        }else{
          this.setData({
            open : true
          });
        }
  },
  //处理手势翻页日历
  scrollTouchstart:function(e){
    let px = e.touches[0].pageX;
    this.setData({
      startx: px,
      endx:px
    })
  },
  scrollTouchmove:function(e){
    let px = e.touches[0].pageX;
    let d = this.data;
    this.setData({
      endx: px,
    })
    if(px-d.startx<d.critical && px-d.startx>-d.critical){
      this.setData({
        marginleft: px - d.startx
      })
    }
  },
  scrollTouchend:function(e){
    let d = this.data;
    if(d.endx-d.startx >d.critical){
      //往后翻一页
      this.goPrevMonth();
    }else if(d.endx-d.startx <-d.critical){
      //往前翻一页
      this.goNextMonth();
    }
    this.setData({
        startx:0,
        endx:0
    })
  }
};

Page(conf);