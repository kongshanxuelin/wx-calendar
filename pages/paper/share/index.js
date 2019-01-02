const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paper:{},
    rate:"",
    id:"",//试卷ID或答卷ID
    t:"",//当type=paper时，无需显示打败了xxx
    score:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var rid = options.rid;
      var that = this;
      var _type = options.type || "";
      this.setData({
        t: _type,
        id:rid
      });
      console.log(this.data.t)
      App.HttpService.paperGet({ "token": App.globalData.token, "rid": rid, "type": this.data.t }).then(json => {
        this.setData({
          paper : json.paper,
          rate : json.rate,
          score : json.score
        });
      });
  },

  doStart: function(){
    App.WxService.navigateTo('/pages/paper/index?type=da&id='+this.data.paper.id);
  },

  share2Quan:function(){
    App.HttpService.paperGenImage({ 
      "token": App.globalData.token, 
      "id": this.data.id, 
      "type": this.data.t }).then(json => {
        if(json.ret){
          wx.downloadFile({
            "url": json.url,
            success: function (pic) {
              wx.previewImage({
                current: pic.tempFilePath,
                urls: [pic.tempFilePath]
              });
            }
          })
        }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})