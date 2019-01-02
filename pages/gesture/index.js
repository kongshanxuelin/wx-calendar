//index.js

var Lock = require('../../utils/gesture_lock.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    showFooter:false,
    isFirst:true,
    title:"启用手势密码"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    
  },
  onLoad: function (options) {
    var s = this;
    if(options && options.type === "9"){
      this.setData({
        title:"输入手势密码",
        type:options.type
      });
    }
    this.lock = new Lock("id-gesture-lock", wx.createCanvasContext("id-gesture-lock"), function(checkPoints, isCancel) {
      console.log('over',isCancel,s.getPassword(checkPoints));
      if(!isCancel){
        if(s.data.type && s.data.type === "9"){
          var _pwd = app.getCacheSync("pwd");
          var _spwd = s.getPassword(checkPoints);
          if(_pwd === _spwd){
            wx.switchTab({
                    url: '/pages/index/index'
                });  
          }else{
            s.setData({
              msg:"密码错误"
            });
          }
          s.lock.gestureError();
          setTimeout(function() {
            s.lock.reset();
          }, 1000);
          return;

        }
        if(s.data.isFirst){
          s.setData({
              isFirst:false,
              pwd:s.getPassword(checkPoints),
              msg:"请再输入一次以确保无误"
          });
        }else{
          var newPwd = s.getPassword(checkPoints);
          if(newPwd != s.data.pwd){
            s.setData({
              isFirst:true,
              msg:"二次密码确认失败，请重置密码"
            });
          }else{
            s.setData({
              isFirst:true,
              msg:"密码启用成功"
            });
            app.putCacheSync("pwd",newPwd);
            
          }
        }
      }
      s.lock.gestureError();
      setTimeout(function() {
        s.lock.reset();
      }, 1000);
    }, {width:300, height:300})
    this.lock.drawGestureLock();
    console.log('onLoad')
    var that = this
  },
  onTouchStart: function (e) {
    this.lock.onTouchStart(e);
  },
  onTouchMove: function (e) {
    this.lock.onTouchMove(e);
  },
  onTouchEnd: function (e) {
    this.lock.onTouchEnd(e);
  },
  getPassword:function(arr){
    var ss = "";
    for(var index in arr){
      ss += arr[index].index;
    }
    return ss;
  }
})
