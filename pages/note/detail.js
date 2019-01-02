const App = getApp()
Page({
  data: {
    uploadPath:App.Config.uploadPath,
    winWidth: 0,  
    winHeight: 0,  
    taskId:"",
    task:{},
    title:"",
    task_content:"",
    mode:"view",
    imageList:[],
    propValues: {},  //自定义控件值ID表
    propIndexes: {}, //自定义控件索引表，用于方便UI显示
  },
  onLoad: function (option) {
    var taskId = option.id || "lnf56r9c00";
    this.setData({
      "taskId": taskId
    });
    this.getTask(taskId);
  },
  goEdit(){
     var that = this;
     if(this.data.mode === "edit"){
        //TODO:dosave
       console.log(this.data.task.id,this.data.task_content,this.data.propValues);
       App.HttpService.saveTask({
            "id": this.data.task.id,
            "token": App.globalData.token,
            content: this.data.task_content,
            props: JSON.stringify(this.data.propValues)
      }).then(res => {
        console.log(res);
        that.setData({
          mode: "view"
        });
        that.getTask(that.data.task.id);
        //App.putCacheSync("lasttime",0);
        
      });
      

       
     }else{
       this.setData({
         mode:"edit"
       });
     }
  },
  goHome(){
    wx.switchTab({
        url: '/pages/index/index'
    });
  },
  changeContent(e){
    this.setData({
      task_content: e.detail.value
    });
  },
  propChange(e) {
    var _v = e.detail.value;
    var selectArray = e.currentTarget.dataset.array;
    var _propId = e.currentTarget.dataset.propId || e.currentTarget.dataset.propid;
    if (selectArray) {
      this.data.propValues[_propId] = selectArray[_v].id;
      this.data.propIndexes[_propId] = _v;
      console.log(this.data.propIndexes);
      this.setData({
        propValues: this.data.propValues,
        propIndexes: this.data.propIndexes
      });
    } else {
      this.data.propValues[_propId] = _v;
      this.setData({
        propValues: this.data.propValues
      });
    }
  },
  onShareAppMessage() {
    return {
      title:"好友分享了记事",
      desc: this.data.title,
      path: 'pages/note/detail?id='+this.data.taskId
    }
  },

  getTask:function(id){
    var that = this;
    App.HttpService.getTask({
      "token":App.globalData.token,
      "id":id
    }).then(data => { 
      
       var _imageList = [];
       for(var i in data.atta){
          _imageList.push(that.data.uploadPath+data.atta[i].path);
       }

       var _title = "记事详情";
       if(data.task_content!="" && data.task_content.length>1){
          if(data.task_content.length>12){
            _title = data.task_content.substring(0,12)+"...";
          }else{
            _title = data.task_content;
          }
       }
       wx.setNavigationBarTitle({
         title: _title
       });
       
       that.setData({
         task:data,
         imageList:_imageList,
         "title":_title,
         "task_content": data.task_content
       }); 

       if(data.props && data.props.length>0){
           var _propValues = that.data.propValues;
           var _propIndexes = that.data.propIndexes;
   
           for(var ii in data.props){
             var _item = data.props[ii];
             _propValues[_item.k] = _item.v;
             if (_item.prop.component === "select")
                 _propIndexes[_item.prop.id] = that.getPropIndex(_item.prop.listCompoenet, _item.v_label);
           }

           that.setData({
             propValues: _propValues,
             propIndexes: _propIndexes
           });
       }

       console.log(that.data.propValues, that.data.propIndexes);

    });
  },
  getPropIndex:function(compArray,v){
    for (var i = 0; i < compArray.length;i++){
      if (compArray[i].v === v){
        return i;
      }
    }
    return 0;
  },
  playAudio:function(e){
    const url = e.currentTarget.dataset.url;
    wx.downloadFile({
      "url": url,
      success: function(res) {
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    })
  },
  previewImageTask: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    });
  }
})