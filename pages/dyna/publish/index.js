const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    fileIds: [],//上传的文件ID列表
    content:"",
    addr:"",
    viewScope:"公开",
    uploadPath: App.Config.uploadPath,
    cateList: ["心情","采购","供应","商务合作","招聘","商品"],
    cateListIndex:0,
    scopeList:["仅限宁波地区","全国"],
    scopeListIndex:0,
    isShowPriceRow:false,
    price:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _index = options.index || -1;
    if(_index!=-1){
      _index = parseInt(_index)
    }

    var isadmin = App.getCacheSync("isadmin");
    if(isadmin === "1"){
        this.setData({
            cateList:["商品","采购","供应","商务合作","招聘"]
        });
        if(_index>=0){
          switch(_index){
            case 0:
              this.data.cateListIndex = 3;
              break;
            case 1:
              this.data.cateListIndex = 1;
              break;
            case 2:
              this.data.cateListIndex = 2;
              break;
            case 3:
              this.data.cateListIndex = 4;
              break;

          }
        }
    }else{
        this.setData({
            cateList:["采购","供应","商务合作","招聘"]
        });
        if (_index >= 0) {
          switch (_index) {
            case 0:
              this.data.cateListIndex = 3;
              break;
            case 1:
              this.data.cateListIndex = 0;
              break;
            case 2:
              this.data.cateListIndex = 1;
              break;
            case 3:
              this.data.cateListIndex = 2;
              break;

          }
        }
    }

    this.setData({
      cateListIndex: this.data.cateListIndex
    });
    
    if(this.data.cateList[this.data.cateListIndex] === "商品"){
      this.setData({
        isShowPriceRow:true
      });
    }else{
      this.setData({
        isShowPriceRow:false
      });      
    }


  },
  bindInputPrice:function(e){
      this.setData({
          price:e.detail.value
      });
  },
  bindPickerScopeChange: function (e) {
    this.setData({
      scopeListIndex: e.detail.value
    });
  },
  bindPickerCateChange:function(e){
    this.setData({
      cateListIndex: e.detail.value
    });
    if(this.data.cateList[e.detail.value] === "商品"){
      this.setData({
        isShowPriceRow:true
      });
    }else{
      this.setData({
        isShowPriceRow:false
      });      
    }
  },
  changeContent:function(e){
     this.setData({
       content: e.detail.value
     });
  },
  pubQuan:function(){
    var that = this;
    
    if (that.data.cateList[that.data.cateListIndex] == '商品'){
      if (that.data.price == ''){
        App.alert("请输入商品单价！");
        return;
      }
    }
    
    this.uploadFile2Server(function () {
      App.HttpService.dynaPublish({
        "token": App.getToken(),
        "content": that.data.content,
        "fileIds": that.data.fileIds.join(","),
        "addr": that.data.addr,
        "scope": that.data.scopeList[that.data.scopeListIndex],
        "cate":that.data.cateList[that.data.cateListIndex],
        "price":that.data.price
      }).then(json => {
        if(json.ret){
          wx.switchTab({
            url: '/pages/dyna/index'
          }); 
        }else{
          App.alert("发布失败！");
        }
      });
    });

  },
  //选择位置
  chooseLoc: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (obj) {
        that.setData({
          addr: obj.address
        })
      }
    });
  },
  removeImage: function (e) {
    var current = e.target.dataset.src;
    for (var i = 0; i < this.data.imageList.length; i++) {
      if (current === this.data.imageList[i]) {
        this.data.imageList.splice(i, 1);
      }
    }
    this.setData({
      imageList: this.data.imageList
    });
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    });
  },

  chooseAlbum:function(){
    var that = this
    wx.chooseImage({
      sourceType: ['camera'],
      sizeType: ['compressed'],
      count: 9,
      success: function (res) {
        App.log("res.tempFilePaths type:", typeof (res.tempFilePaths), res.tempFilePaths)
        that.data.imageList = that.data.imageList.concat(res.tempFilePaths);
        if (that.data.imageList.length>9){
          that.data.imageList = that.data.imageList.splice(0,9);
        }
        that.setData({
          imageList: that.data.imageList
        })
      }
    });
  },
  chooseCamera:function(){
    App.log("chooseCamera");
    var that = this;
    wx.chooseImage({
      sourceType: ['album'],
      sizeType: ['compressed'],
      count: 9,
      success: function (res) {
        that.data.imageList = that.data.imageList.concat(res.tempFilePaths);
        if (that.data.imageList.length > 9) {
          that.data.imageList = that.data.imageList.splice(0, 9);
        }
        that.setData({
          imageList: that.data.imageList
        })
      }
    });
  },
  uploadFile2Server: function (cb) {
    var that = this;
    console.log(this.data.imageList);
    if (this.data.imageList.length > 0) {
      var _path = this.data.imageList.shift();
      wx.showToast({
        title: '正在上传...',
        icon: 'success'
      })
      App.WxService.uploadFile({
        url: App.Config.domain + 'wx/upload',
        filePath: _path,
        name: 'file'
      }).then(res => {
        var ret = JSON.parse(res.data);
        if (ret.res) {
          App.log("push file id:", ret.id);
          that.data.fileIds.push(ret.id);
          that.setData({
            fileIds: that.data.fileIds
          });
        }
        that.uploadFile2Server(cb);
      });
    } else {
      wx.hideToast();
      cb();
    }
  }
})