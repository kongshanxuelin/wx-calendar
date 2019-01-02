const App = getApp()
Page({
  data: {
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isInputTODO:false,
    hasNext:false
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo( {  
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }  
    });  
    if(!App.isNetworkConnet()){
        App.alert("需联网访问！");
    }
    this.fetchTabData(0);
  },
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh")
  },
  onReachBottom:function(){
    if(this.data.hasNext && this.data.showtab==1){
       this.goFinishList(this.data.nextPage);
    }
  },
  bindChange: function( e ) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
    that.fetchTabData(this.data.currentTab);
  },  
  swichNav: function( e ) {  
    var that = this;  
    if( this.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.target.dataset.current  
      });
      that.fetchTabData(this.data.currentTab);  
    }  
  },  
  doingChange:function(e){
      var v = e.detail.value;
      var that = this;
      if(typeof v === "object"){
        if(v.length === 1){
          App.HttpService.todo_finish({
            "token":App.globalData.token,
            "id":v[0]
          }).then(data => {
             that.fetchTabData(0); 
          });
        }
      }
  },
  fetchTabData:function(i){
    var that = this;
    var index = Number(i);
    if(index == 0){
        this.goDoingList();
    }else if(index ==1){
        this.goFinishList(1);
    }
  },
  goDoingList:function(){
    var that = this;
    App.HttpService.todo_list({
      "token":App.globalData.token
    }).then(data => {
        that.setData({
            list_doing:data
        });
    });
  },
  goFinishList:function(_p){
    var that = this;
    App.HttpService.todo_listFinished({
      "token":App.globalData.token,
      "p":_p
    }).then(data => {
      console.log(data);
      that.setData({
          list_finished:(_p===1?data.result:that.data.list_finished.concat(data.result)),
          hasNext:data.hasNext,
          nextPage:data.nextPage
      });
    });
  },
  doDoingMoreAction:function(e){
    var that = this;
    var v = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['归档','删除'],
      success: function(res) {
        if(res.tapIndex == 2){

        }else if(res.tapIndex == 0){
          App.HttpService.todo_finish({
            "token":App.globalData.token,
            "id":v
          }).then(data => {
            if(data && data.ret){
              that.goDoingList();
            }
          });
        }else if(res.tapIndex == 1){
          App.HttpService.todo_remove({
            "token":App.globalData.token,
            "id":v
          }).then(data => {
            if(data && data.ret){
              that.goDoingList();
            }
          });
        }
      }
    });
  },
  doFinishMoreAction:function(e){
    var that = this;
    var v = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function(res) {
        if(res.tapIndex == 0){
          App.HttpService.todo_remove({
            "token":App.globalData.token,
            "id":v
          }).then(data => {
            if(data && data.ret){
              that.goFinishList(1);
            }
          });
        }
      }
    });
  },
  setTab:function(e){
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: Number(edata.tabindex),
      showtabtype: edata.type
    })
    this.fetchTabData(edata.tabindex);
  },
  addTODO:function(){
     this.setData({
        isInputTODO:true
     });
  },
  doFinishTypingBlur:function(e){
    var c = e.detail.value;
    if(c==""){
      this.setData({
          isInputTODO:false
      });
    }
  },
  doFinishTyping:function(e){
     var that = this;
     var c = e.detail.value;
     if(c!=""){
      App.HttpService.todo_add({"c":c,"token":App.globalData.token}).then(data => {
          that.fetchTabData(0);
          that.setData({
            isInputTODO:false
          });

      });
     }
  }
})