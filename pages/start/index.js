var App = getApp();
Page({
  data: {
    isHaveTag: true,
    isFromBack:false,
    selectItems:[
        {label:"记账簿"},
        {label:"人情往来"},
        {label:"加油宝"}
    ]
  },
  onShow: function () {
    console.log("onshow:");
    if (this.data.isFromBack){
      wx.switchTab({
        url: '/pages/index/index'
      });   
    }
  },
  onHide: function () {
    console.log("onhide:");
    this.setData({
      isFromBack:true
    });
  },
  onLoad: function (option) {
    var that = this;   
    var isSceneIn = false;
    //解析小程序码
    if (option.scene){
      var _scene = decodeURIComponent(option.scene);
      console.log("option scene:", _scene);
      // if (_scene != "" && _scene.indexOf("scan/cardscan?touid=") == 0) {       
      //   console.log("goto card view uid:", _touid);
      //   that.WxService.navigateTo('/pages/card/view/index?touid=' + _touid);
      //   return;
      // }
      /*
        打开到eform页面填写调查表，scene形如：/pages/eform/index?id=m5y3veg1z4
        查看名片：scan/cardscan?touid=m5itugg2dc
      */
      //试卷共享
      if (_scene.indexOf("sc.paper.id") >= 0) {
        var _touid = _scene.substring("sc.paper.id=".length, _scene.length);
        var items = _touid.split(".");
        if (items.length > 1) {
          App.WxService.navigateTo("/pages/paper/share/index?rid=" + items[0] + "&type=" + items[1]);
        } else {
          App.WxService.navigateTo("/pages/paper/share/index?rid=" + items[0]);
        }
        isSceneIn = true;
      }else if (_scene.indexOf("sc.card.id=") >= 0) {
        var _touid = _scene.substring("sc.card.id=".length, _scene.length);
        App.WxService.navigateTo("/pages/card/view/index?touid=" + _touid);
        isSceneIn = true;
      } else if (_scene.indexOf("e.id=") >= 0) {
        var _id = _scene.substring("e.id=".length, _scene.length);
        App.WxService.navigateTo("/pages/eform/index?id=" + _id);
        isSceneIn = true;
      } else if (_scene.indexOf("s.invest.id=") >= 0) {
        var _id = _scene.substring("s.invest.id=".length, _scene.length);
        App.WxService.navigateTo("/pages/search/index?id=" + _id + "&title=查融资&d=输入公司名查询该公司的公开融资情况");
        isSceneIn = true;
      }

    }
    

    var network = App.globalData.networkType;
    this.setData({
        network:network
    });

       

    var pwd = App.getCacheSync("pwd");  
    if(pwd && pwd!=""){
        App.WxService.navigateTo('/pages/gesture/index?type=9')
        return;
    }

    setTimeout(function(){
        var tags = App.getCacheSync("tags");
        console.log(tags);
        if(tags && tags.length>0){
            that.setData({
                selectItems:tags     
            });
        }
    },1000);

    
    setTimeout(function(){
        var animation = wx.createAnimation({  
            duration: 1200,  
            timingFunction:"ease"
        })  
        animation.opacity(0).scale(1.5, 1.5).step();
        that.setData({  
            animationData: animation.export()  
        });

        /*判断当前是否有mytags
        var mytags = App.getCacheSync("mytags");
        if(mytags && mytags.length>0){
            that.setData({
                isHaveTag:true    
            });
            setTimeout(function(){
                wx.switchTab({
                    url: '/pages/index/index'
                });   
            },1000);   
        }else{
            //去远程服务器查看是否没有mytag
            App.initLoadMyTags({time:new Date().getTime(),"t":"mytag"}).then(res => {
                console.log("mytag ajax " + res);
                mytags = App.getCacheSync("mytags");
                if(mytags && mytags.length>0){
                    wx.switchTab({
                        url: '/pages/index/index'
                    });  
                }else{
                    that.setData({
                        isHaveTag:false    
                    });
                }
            });
        }
        */
        that.setData({
            isHaveTag:true    
        });
        setTimeout(function(){
          if (!isSceneIn){
            wx.switchTab({
                url: '/pages/index/index'
            });   
          }
        },1000);   

    },1000);      
  },
  doRelauch:function(){
    wx.reLaunch({
        url: '/pages/start/start'
    });
  },
  selectChange:function(e){
    var _v = e.detail.value;
    this.setData({
      selectedIds:_v
    });
  },
  doMyTagGo:function(){
      var sIds = [];
      if(typeof this.data.selectedIds === "undefined"){
          for(var i in this.data.selectItems){
              sIds.push(this.data.selectItems[i].label);
          }
      }else{
          sIds = this.data.selectedIds;
      }
      if(sIds.length>0){
        App.HttpService.mytaginit({
            "token":App.globalData.token,
            "mytags":sIds.join(",")
        }).then(res => {
            console.log("callback ajax mytag",res);
            if(res && res.ret){
                wx.reLaunch({
                  url: '/pages/start/index'
                });
            }
        });
      }else{
        wx.showToast({
            title: '至少选择一项~',
            icon: 'success',
            duration: 2000
        })
      }
  }
})
