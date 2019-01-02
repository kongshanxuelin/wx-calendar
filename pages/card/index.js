import {
   init,                    // 初始化组件及页面
   Tabbar,                  // Tabbar是组件的事件注册中心
   setTabbarData            // 设置/更新 tabbar显示的数据
} from "../template/tabbar";


const App = getApp()
const UserPageData = {
  data: {
    mode:"view",
    curTab:"我的名片",
    touid:"",
    p:1,//当前名片拉取的页码
    q:"",//名片搜索关键字
    mycard:{},
    inputShowed: false,
        inputVal: "",
        cardUser:{
          
        },
        industryItems:[
      "金融业",
      "IT|通信|互联网",
      "机械机电|自动化",
      "冶金冶炼|采掘",
      "化工行业",
      "外贸行业",
      "纺织服装|皮革鞋业",
      "电子电器|仪器仪表",
      "快消品|办公用品",
      "房地产",
      "制药|医疗",
      "交通工具|物流",
      "广告媒体",      
      "批发零售",      
      "农林牧渔",      
      "公务员|事业单位",      
      "其他"      
    ]
  },

  //search card
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
            q: e.detail.value
        });
        this.showMyCardList(1, e.detail.value);
    },
    doEditCard:function(){
        this.setData({
          mode:"edit"
        });
    },
    doFinishConfirmOK:function(){
        var that = this;
        this.setData({
          mode:"view"
        });
        this.data.cardUser.token = App.globalData.token;
        console.log("this.data.cardUser:", this.data.cardUser);
        App.HttpService.card_save(this.data.cardUser).then(res => {
          that.setData({
            cardUser: res
          });
        });
    },
    onLoad: function (option) {
        var that = this;
        var touid = App.globalData.id;
        console.log("current user id:",touid);
        App.HttpService.card_view({
            "token":App.globalData.token,
            "touid": touid
        }).then(res => {
            that.setData({
              cardUser:res
            });
            console.log("*****card User:",that.data.cardUser);
        });
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.cardUser.phone
    });
  },
  chooseLoc:function(e){
    var that = this;
    wx.chooseLocation({
        success:function(obj){
            that.data.cardUser.addr = obj.address;
            that.setData({
              cardUser:that.data.cardUser
            })
        }
    });
  },
  changeInput:function(e){
    var _name = e.target.dataset.name;
    var _value = e.detail.value;
    this.data.cardUser[_name] = _value;
    this.setData({
        cardUser:this.data.cardUser
    });
  },
  bindPickerChange: function(e) {
    var index = e.detail.value;
    this.data.cardUser.industry = this.data.industryItems[index];
    this.setData({
      cardUser:this.data.cardUser
    });
  },
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh")
  },
  onReachBottom:function(){
    if (this.data.mycard.hasNext && this.data.curTab === "名片夹") {
      this.showMyCardList(this.data.mycard.nextPage,this.data.q);
    }
  },
  onTabClick:function(ev){
        console.log("###########tabar click:",ev);
        this.setData({
            curTab:ev
        });
        if(ev === "名片夹"){
          this.showMyCardList(1);
        }
  },
  showMyCardList:function(_p,q){
    if(typeof(q) === "undefined") q = "";
    this.setData({
      "q":q
    });
    var that = this;
    App.HttpService.card_mylist({
      "token": App.globalData.token,
      "p":_p,
      "q":q
    }).then(res => {
        console.log("my card list",res);
        var _cardResult = that.data.mycard.result;
        that.data.mycard = res;
        if(_p>1){
          that.data.mycard.result = _cardResult.concat(res.result)
        }
        that.setData({
          mycard: that.data.mycard
        });
    });
  },
  showMyCard:function(){
    App.WxService.navigateTo('/pages/card/view/index?touid=' + App.globalData.id);
  },
  saveContact:function(){
    var cardUser = this.data.cardUser;
    if (wx.addPhoneContact){
      wx.addPhoneContact({
        photoFilePath:cardUser.avator,
        nickName:cardUser.truename,
        lastName:'',
        middleName:'',
        firstName:'',
        remark: '来自微信小程序 - 商务工作记事册',
        mobilePhoneNumber: cardUser.phone,
        weChatNumber:cardUser.uid,
        addressCountry:'',
        addressState:'',
        addressCity:'',
        addressStreet: cardUser.addr,
        organization: cardUser.company,
        title: cardUser.title,
        email:'',
        url:'',
        success:function(){
            App.alert("保存成功");
        },
        fail:function(){
            App.alert("保存失败");
        }
      });
    }else{
      App.alert("微信版本太低，不支持的操作")
    }
  },
  genQuan:function(){
    App.HttpService.card_quanpic({
      "token": App.globalData.token,
      "touid": App.globalData.id
    }).then(res => {
      console.log("*************genQuan", res);
      if(res.ret){
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
  }
};

const tabbarData = [
    {
        iCount: 0,         
        active:true,           
        sIconUrl: "../../images/home.png",   
        sIconActiveUrl:  "../../images/home-active.png", 
        sTitle: "我的名片",                     
    },
    {
        iCount: 0,
        sIconUrl: "../../images/my.png",
        sIconActiveUrl:  "../../images/my-active.png",
        sTitle: "名片夹",
    },
];

setTabbarData(tabbarData);
init(UserPageData);