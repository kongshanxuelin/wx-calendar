var util = require('../../utils/util.js')
const App = getApp()
Page({
  data:{
    textareaNumber:0,
    feedbackList:[],
    p:1,
    inputContent:""
  },
  onLoad:function(options){
    var _self = this;
    _self.setData({
        userInfo:App.globalData.userInfo
    });
  },
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh")
  },
  onReachBottom:function(){
    var page = this.data.page;
    if(page.hasNext){
        this.setData({
            p:page.nextPage
        })
        this.listFeedback();
    }
  },
  textareaChange:function(e){
    var content = e.detail.value;
    this.setData({
        textareaNumber:content.length
    });
    this.setData({
        "content":content
    })
  },
  listMoreData:function(){

  },
  listFeedback:function(){
      var that = this;
      App.HttpService.fb_list({
          "p":this.data.p
      }).then(page => {
          console.log(page)
          if(that.data.p == 1){
              that.setData({
                  feedbackList:that.formatFeedbackList(page.result)
              });
          }else{
              for(var i in page.result){
                  that.data.feedbackList.push(page.result[i]);
              }
              that.setData({
                  "feedbackList":that.formatFeedbackList(that.data.feedbackList)
              });
          }
          that.setData({
              "page":page
          });
          console.log(that.data.feedbackList)
      });
  },
  formatFeedbackList:function(fbList){
    for(var i in fbList){
        fbList[i].pubtimeNice = util.formatNiceTime(fbList[i].pubtime);
        fbList[i].canDelete = (fbList[i].nick === this.data.userInfo.nickName);
    }
    return fbList;
  },
  cleanInput:function(){

  },
  removeFeedback:function(e){
    const id = e.currentTarget.dataset.fbid;
    var that = this;
    wx.showModal({
      title: '确认',
      content: '是否确定删除该反馈？',
      success: function(res) {
        if (res.confirm) {
          App.HttpService.fb_remove({
                "token":App.globalData.token, 
                 "id": id
            }).then(res => {
                //移除该条反馈
                var fbs = that.data.feedbackList;
                for(var index in fbs){
                    if(fbs[index].id === id){
                        fbs.splice(index,1);
                        break;
                    }
                }
                that.setData({
                    "feedbackList":that.formatFeedbackList(fbs)
                });
            });
        }
      }
    })   
  },
  addFeedback:function(){
    if (typeof (this.data.content) == "undefined" || this.data.content === ""){
      wx.showToast({
        title: '请输入反馈意见！',
        icon: 'success'
      });
      return;
    }
      var that = this;
      wx.showToast({
        title: '正在反馈...',
        icon: 'success'
      });
     
        App.HttpService.fb_add({"c":that.data.content,"token":App.globalData.token}).then(data => {
            console.log(data);
            that.data.feedbackList.splice(0,0,data);
            console.log(that.data.feedbackList)
            that.setData({
                "feedbackList":that.formatFeedbackList(that.data.feedbackList)
            });
            that.setData({
                inputContent:"",
                content:""
            });
            that.cleanInput();
            wx.hideToast();
        });

  },
  onReady:function(){
    this.listFeedback();
  }
})