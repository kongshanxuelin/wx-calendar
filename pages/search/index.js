var App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     title:"",
     d:"",
     v:{},
     showResult:false,
     id:"",
     searchResultList:[]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    var that = this;
    if(this.data.title === "查融资"){
      App.HttpService.search_invest_companys({
        "token": App.globalData.token,
        "q": e.detail.value
      }).then(data => {
         that.setData({
           searchResultList:data
         });
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var _title = options.title || "查询服务";
      var _d = options.d || "";
      var _id = options.id || "";
      if (_id != ""){ 
        this.data.showResult = true;
        App.HttpService.search_invest_detail({
          "token": App.globalData.token,
          "id": _id
        }).then(data => {
          console.log(data);
          that.setData({
            v:data
          });
        });
      }else{ 
        this.data.showResult = false;
      }
      this.setData({
          "title": _title,
          "d":_d,
          "showResult": this.data.showResult,
          "id":_id
      });
      wx.setNavigationBarTitle({
        title: _title,
      });
  },
  genqrcode:function(){
      var id = this.data.id;
      if (this.data.title === "查融资") {
        App.HttpService.qrcode_invest({
          "token": App.globalData.token,
          "id": id
        }).then(res => {
          console.log("*************genQuan", res);
          if (res.ret) {
            wx.downloadFile({
              "url": res.url,
              success: function (pic) {
                console.log(pic)
                wx.previewImage({
                  current: pic.tempFilePath,
                  urls: [pic.tempFilePath]
                });
              }
            })
          }
        });
      }
  },
  doSearch:function(e){
    var _id = e.currentTarget.dataset.id;
    var that = this;
    if(this.data.title === "查融资"){
      App.HttpService.search_invest_detail({
        "token": App.globalData.token,
        "id": _id
      }).then(data => {
        that.setData({
          id: _id,
          v: data,
          showResult:true,
          searchResultList:[]
        });
        that.hideInput();
      });
    }
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  callPhone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("share button", res.target)
    }
    return {
      title: '分享' + this.data.title,
      path: '/pages/search/index?id=' + this.data.id + '&d=' + this.data.d + '&title=' + this.data.title,
      success: function (res) {
        wx.showToast({
          title: '转发成功！',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败！',
          icon: 'success',
          duration: 2000
        });
      }
    }
  }
})