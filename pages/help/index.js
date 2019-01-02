//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imageList:[
      "http://h5.sumslack.com/wx/help/jiejiari.png",
      "http://h5.sumslack.com/wx/help/alarm3.png",
      "http://h5.sumslack.com/wx/help/alarm2.png",
      "http://h5.sumslack.com/wx/help/alarm1.png",
      "http://h5.sumslack.com/wx/help/stat1.png",
      "http://h5.sumslack.com/wx/help/stat2.png",
      "http://h5.sumslack.com/wx/help/share1.png",
      "http://h5.sumslack.com/wx/help/share2.png"
      
    ]
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})
