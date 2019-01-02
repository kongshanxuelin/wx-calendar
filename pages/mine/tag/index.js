const App = getApp();
Page({
  data:{  
    domain:App.Config.domain,
    scrollViewHeight:1000,  
    tagBgImage:" #2A3038",
    mytags:[],
    showAddTag:false,
    iconColor: App.Config.selectColors,
    },
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
          height:res.windowHeight
      });
    } catch (e) {
      console.log(e);
    }
  },
  doAdd:function(){
      this.setData({showAddTag:true});
  },
  //新增Tag
  doAddTagOK:function(e){
    var that = this;
    var _tagName = e.detail.value;
    if(_tagName === ""){
      this.setData({
          showAddTag:false
      });
      return;
    }
    return App.HttpService.tagAdd({"token":App.globalData.token,"t":_tagName}).then(json => {
      if(json.res){
        this.setData({
          showAddTag:false
        });
        that.reloadMyTags();
      }else{
        wx.showToast({
          title: '添加Tag失败！',
          icon: 'success',
          duration: 2000
        })
      }
      
    });
  },
  onLoad:function(options){
    this.getSystemInfo();
    this.setData({
              mytags:App.getCacheSync("mytags")
    });
    this.setData({
        label:this.data.mytags[0].label,
        bgcolor:this.data.mytags[0].bg_color,
        tagid:this.data.mytags[0].id
    });
  },
  changeLabel:function(e){
    var _label = e.detail.value;
    this.setData({
      "label":_label
    });
  },
  doChangeBgColor:function(e){
    const bgcolor = e.currentTarget.dataset.color;
    this.setData({
      "bgcolor":bgcolor
    });
  },
  doUp:function(){
    var that = this;
    App.HttpService.tagUp({
      "token":App.globalData.token,
      "id":this.data.tagid}).then(json => {
             console.log(json);
             if(json.res){
               that.reloadMyTags();
             }
    });
  },
  doDown:function(){
    var that = this;
    App.HttpService.tagDown({
      "token":App.globalData.token,
      "id":this.data.tagid}).then(json => {
             console.log(json);
             if(json.res){
               that.reloadMyTags();
             }
    });
  },
  //保存背景色和标签名		: 'tag/savetag.jhtml',//t,id,bgcolor
  doSave:function(){
    var that = this;
    App.HttpService.tagSave({
      "token":App.globalData.token,
      "id":this.data.tagid,
      "t":this.data.label,
      "bgcolor":this.data.bgcolor}).then(json => {
             console.log(json);
             if(json.res){
               console.log("----reload mytags");
               that.reloadMyTags();
               wx.showToast({
                title: '保存成功!',
                icon: 'success',
                duration: 2000
               });

             }

           });
  },
  changeTag:function(e){
    const id = e.currentTarget.dataset.id;
    const bgcolor = e.currentTarget.dataset.bgcolor;
    const _label = e.currentTarget.dataset.label;
    console.log(id);
    this.setData({
      "tagid":id,
      "label":_label,
      "bgcolor":bgcolor
    });
  },
  doAction:function(e){
    const action = e.currentTarget.dataset.action;
    console.log(action)
  },
  removeTag(e){
    var that = this;  
    var cTag = App.getCacheSync("cTag");
    if(cTag && cTag.tagMyId === this.data.tagid){
      wx.showToast({
          title: '当前Tag不能被删除！',
          icon: 'success',
          duration: 2000
      })
      return;
    }
    
    wx.showModal({
      title: '提醒',
      content: '是否确定删除 ' + this.data.label,
      success: function(res) {
        if (res.confirm) {
           App.HttpService.tagRemove({
             "token":App.globalData.token,
             "id":that.data.tagid
          }).then(json => {
             if(json.res){
               that.reloadMyTags();
             }
           });
        }
      }
    })
  },
  reloadMyTags(){
    var that = this;
    return App.HttpService.myTags({"token":App.globalData.token}).then(tags => {
      console.log("get mytags:",tags);
      if(tags){
        App.putCacheSync("mytags",tags);
        that.setData({
          mytags:tags
        });
      }
    });
  }
})