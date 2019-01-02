const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mall:{},
    id:"",
    reqInfor:{title:"",tele:"",appid:"",secret:"",mchid:"",mchsec:""}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // this.setData({
    //   id: options.id
    // });
    // App.HttpService.mallGet({
    //   "token": App.getToken(),
    //   "id": this.data.id
    // }).then(json => {
    //   App.log("mall:",json);
    //   that.setData({
    //     mall:json
    //   });
    // });
  },
  bindInput:function(e){
      var v = e.detail.value;
      var name = e.currentTarget.dataset.name;
      var _data = this.data.reqInfor;
      _data[name] = v;
      this.setData({
        reqInfor:_data
      });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  doOK: function () {
    console.log(this.data.reqInfor);
    this.data.reqInfor.token = App.getToken();
    App.HttpService.mallReq(this.data.reqInfor).then(json => {
      console.log(json)
      if(json.ret){
        App.alert("申请已成功提交！");
      }else{
        App.alert(json.msg);
      }
    });
  }
})