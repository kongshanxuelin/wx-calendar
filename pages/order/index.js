const App = getApp()

Page({
  data: {
    orders:[]
  },
  onLoad() {
    
  },
  onShow() {
    this.onPullDownRefresh()
  },
  getList() {
    var that = this;
    App.HttpService.orderList({
      "token": App.getToken()
    }).then(data => {
      App.log("getList:",data);
      that.setData({
        orders:data
      });
    })
  },
  bindPay:function(e){
    var id = e.target.dataset.orderid;

    var amount = e.target.dataset.amount;
    var price = e.target.dataset.price;
    var fee = (parseInt(amount) * parseFloat(price)).toFixed(2);

    var that = this;
    App.HttpService.prePay({
      "fee": fee * 100,
      body: '商品付款',
      atta: '给' + id + "商品付款",
      "token": App.getToken()
    }).then(pay => {
      //{"timeStamp":"1490059621","package":"prepay_id=wx20170321092705ecef9e1fcd0867209259","nonceStr":"40287d8a5aee78b0015aee7975be0003","paySign":"7FF1AF0C70C97AC082365AC523980A0B"}
      //发起支付
      var timeStamp = pay.timeStamp;
      var packages = pay.package;
      var paySign = pay.paySign;
      var nonceStr = pay.nonceStr;
      var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
      App.pay(param, function (data) {
        if (data.code === 0) {
          App.HttpService.orderStatusChange({
            "token": App.getToken(),
            "id": id,
            "sts": "2"
          }).then(data => {
            that.getList();
          });
        } else {
          App.alert("未完成支付，可到我的订单继续付款");
          //正式环境中去掉
          // App.HttpService.orderStatusChange({
          //   "token": App.getToken(),
          //   "id": id,
          //   "sts": "2"
          // }).then(data => {
          //   that.getList();
          // });
        }
      });
    });
  },
  bindConfirmOrder:function(e){
    var id = e.target.dataset.orderid;
    var that = this;
    App.HttpService.orderStatusChange({
      "token": App.getToken(),
      "id": id,
      "sts": "3"
    }).then(data => {
      that.getList();
    });
  },
  onPullDownRefresh() {
    this.getList()
  }
})