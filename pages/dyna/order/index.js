const App = getApp()
Page({
  data: {
    hidden: !0,
    goodId:"",
    amount:1,
    good: {},
    rn:"",
    ra:"",
    rt:"",
    scope:"",
    totalAmount:0 //总价
  },
  onLoad(option) {
    this.setData({
      goodId: option.id
    });

  },
  bindAmount:function(e){
    var _totalAmount = (parseInt(e.detail.value) * this.data.good.price).toFixed(2);
    this.setData({
      amount:e.detail.value,
      totalAmount: _totalAmount
    });

  },
  onShow() {
    //TODO:根据商品ID获取商品信息确认数量
    var that = this;
    App.HttpService.dynaGet({
      "token": App.getToken(),
      "id": this.data.goodId
    }).then(data => {
      App.log(data);
      that.setData({
        "good":{id:data.goodId,content:data.goodContent,price:data.goodPrice},
        "scope":data.scope,
        "rn":data.rn || "",
        "rt": data.rt || "",
        "ra": data.ra || ""
      });

      that.setData({
        totalAmount: that.data.good.price
      });

    });
  },
  bindName:function(e){
    this.setData({
      rn:e.detail.value
    });
  },
  bindTel: function (e) {
    this.setData({
      rt: e.detail.value
    });
  },
  bindAddr: function (e) {
    this.setData({
      ra: e.detail.value
    });
  },
  chooseLoc: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (obj) {
        that.setData({
          ra: obj.address
        })
      }
    });
  },
  submitOrder:function(){
    var that = this;
    if(that.data.rn === ""){
      App.alert("请输入收货人姓名！");
      return;
    }
    if (that.data.rt === "") {
      App.alert("请输入收货人电话！");
      return;
    }
    if (that.data.ra === "") {
      App.alert("请输入收货人地址！");
      return;
    }
    if(that.data.scope.indexOf("仅限")==0){
      var ss = that.data.scope.substring(2,4);
      if(that.data.ra.indexOf(ss)<0){
        App.alert("配送地址"+that.data.scope);
        return;
      }
      
    }
    App.HttpService.prePay({
      "fee": this.data.totalAmount*100,
      body: '商品付款',
      atta: '给' + this.data.good.id + "商品付款",
      "token": App.getToken()
    }).then(pay => {
      //{"timeStamp":"1490059621","package":"prepay_id=wx20170321092705ecef9e1fcd0867209259","nonceStr":"40287d8a5aee78b0015aee7975be0003","paySign":"7FF1AF0C70C97AC082365AC523980A0B"}
      //发起支付
      var timeStamp = pay.timeStamp;
      var packages = pay.package;
      var paySign = pay.paySign;
      var nonceStr = pay.nonceStr;
      var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
      App.pay(param,function(data){
          App.log("pay finished:",data);
          if(data.code === 0){
            App.HttpService.orderAdd({
              "token": App.getToken(),
              "id": that.data.goodId,
              "amount": that.data.amount,
              "rn":that.data.rn,
              "rt":that.data.rt,
              "ra":that.data.ra,
              "sts":"2",
              "price":that.data.good.price
            }).then(data => {
              App.log(data);
            });
          }else{
            App.HttpService.orderAdd({
              "token": App.getToken(),
              "id": that.data.goodId,
              "amount": that.data.amount,
              "rn": that.data.rn,
              "rt": that.data.rt,
              "ra": that.data.ra,
              "sts": "1",
              "price": that.data.good.price
            }).then(data => {
              App.log(data);
              App.alert("未完成支付，可到我的订单继续付款");
            });
          }
      });
    });
  },
  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '没有收货地址，请先设置',
    })
      .then(data => {
        if (data.confirm == 1) {
          App.WxService.redirectTo('/pages/address/add/index')
        } else {
          App.WxService.navigateBack()
        }
      })
  },
  navMyOrder(){
    App.WxService.navigateTo('/pages/order/index');
  },
  getAddressDetail(id) {
    
  },
  addOrder() {
    const address_id = this.data.address_id
    const params = {
      items: [],
      address_id: address_id,
    }
    this.data.carts.items.forEach(n => {
      params.items.push({
        id: n.goods._id,
        total: n.total,
      })
    })
    console.log(params)
    App.HttpService.postOrder(params)
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          App.WxService.redirectTo('/pages/order/detail/index', {
            id: data.data._id
          })
        }
      })
  }
})