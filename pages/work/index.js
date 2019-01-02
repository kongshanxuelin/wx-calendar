//index.js
//获取应用实例
var App = getApp()
Page({
  data: {
    form:{
      fapiao: App.Config.formid.fapiao
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
  },
  openMiniTeam:function(){
    wx.navigateToMiniProgram({
      appId: 'wx2231c1ab9fc46fef',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  openMiniMall:function(){
    wx.navigateToMiniProgram({
      appId: 'wx25c8a13b10b2d895',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  }
})
