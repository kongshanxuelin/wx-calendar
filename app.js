//app.js
import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'
App({
  onLaunch: function (option) {
    console.log("*******app launch:",option.scene);
    var that = this;   
    wx.getNetworkType({
      success: function(res) {
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        console.log("+************network:",networkType);
        that.globalData.networkType = networkType;
      }
    });
    var _thisUid = that.getCacheSync("id");
    if (typeof _thisUid != "undefined" && _thisUid!=""){
      that.globalData.id = _thisUid;
      console.log("current userid:", that.globalData.id);
    }
    
    wx.checkSession({
        success: function(){
          console.log("check sesssion ok....");
          that.getUserInfo();
          //缓存token
          that.globalData.token = wx.getStorageSync("token");
          if((typeof that.globalData.token === "undefined") || (that.globalData.token === "")){
            that.login();
          }else{
            console.log("current token:",that.globalData.token);
            that.HttpService.checkLogin({token:that.globalData.token}).then(
                  data => {
                    that.putCacheSync("id",data.uid);
                    that.putCacheSync("isadmin",data.admin);
                    that.globalData.id = data.uid;
                    console.log("current userid:", that.globalData.id);
                    if(!data.res){
                        console.log("token过期，重新登录");
                        that.login();
                    }else{
                        that.tokenOKInit();
                    }   
                  }
            );
          }
      },
      fail: function(){
        console.log("check sesssion fail....")
        that.login();
      }
    });

    //侦听网络变化
    if(wx.onNetworkStatusChange){
      wx.onNetworkStatusChange(function(res) {
        console.log(res.isConnected);
        console.log(res.networkType);
        that.globalData.networkType = res.networkType;
      });
    }
    
  },
  initLoadTags(time){
    var that = this;
    return this.HttpService.tagAll({"token":this.globalData.token}).then(tags => {
      if(tags && typeof(tags) === "object"){
        that.putCacheSync("tags_lasttime",time.time);
        that.putCacheSync("tags",tags);
      }
    });
  },
  initLoadMyTags(time){
    var that = this;
    return this.HttpService.myTags({"token":this.globalData.token}).then(tags => {
      console.log("callback ajax mytag",tags);
      if(tags && typeof(tags) === "object"){
        that.putCacheSync("mytag_lasttime",time.time);
        that.putCacheSync("mytags",tags);
      }
    });
  },
  httpMyTags(){
      var that = this;
      //一次性加载我的所有Tags
      var lt = this.getCacheSync("mytag_lasttime");
      if(lt){
        this.HttpService.tagLastTime({"token":this.globalData.token,"t":"mytag"}).then(time => {
          if(lt < time.time*1000){
            that.initLoadMyTags({time:new Date().getTime(),"t":"mytag"});
          }
        });
      }else{
        that.initLoadMyTags({time:new Date().getTime(),"t":"mytag"});
      } 
  },
  //token验证正确后初始化
  tokenOKInit:function(){
      var that = this;
      //获取所有我的Tag
      this.httpMyTags();
      //获取系统支持的所有Tag
      var cTag = this.getCacheSync("cTag");
      if(cTag){
        this.globalData.cTag = cTag;
      }
      //获取增量Tag
      var tagLt = this.getCacheSync("tags_lasttime");
      if(tagLt){
        this.HttpService.tagLastTime({"token":this.globalData.token,"t":"tags"}).then(time => {
          if(tagLt < time.time*1000){
              that.initLoadTags({time:new Date().getTime(),"t":"tags"}).then(data=>{
                that.setData({
                  tags:that.getCacheSync("tags")
                });
              });
          }else{
            that.setData({
              tags:that.getCacheSync("tags")
            });
          }
        });
      }else{
        this.initLoadTags({time:new Date().getTime(),"t":"tags"}).then(data=>{
          that.setData({
            tags:that.getCacheSync("tags")
          });
        });
      }        
  },
  login:function(){
    var that = this;
    //调取个人资料
    this.getUserInfo().then(data=>{
        wx.login({
            success: function(res) {
              if (res.code) {
                wx.request({
                  url: that.Config.basePath+ 'wx/wx_login.jhtml',
                  data: {
                    code: res.code,
                    nickName:that.globalData.userInfo.nickName,
                    avatarUrl:that.globalData.userInfo.avatarUrl
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  success: function(res) {
                    console.log("login ajax ok:",res);
                    if(res.statusCode === 200){
                        console.log("cache token:",res.data.token)
                        wx.setStorage({
                          key: 'token',
                          data: res.data.token
                        });
                        that.globalData.token = res.data.token;
                        that.putCacheSync("id", res.data.id);
                        that.putCacheSync("isadmin",res.data.admin);
                        that.globalData.id = res.data.id;
                        console.log("current userid:", that.globalData.id);
                        that.tokenOKInit();
                    }
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
              
            }
          });
    });
  },
  
  getUserInfo() {
		return this.WxService.login()
		.then(data => {
			return this.WxService.getUserInfo()
		},err=>{
      console.log("wx.login error:",err);
    })
		.then(data => {
			this.globalData.userInfo = data.userInfo
			return this.globalData.userInfo
		});
	},
  isNetworkConnet(){
    return this.globalData.networkType != "none";
  },
  alert(msg){
      wx.showToast({
          title: msg,
          icon: 'success',
          duration: 2000
      });
  },
  showAlert(msg){
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },
  getToken(){
      return this.globalData.token;
  },
  getCacheSync(_key){
    return wx.getStorageSync(_key);
  },
  getCache(_key){
    return this.WxService.getStorage({
      key: _key}).then(
        data => {
          //console.log(_key + ":" + data);
          return data.data;
        },err=>{
          console.log("get Cache Key:"+_key + " error!")
          console.log(err)
          return "";
        }
      )
  },
  putCacheSync(_key,_value){
    console.log("=========put cache sync======",_key,_value)
    wx.setStorageSync(_key,_value);
  },
  putCache(_key,_value){
    return this.WxService.setStorage({
        key: _key,
        data: _value
    });
  },
  getCacheAsyn(_key,cb){
    wx.getStorage({
      key: _key,
      success: function (res) {
        if(typeof cb === "function"){
          cb(res);
        }
      }
    })
  },
  setCacheAsyn(_key,_value,cb) {
    wx.setStorage({
      key: _key,
      data: _value,
      success:function(res){
        if (typeof cb === "function") {
          cb(res);
        }
      }
    })
  },
  //获取App背景设置
  getTheme:function(){
      var bg = this.getCacheSync("theme");
      if(!bg){
        bg = "background:#2CA8E8 url(http://h5.sumslack.com/wx/bg.png) repeat fixed top" 
      };
      return bg;
  },
  prePay:function(fee){
    var that = this;
    that.globalData.fee = fee;
    this.HttpService.prePay({"fee": fee,
                body: '给小程序献爱心',
                atta:'desc',
                "token":this.getToken()}).then(pay => {
            //{"timeStamp":"1490059621","package":"prepay_id=wx20170321092705ecef9e1fcd0867209259","nonceStr":"40287d8a5aee78b0015aee7975be0003","paySign":"7FF1AF0C70C97AC082365AC523980A0B"}
                //发起支付
                var timeStamp = pay.timeStamp;
                var packages = pay.package;
                var paySign = pay.paySign;
                var nonceStr = pay.nonceStr;
                var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
                that.pay(param)
          });
  },
  doScan:function(){
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log("qrcode:", res);
        var _result = res.result;
        //临时生成的二维码，识别名片，表单等
        if(res.path && res.path!=""){
            var _scene = decodeURIComponent(res.path);
            console.log(_scene);
            //pages/start/index?scene=/pages/eform/index?id=luya1t258g
            //试卷共享
            if (_scene.indexOf("sc.paper.id") >= 0) {
              var _touid = _scene.substring("pages/start/index?scene=sc.paper.id=".length, _scene.length);
              var items = _touid.split(".");
              console.log(items);
              if(items.length > 1){
                that.WxService.navigateTo("/pages/paper/share/index?rid=" + items[0] + "&type=" + items[1]);
              }else{
                that.WxService.navigateTo("/pages/paper/share/index?rid=" + items[0]);
              }
              
            } else if (_scene.indexOf("sc.card")>=0){
            var _touid = _scene.substring("pages/start/index?scene=sc.card.id=".length, _scene.length);
            that.WxService.navigateTo("/pages/card/view/index?touid=" + _touid);
            } else if (_scene.indexOf("e.id") >= 0) {
              var _id = _scene.substring("pages/start/index?scene=e.id=".length, _scene.length);
              that.WxService.navigateTo("/pages/eform/index?id=" + _id);
            } else if (_scene.indexOf("s.invest.id") >= 0) {
              var _id = _scene.substring("pages/start/index?scene=s.invest.id=".length, _scene.length);
              that.WxService.navigateTo("/pages/search/index?id=" + _id +"&title=查融资&d=输入公司名查询该公司的公开融资情况");
            }else{
              wx.showToast({
                title: '无法识别的二维码！',
                icon: 'success',
                duration: 2000
              });
            }
            return;
        }
        if (_result.indexOf("mytagscan")>0){
          that.scanFromHttp(_result, function (json) {
            console.log("***doSacan http get end,", json);
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
        } else if (_result.indexOf("formscan")>=0){
          that.scanFromHttp(_result, function (json) {
            if (json.ret) {
              that.WxService.navigateTo('/pages/eform/index?id=' + json.id);
            }
          });
        } else if (_result.indexOf("cardscan") >= 0) {
          that.scanFromHttp(_result, function (json) {
            if (json.ret) {
              that.WxService.navigateTo('/pages/card/view/index?touid=' + json.id);
            }
          });
        } else if (_result.indexOf("loginscan") >= 0) {
          that.scanFromHttp(_result, function (json) {
            console.log(json);
          });
        }
      }
    });  
  },
  /* 扫一扫返回的请求 */
  scanFromHttp:function(_url,cb){
    var urlIt = _url;
    if (_url.indexOf("http")!=0){
      urlIt = this.Config.domain + _url;
    }
    console.log("get http url:",urlIt);
    wx.request({
      url: urlIt,
      data: {
        token: this.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (json) {
        console.log("scanFromHttp:", typeof (cb),json);
        if(typeof(cb) == "function"){
          if(typeof(json.data)!="object"){
            json.data = JSON.parse(json.data);
          }
          cb(json.data);
        }
      }
    });
  },
  /* 支付   */
  pay: function (param,cb) {
        console.log(param)
        var that = this;
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function (res) {
              console.log(res);
              if(res.errMsg === "requestPayment:ok"){
                  console.log("juan ok....");
                  if (typeof cb === "function") {
                    cb({ code: 0 });
                  }else{
                   that.getToken().then(token=>{
                      that.HttpService.addPayThank({
                          "token":token, 
                          fee:that.globalData.fee
                      }).then(res => {
                          
                      });
                    });

                   wx.navigateBack({
                     delta: 1, // 回退前 delta(默认为1) 页面
                     success: function (res) {
                       wx.showToast({
                         title: '谢谢您的爱心捐赠~',
                         icon: 'success',
                         duration: 2000
                       })
                     },
                     fail: function () {
                       // fail
                     },
                     complete: function () {
                       // complete
                     }
                   });
                  }
              }

            },
            fail: function (res) {
                // fail
                console.log("支付失败")
                console.log(res);
                if(typeof cb === "function"){
                  cb({code:200,msg:res});
                }
            },
            complete: function () {
                // complete
                console.log("pay complete")
            }
        })
  },
  log(msg1,msg2,msg3){
    if(typeof msg3 != "undefined"){
        console.log("***info****", msg1,msg2,msg3);
    }else if (typeof msg2 != "undefined") {
        console.log("***info****", msg1, msg2);
    }else{
        console.log("***info****", msg1);
    }
  },
  globalData:{
    userInfo:null
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages), 
	HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(), 
	HttpService: new HttpService, 
	WxService: new WxService, 
	Tools: new Tools, 
	Config: Config
})