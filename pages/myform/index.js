const App = getApp()
const UserPageData = {
  data: {
    tmpl:[],
    tid:"",
    fieldValue:{},
    tmplList:[],
    tmplDataMap:{ret:false},
    mode:"view",
    title:"",//应用名
    btnTitle:"创建表单",
    isZhuanfa:false
  },
  onLoad: function (option) {    
      var _tmplId = option.id || "";      
      var _title = option.title || "微趣表单";
      var _tmplIdId = option.idid;
      var that = this;
      //if(option.id && option.id!=""){
      wx.setNavigationBarTitle({
        title: _title,
      });

      this.setData({
        tid: _tmplId,
        title: _title
      });

      console.log("***********option:", option);
      if (_tmplIdId && _tmplIdId != ""){
          this.data.tmplDataMap.ret = true;
          this.setData({
            tmplDataMap: this.data.tmplDataMap
          });
          console.log("***********zhuafna:", _tmplIdId);
          App.HttpService.eform_tmpl_get({
            "token": App.globalData.token,
            "tmplid": _tmplId
          }).then(res => {
            console.log("******tmpl:",res);
            if (res.ret) {
              //fields预处理
              if (res.fields && res.fields.length > 0) {
                for (var _idx in res.fields) {
                  var _f = res.fields[_idx];
                  if (_f.ui_component === "select" || _f.ui_component === "radio" || _f.ui_component === "checkbox") {
                    _f.ui_other = _f.ui_other.split(",");
                  }
                }
              }
              that.setData({
                "tmpl": res
              });
              that.getFormData(_tmplIdId);
            }
          });

          
          that.setData({
            isZhuanfa:true
          });
      } else if (_tmplId != "") {
        console.log("***********myform:", _tmplId);
        App.HttpService.eform_tmpl_get({
          "token": App.globalData.token,
          "tmplid": _tmplId
        }).then(res => {
          console.log(res);
          if (res.ret) {
            //fields预处理
            if (res.fields && res.fields.length > 0) {
              for (var _idx in res.fields) {
                var _f = res.fields[_idx];
                if (_f.ui_component === "select" || _f.ui_component === "radio" || _f.ui_component === "checkbox") {
                  _f.ui_other = _f.ui_other.split(",");
                }
              }
            }
            that.setData({
              "tmpl": res
            });
            that.isDataExists();
          }
        });
      }  
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("share button",res.target)
    }
    return {
      title: '分享'+this.data.title,
      path: '/pages/myform/index?id='+this.data.tid+'&idid=' + this.data.tmplDataMap.id+'&title='+this.data.title,
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
  },
  getWxFaPiao:function(){
    //console.log(this.data.fieldValue);
    var that = this;
    if (wx.chooseInvoiceTitle){
      wx.chooseInvoiceTitle({
        success(res) {
          var bankAccount = res.bankAccount;
          var bankName = res.bankName;
          var companyAddress = res.companyAddress;
          var taxNumber = res.taxNumber;
          var telPhone = res.telephone;
          var title = res.title;
          var _type = res.type;
          var _arr = {};
          _arr["m3fnv4ui9s"] = title;
          _arr["m3fnv4v7k0"] = taxNumber;
          _arr["m3fnv4vk74"] = companyAddress;
          _arr["m3fnv4vwu8"] = telPhone;
          _arr["m3fnv4w9hc"] = bankName;
          _arr["m3fnv4w9hd"] = bankAccount;
          _arr["m3fnv4uuww"] = _type;
          that.setData({
            fieldValue: _arr
          });
        }
      })
    }else{
      App.alert("微信版本太低，不支持的接口！");
    }
    
  },
  doCreate:function(){
      this.data.tmplDataMap.ret = true;
      this.setData({
        tmplDataMap: this.data.tmplDataMap,
        mode:"edit",
        btnTitle: "创建表单"
      })
  },
  isDataExists:function(){
    var that = this;
    App.HttpService.eform_tmpl_myform_existdata({
      "token": App.globalData.token,
      "tmplid": this.data.tid
    }).then(res => {
      that.setData({
        tmplDataMap:res,
        btnTitle:(res.id!=""?"编辑表单":"添加表单")
      });
      if(res.ret){
        that.getFormData(res.id);
      }
    });
  },
  getFormData:function(recId){
    var that = this;
    App.HttpService.eform_tmpl_myform_getdata({
      "token": App.globalData.token,
      "id": recId
    }).then(data => {
      if (data.result.fields) {
        for (var _idx in data.result.fields) {
          var _item = data.result.fields[_idx];
          that.data.fieldValue[_item.id] = _item.value;
        }
        that.setData({
          fieldValue: that.data.fieldValue
        });
      }
    });
  },
  onPullDownRefresh:function(){
      console.log("onPullDownRefresh");
  },
  onReachBottom:function(){
      console.log("onReachBottom");
  },
  showEFormActionSheet:function(e){
      var _tmplId = e.currentTarget.dataset.tmplid;
      console.log(e);
  },
  propChange:function(e){
      var _v = e.detail.value;
      var propId = e.currentTarget.dataset.propid;
      var propComp = e.currentTarget.dataset.propcomp;
      if (propComp === "checkbox" && _v.length>0){
        _v = _v.join(",");
      }
      this.data.fieldValue[propId] = _v;
      this.setData({
        fieldValue: this.data.fieldValue
      });
  },
  doSubmit:function(){
    var that = this;
    var _mode = this.data.mode;
    if(_mode === "view"){
        this.setData({
            btnTitle:"保存表单",
            mode:"edit"
        });
        return;
    }

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
    var _args = this.data.fieldValue;
    _args.token = App.globalData.token;
    _args.tmplid = this.data.tid;
    
    if (this.data.tmplDataMap.id && this.data.tmplDataMap.id!=""){
      _args.tmplId = this.data.tid;
      _args.tmplIdId = this.data.tmplDataMap.id;
      console.log(_args);
      App.HttpService.eform_tmpl_myform_savedata(_args).then(res => {
        if (res.ret) {
          wx.showToast({
            title: '保存数据成功！',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '保存数据失败！',
            icon: 'success',
            duration: 2000
          });
        }
        that.setData({
          btnTitle: "编辑表单",
          mode: "view"
        });

      });
    }else{
      App.HttpService.eform_tmpl_dataAdd(_args).then(res => {
        if(res.ret){
          wx.showToast({
            title: '添加数据成功！',
            icon: 'success',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: '添加数据失败！',
            icon: 'success',
            duration: 2000
          });
        }
        that.setData({
          btnTitle: "编辑表单",
          mode: "view"
        });

      });
    }
  }
};
Page(UserPageData);