const App = getApp()
const UserPageData = {
  data: {
    scanIn: false,
    tmpl:[],
    tid:"",
    fieldValue:{},
    tmplList:[]
  },
  onLoad: function (option) {
      this.listMyTmpl();
      var _tmplId = option.id || "luya1t258g";
      if(option.id && option.id!=""){
      //if (_tmplId != "") {
          this.setData({
            scanIn:true,
            tid: _tmplId
          });

          var that = this;
          App.HttpService.eform_tmpl_get({
            "token": App.globalData.token,
            "tmplid": _tmplId
          }).then(res => {
            console.log(res);
            if (res.ret) {
              //fields预处理
              if(res.fields && res.fields.length>0){
                  for(var _idx in res.fields){
                    var _f = res.fields[_idx];
                    if (_f.ui_component === "select" || _f.ui_component === "radio" || _f.ui_component === "checkbox"){
                      _f.ui_other = _f.ui_other.split(",");
                      console.log(_f.ui_other);
                    }
                  }
              }
              that.setData({
                "tmpl": res
              });
            }
          });
      }
      
  },
  listMyTmpl:function(){
    var that = this;
    App.HttpService.eform_tmpl_mylist({
      token: App.globalData.token
    }).then(data=>{
      console.log(data);
      that.setData({
        "tmplList": data.list
      })
    });
  },
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh")
  },
  onReachBottom:function(){
    console.log("onReachBottom")
  },
  genqrcode:function(e){
    var formId = e.currentTarget.dataset.id;


    App.HttpService.eform_qrcode({
      "token": App.globalData.token,
      "id": formId
    }).then(res => {
      console.log("*************genQuan", res);
      if (res.ret) {
        wx.downloadFile({
          "url": res.url,
          success: function (pic) {
            console.log(res)
            wx.previewImage({
              current: pic.tempFilePath,
              urls: [pic.tempFilePath]
            });
          }
        })
      }
    });

  },
  showEFormActionSheet:function(e){
     var _tmplId = e.currentTarget.dataset.tmplid;
     console.log(e);
  },
  doScan:function(){
    App.doScan(); 
  },
  propChange:function(e){
    console.log(e);
    var _v = e.detail.value;
    var propId = e.currentTarget.dataset.propid;
    var propComp = e.currentTarget.dataset.propcomp;
    console.log(propId);
    if (propComp === "checkbox" && _v.length>0){
      _v = _v.join(",");
    }
    this.data.fieldValue[propId] = _v;
    this.setData({
      fieldValue: this.data.fieldValue
    });
  },
  doSubmit:function(){
    if (this.data.tmpl.fields && this.data.tmpl.fields.length > 0) {
      for (var _idx in this.data.tmpl.fields) {
          var _f = this.data.tmpl.fields[_idx];
          console.log(_f);
          if(_f.ui_isreq === "Y"){
            if (typeof (this.data.fieldValue[_f.id]) === "undefined" || 
            this.data.fieldValue[_f.id] === ""){
              wx.showToast({
                title: '有必填项未填！',
                icon: 'success',
                duration: 2000
              });
              return;
            }
          }
      }
    }
    console.log(this.data.fieldValue);
    var _args = this.data.fieldValue;
    _args.token = App.globalData.token;
    _args.tmplid = this.data.tid;
    App.HttpService.eform_tmpl_dataAdd(_args).then(res => {
      if(res.ret){
        wx.showToast({
          title: '感谢您的反馈！',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 2000);  
      }else{
        wx.showToast({
          title: '提交失败，请检查网络！',
          icon: 'success',
          duration: 2000
        });
      }
 
    });
  }
  
};

Page(UserPageData);
