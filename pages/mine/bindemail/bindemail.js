const App = getApp();
var interval;
Page({
  data: {
    code:"",
    email:"",
    phone:"",
    showErrMsg:false,
    errMsg:"",
    sendCodeText:"获取验证码",
    canBind:false
  },
  sendCode:function(){
    if(this.data.sendCodeText!="获取验证码") return;
    var that = this;
    App.HttpService.getEmailCode({
          "token": App.getToken(), 
          email: this.data.email
    }).then(res => {
        console.log(res);
        if(res.res){
          
          this.setData({
            remainTime:60,
            sendCodeText:"60秒",
            trueCode:res.code
          });
          interval = setInterval(function(){
              if(that.data.remainTime>1){
                var remainTime = that.data.remainTime - 1;
                that.setData({
                  remainTime:remainTime,
                  sendCodeText: remainTime + "秒"
                });
              }else{
                clearInterval(interval);
                that.setData({
                  sendCodeText:"获取验证码"
                });
              }
          },1000);  
        }else{
          that.setData({
            showErrMsg:true,
            errMsg:"邮件未投递到对方！"
          });
        }
    });


  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  }, 
  inputEmail:function(e){
    var content = e.detail.value;
    this.setData({
        "email":content
    })
  },
  inputCode:function(e){
    var content = e.detail.value;
    this.setData({
        "code":content
    });
    if(this.data.trueCode && this.data.trueCode === content){
      this.setData({
        canBind:true
      })
    }else{
      this.setData({
        canBind:false
      })
    }
  },
  doBindEmailOK:function(){
     var that = this;
      App.HttpService.bindEmailSave({
           "token":App.globalData.token, 
            email: this.data.email,
            code:this.data.code
      }).then(res => {
          console.log(res);
          that.setData({
            showErrMsg:!res.res,
            errMsg:res.msg
          });
          if(res.res){
            wx.showToast({
              title: "绑定成功！",
              icon: 'success'
            });
          }
      });
  },
  onLoad: function () {
  }
})
