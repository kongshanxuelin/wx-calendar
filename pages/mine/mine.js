const App = getApp()
Page({
  data: {
    userInfo: {},
    cacheSize:0,
    version:App.Config.version,
    desc:App.Config.desc,
    enablePwd:false
  },
  switchPasswordEnable:function(e){
    if(e.detail.value){
      App.WxService.navigateTo('/pages/gesture/index')
    }else{
      App.putCacheSync("pwd","");
    }
  },
  navOrder:function(){
    App.WxService.navigateTo('/pages/order/index')
  },
  doScan:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res);
        var _result = res.result;
        App.scanFromHttp(_result,function(json){
          console.log("***doSacan http get end,",json);
          if (json.ret) {
            var tagid = json.tag.id;
            App.HttpService.mytagshare(
              {
                "token": App.globalData.token,
                "tagid": tagid
              }).then(json => {
                if (json.ret) {
                  wx.showToast({
                    title: '分享【' + json.tag.label + '】成功!',
                    icon: 'success',
                    duration: 2000
                  });
                } else {
                  wx.showToast({
                    title: '网络或其他错误！',
                    icon: 'success',
                    duration: 2000
                  });
                }
              });
            }
        });
        
      }
    });  
  },
  doClearCache:function(){
    wx.clearStorage();
    this.onShow();
    wx.showToast({
        title: "清理缓存成功！",
        icon: 'success'
    });
  },
  doJuanMe:function(e){
    var that = this;
    wx.showActionSheet({
      itemList: ['略表心意 - 1.00元', '一个面包 - 9.00元', '一杯咖啡 - 38.00元', '大力支持 - 69.00元'],
      success: function(res) {
        if(res.tapIndex < 4){
          var fee = res.tapIndex == 0 ? 100:(res.tapIndex==1?900:(res.tapIndex==2?3800:6900));
          App.prePay(fee);
        }
      }
    });
  },
  changeBg:function(e){
      var bg = e.currentTarget.dataset.bg;
      if(bg === "pic"){
        bg = "background:#2CA8E8 url(http://h5.sumslack.com/wx/bg.png) repeat fixed top"
      }else{
        bg = "background-color:"+bg;
      }
      App.putCacheSync("theme",bg);
      this.setData({
          "theme":App.getTheme()
      });
  },
  doTagMgr:function(){
      App.WxService.navigateTo('/pages/mine/tag/index')
  },
  doJuan:function(){
    var that = this;
    App.WxService.navigateTo('/pages/paythanks/paythanks')
  },
  doFeedback:function(){
    App.WxService.navigateTo('/pages/feedback/moments')
  },
  doBindEmail:function(){
    App.WxService.navigateTo('/pages/mine/bindemail/bindemail')
  },
  onLoad: function () {
    var that = this;
    this.setData({
          "theme":App.getTheme()
    });
    //调用应用实例的方法获取全局数据
    App.getUserInfo().then(userInfo => {
      that.setData({
        userInfo:userInfo
      })
    });

    

  },
  onShow:function(){
      var that = this;

      var _pwd = App.getCacheSync("pwd");
      if(_pwd && _pwd!=""){
        this.setData({
          enablePwd:true
        });
      }

      wx.getStorageInfo({
        success: function(res) {
          that.setData({
              cacheSize:parseFloat(res.currentSize/1024).toFixed(3)
          });
          that.setData({
            cacheLimitSize:parseFloat(res.limitSize/1024).toFixed(3)
          });
        }
      })
  }
})