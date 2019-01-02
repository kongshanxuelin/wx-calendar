const App = getApp()
const UserPageData = {
  data: {
    toid:"", //用户ID
    mode:"view",
    curTab:"我的名片",
    touid:"",
    inputShowed: false,
        inputVal: "",
    cardUser:{
      
    }
  },
  onLoad: function (option) {
      var that = this;
      var _touid = option.touid || App.globalData.id;
      console.log("view card user:", _touid);
      this.setData({
        toid:_touid
      });
      this.refreshCard();
      App.HttpService.card_addview({
        "token": App.globalData.token,
        "touid": _touid
      }).then(res => {
        console.log("*************card add view ", res);     
      });

  },
  saveContact: function () {
    var cardUser = this.data.cardUser;
    if (wx.addPhoneContact) {
      wx.addPhoneContact({
        photoFilePath: cardUser.avator,
        nickName: cardUser.truename,
        lastName: '',
        middleName: '',
        firstName: '',
        remark: '来自微信小程序 - 商务工作记事册',
        mobilePhoneNumber: cardUser.phone,
        weChatNumber: cardUser.uid,
        addressCountry: '',
        addressState: '',
        addressCity: '',
        addressStreet: cardUser.addr,
        organization: cardUser.company,
        title: cardUser.title,
        email: '',
        url: '',
        success: function () {
          App.alert("保存成功");
        },
        fail: function () {
          App.alert("保存失败");
        }
      });
    } else {
      App.alert("微信版本太低，不支持的操作")
    }
  },
  share2Quan:function(){
    console.log("this.data.toid=", this.data.toid);
    App.HttpService.card_quanpic({
      "token": App.globalData.token,
      "touid": this.data.toid
    }).then(res => {
      console.log(res);
      if (res.ret) {
        wx.downloadFile({
          "url": res.url,
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
  refreshCard:function(){
    var that = this;
    App.HttpService.card_view({
      "token": App.globalData.token,
      "touid": this.data.toid
    }).then(res => {
      console.log(res);
      that.setData({
        cardUser: res
      });
    });
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.cardUser.phone
    });
  },
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh")
  },
  onReachBottom:function(){
    console.log("onReachBottom")
  },
  cardLike: function () {
    var that = this;
    App.HttpService.card_addlike({
      "token": App.globalData.token,
      "touid": this.data.toid
    }).then(res => {
      that.refreshCard();
    });
  },
  cardSave: function () {
    var that = this;
    App.HttpService.card_addsave({
      "token": App.globalData.token,
      "touid": this.data.toid
    }).then(res => {
      that.refreshCard();
    });
  }
};
Page(UserPageData);