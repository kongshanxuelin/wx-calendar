import { $wuxButton } from '../../components/wux'
const App = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {}, // 存放用户信息
    userId:"",
    scrolltop: 20, // 滚动轴TOP
    p:1,//当前滚动的页码
    dz_id:"",
    zan:"点赞",
    commentInput:"添加评论",
    commentFocus:false,  //评论输入框获取焦点
    showComment:false, //是否显示评论区
    animationData: {},
    animationData1: {}, // 发布按钮下滑动画
    page: {}, // 分页的对象，内含列表
    hasNext:false,
    nextPage:1,
    height:0,//高度
    cz_flag: false, // 控制点赞评论按钮
    cz_right: 0, // 点赞评论定位right
    cz_top: 80, // 点赞评论定位top
    cz_pinglunbox:80,
    animationData: {},
    animationData1: {}, // 发布按钮下滑动画
    animationData2: {} // 位置按钮下滑动画
  },
  bindAdd:function(){
    App.WxService.navigateTo('/pages/dyna/publish/index');
  },
  showList:function(cb){
    var that = this;
    App.HttpService.dynaList({
      "token": App.getToken(),
      "p": this.data.p
    }).then(json => {
      console.log("showlist:",json);
      if(typeof cb === "function"){
        cb();
      }
      if (json.page.result != null && json.page.result.length>0){
        for (var ii in json.page.result){
            var _item = json.page.result[ii];
            _item.niceTime = util.formatNiceTime(_item.dt);
            if (_item.uid === that.data.userId){
              _item.showDelete = true;
            }else{
              _item.showDelete = false;
            }
            if(_item.imageList && _item.imageList.length>0){
              for (var jj in _item.imageList){
                var _item2 = _item.imageList[jj];
                _item2.path = App.Config.uploadPath + _item2.path;
                _item2.spath = App.Config.uploadPath + _item2.spath;
                _item.imageList[jj] = _item2;
              }
            }
            json.page.result[ii] = _item;
        }
      }
      if(that.data.p <= 1){
        that.data.page.result = json.page.result;
        //缓存第一页内容
        App.setCacheAsyn("dynsList", json.page);
      }else{
        that.data.page.result = (that.data.page.result||[]).concat(json.page.result);
      }
      that.setData({
         page: that.data.page,
         hasNext:json.page.hasNext,
         nextPage: json.page.nextPage
      });
    });
  },
  initButton(position = 'bottomRight') {
    var that = this;
    this.button = $wuxButton.init('br', {
      position: position,
      buttons: [
        {
          label: '商务合作',
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeElEQVRYR+2W71FTURDFz6kArACtQKhArUCoQFKBWoFQgVKBUoGxAqUCsQKwAqGCdX6ZvczmvZuXiB/yJTuTmdy/e/bs2b3P2rJ5y/61A7BjoMtAROxLupF0Lenc9o/HiDUiXkr6IGnf9lHvjlUAzvIgZ+5tA2hkEfFU0kEu/LZ9WzdFRJTxzPaX4SUjACX65vRCEgdfDw4THb9qMAZbALmS9E7Sm9xwa/vZJgBOJX0uGznEHM4A9XzDdABklqlsR0Ys9BgAfaP10jbOFxYRnyS93RAA28j7JAtLACJiFH3Na0RUcDiAZmjn3F4H2KUk9ISguywMAayMPhmoorqyvdBARBxm7nsgSCEgulp4ALBB9Dj7viqSrIh5RyOTLFQANfpvto8HJcX4a85d2Ca3S5YVhPiGQoUFKunFsCIqgCqwV5Ko8bntuyJC5u7qXE+QEYGzRjlbYIE5GLznfwtgqAEcHNqe5yV7tk/WqT7Td2D7fEXFLJpZdsbrGsDKxyjpROE/EZhtGlLXci8RUr4nrXKKrrop47LJ1zAiakvmYkQ2zPtDWiICXfA7a203QTBm38imGKC0iL4Zzolk6WGKCMRJ9MesZUkypvbphBhtuPueTAGo0VfkR7ZJzYMVp4is6QBRN9Xzoo4eoskU5KVcQhXUhwjnCzYksX6D+FIHjClBIqes/0h6MlU1a7+IEkhNRYv8fVK/JL7UwccEQD8Z9YvK3loAbM48IyLSUtst9TxLsfJIsU6ueYRO1/WLtVXQUTwCJK+/SrcjJaSJBtMM1S/ppFcB/wygXZKM0JbpcOiBT66uyFY5bvMbpWDdJf+zvgOwY2DrDPwFqjsWMBrl7sgAAAAASUVORK5CYII=",
        },
        {
          label: '发布采购',
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACuklEQVRYR72Xj1ETURDGv61AqUCpQKhAqUCoAKhAU4FJBUIFSgWaCgwVIBUoFYgVrPPL7GZeLvfuXkhwZ5ibHO/tfvvv2z3TluLuR5JeSeJZyk9JD2bGs1ms5aS7v5N0Lonn65E7vyUtJF23gBkE4O4Y+yTpogVoz5mvkmZmBqheqQJwd4x+lvTyicbz2qOkiZkBZkN6Abj7NDzf0fba9amZzboKNwC4+5WkD/u0XOiiLj6WutcARNi/PJPxVHtZpmMFINrr7pmNp/rj7JASAK3z9j8BWJjZCbaWAKLPf2xh/K+kknAAj/COqufJH4RVkxMzWySAMe9vzKyXCyJ1L6JdYUfaliccMkRaczM7NXfnwp8R79MrjqUBokBvdzuG91Q63QSwITkAAJ61VP5NGCxTdRCGoOkUeh1gFPQYiZ0BoJV0iMJhx+BEEjT7Law/RPgB8L6hpmYA4HDpwdA9vPse3nGO2uE34UbOwuuWiHL+GgBjBVgCwlsikaMYQNwnLbzP3I+FPnXetgLY4PDQgHFA1aYl43uIW5oBoKgrLB+rMRtc4p1DABsa5fNtirDUveSF4IB8T1pac7/qGACQN+Z+q6Rxije3H7qADjndEsQEALDVr0brbDfTonPKIoR64XciAbghGk5zh0nFeDJ0YR4VTqUTZjxFSgD8Rg/jdhGRhWNqbHhvZkcJYIiMUHocCynGyxbrAkjP4IbLKMBaepfRTAAoxVANLf/rGyw1AAAhWjU+WDKmmT2W+0DrTGgsl8Fjq62ou5IRuhYO3wXE2mjvAiBksNubXSwM3L2nlgh9nunbisk1kdg3iA3jgKh9FxAJQOxrR6SNL0rPqxEowxe7Akw5ttnUos52dEW71Q6MfpzGyoYCuqQVSK5rfA2t8t0HYhRAJyIwIJMx94FM0W2cg45ZuUlfk/wDF10EwjEaXmAAAAAASUVORK5CYII=",
        },
        {
          label: '发布供应',
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACvklEQVRYR8WXMW4UQRBF/xcHAFISICE1lsjxigNg50iARIhkfAJMRoa5gZ0jgU8A5EgYiZzlBiCRF3qj6lXveHanZ7WIljbZ6en69av+rx7rPy9PiR8R1yTdl3RX0oWkz7Z/TTmjv7cZQEQQ9L2kW9Uhc0kHtgGz0WoCkJn/kPRT0r7teUQA5IOkm5Jub8pEK4AXkt5kILLuVoIA2JHtk00oaAVwSt1tU4alFRHQf2H7yb8EcCzp0Pb1AQA04Ylt9kxerQzsSfqYgY6qEsDM435ppqBoApD1Ln0A5WSNJCnJxvXn3GYACQImqDUKoBlPbX8aKAvPYQaQ7DtbpZJJAFqojYjC1O8MvpOMzYb8YqsAIqL0Chl3qqj84qqk3T4T2wYwKNfKL3BNzGuxtg2g6wfbMNH3i5D0qi/XbQOAgR3bu3X0tQxUTVO/w5S7lMVYE1Y9gDF1fpHBGWKYGG66ND0dETjYS0mzDPBc0oMct1A6aexWCRGId0kERewNqqAAsN2VIyJeS3om6XsaDd3Lgl5MZ3T+5+jeT78ABH4x+N6CgQoAjIC2K0F1GPqmkQb1PFaeVc9HAVS+X+Y/xnLJ/bgb2H47FUgzgGQDa2Xu17ciHvE/wL5IgsE/a4B8q8sxCcC67CKCmr+TdKWBBczoKUC2BiAZKlbM4TRt34yYnvxg8avtWTOA1PPDpHtdkjQrNK/0kUqqB1MAlCnXwHB3XR+yYwYUSVAu1koAjyTda9H8GJqU8WEGpVm5WVMCVDOvnbBI646kGznDjzeRVl7juZCQMTXHCWk8LHrpGwIA0AG99WITUoMubjQAOWvIlrMIXCg+z0wvNWQ5a+00zOGCrvkc64BIOq9Lk80JxWRbKCYg9rv4hljphGNZVfIqQIZeKRQP3hHXxZh0H8hs+x8gZElDjQ6pISCTALSwNXXPX8t3YsorpMTDAAAAAElFTkSuQmCC",
        },
        {
          label: '发布招聘',
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADQ0lEQVRYR7WXjVUVQQyFbyoQKxArUCsQKhArACpQKxAqkA6UCoAKlArECtQKhAri+dbMmN2d2bcPdM555723P8mdm+QmY9piufuBpJeSnkvaiW8sfAkzN/w2s6u1Zm3Tg+6Oow+ScM7vO0k4+hEfTOzGB2CPJN1K+iTp1Mz43V2LANz9RNIbSTyHwUszK7ttGnX3vQDLezg/M7PTHoImgNj156D4XNKJmbHj1cvdYYUNHAZj+y02ZgDcHRpxzr2DTTvehCjyBvZ+SXptZoSvrhGA2Pl3ST8lHU0f3uSsdz82dSnJJb3ITEwBgA7q9v6V8wIqQJA/X81sv1yvACLh3ksiVouJtrDTM+JtZlA+WxGOi6gO8mOIsxL1V2Z2lFBj8FnH4fnUkbsDHB0YjHdAAO6VpKeEogDgInW+m+Pj7oDBGBVQWIElKoN3uIcwLS20oAKK6iDPhusFwCAcZvZ2amm6K3cnkYYwNe6NGOgx4u4we2hmjy3FhewclUiEZ2p0CoDdlJgPOTD5T1hHIRn5dPeBfjNDZluJA4AnSXZRuszAViFI+fWH9aBJZobhHgCu5xx4UAgSswJA6WCz+P+vEIRdhGkHAMR0lKmZhhVJiHD1+gSyTjOalWXRnbUAejmAg9teowr1a97PANaEYJYDoQGwt2a1RKuGYEiuDUlY1a3oAP0iPPNNGJryG8/w/kjea/JnUViogimA49D8mzAEEy35ves1NXevZYgE0yCWhIheTqjYbdn5NayFIcaw1hqeaajrX59REk0pjhItzYgZARA0kndmhup115K+ZPHLzQjDsFBLKiQTcLTYYbjMvWADAMAyQ05lmHyZNSNkGMe8UNtxJydqL0iyilFKtayh/iUdN1r2qPNuPZC0GEjNJWO+jh5Tx/LuQJJ2Am3sBK2fdcYIAZTSunOo8iGFx2rIku0y7H7LidkaSnFM1kNfE8Qa5cnPpEmbRGberKz0xnJUitJijL7XfJh2Tsl9jBMVbb8/lqeXoBTHlGA5Yt3nYML4RlLP8qH4WnM0o02T+eVohrGl+i8HWN7jHNnshqsARNLBBiWF4XLwXDqclgPsMLQ+6HDakVCklYxmlXGssFLEZ3Xe/AYFvT6fo1+33AAAAABJRU5ErkJggg==",
        },
        {
          label: '免费开微店',
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC7ElEQVRYR7WX71EUQRDFX0cgGYgRgBHABWABEQgRaAZIBGoEchEoESgZQACWEIFQ5fe2fkv31dzc7u2fu5svFLs7069fv349Z5q43P1Q0vfYfmZmd1OOsimb3P1U0jdJud8lzaaAGA3A3c8j+LOk40jgl6RXki7M7HpMUqMAFMHvJZ2a2QPBohwEPhgLYjCAKvixmT2Vmbr7niSYGAViEIC+4AlkCoheAO7+QdIXSdC+knld77Eg1gJwd5SO6AYF72Di2swuuoTZCaAIPpf0sa55n9KDiR+SjiR1gmgFUAY3MxiYvNyd7njfBWIFwDaDFyXpBLEEYBfB+0A0AKJePyXh7/NNae+qV1EO/IL58WRV8Csz+zS54AM2ujstTWszvGYAyPqs9fEAulfYL863Xw4gd9+XxDdrJ2NhbHMAMMluzIwJ17ncnUNf4/WSmAF8f2lmnAFrJEJ2JzzrI8PdKcMRm/Ng2g1/v2/x+aTtCk8Iz2dfAiAJ3gGKWcCU5O9vSf9awMAeZz4DAOHlOOXbBzN7U6iXwxBo44aS/kb9AABonrEfAJd9mRfvGefnZRcABFQHJYVRV56TeU48Zn+9bsP1cE7OgoF3HQyw967pgmqkvtSlpYaFWGfFRaTcjgBxvLMAe2hmAF67BgEIFv5IIktK0HYwWfM8AcjM8sbUCWIoAIbKCSYVQmsrQQZBC2gDLW0OwN1ThARojCqEmyAQE22JRgiMOAG70tph9bflvbGXgeq+R3a06ueK07eYj7vn+KUUK64angOABTO9AGJWJAsAYNFulAPhMe+pO6qHjQTXgKpEjl9sDCDVjldAOWAoAc9xSW5Rj2bG/0trWwzARtOqYcFpPjdRHlqRtRMGvsYka2gMgVJ3qEYbiO8xZsbLtCuu79tgIN1uaXLW13ZJDCdGbv3dNA2EEGkzsmUE45iLFZ1Cabh8Nj9Ygp3GbvPDIQzk3WBXlxLOXbpx1W1YT8Y+Kx/7njblN+WCwf8pyLvwkAbujwAAAABJRU5ErkJggg==",
        }
      ],
      buttonClicked(index, item) {
        if (index == 4) {
          App.WxService.navigateTo('/pages/mall/index');
        }else{
          App.WxService.navigateTo('/pages/dyna/publish/index?index=' + index);
        }
        return true
      }
    })
  },
  onLoad: function () {
    this.initButton();
    var that = this;
    this.setData({
          userInfo: App.globalData.userInfo,
          userId:App.getCacheSync("id")
    });
    //console.log("onload:",this.data.userInfo,this.data.userId);
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });

    App.getCacheAsyn("dynsList",function(res){
      console.log("get cache:",res);
      if(res.data && res.data.length>0){
        that.setData({
          page: res.data,
          hasNext: res.data.hasNext,
          nextPage: res.data.nextPage
        });
      }
    });
  },
  onShow:function(){
    this.setData({
      p:1
    });
    this.showList();
  },
  donghua: function (topNum) // 发布按钮动画
  {
    var that = this
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
    });
    animation.opacity(0).translateY(topNum + 5).step()
    that.setData({
      animationData1: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).step()
      that.setData({
        animationData1: animation.export()
      })
    }, 1500)
  },
  onPullDownRefresh: function () { //下拉刷新
    console.log("pulldown refresh trigger..")
    var that = this;
    this.setData({
      p: 1
    });
    this.showList(function(){
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom:function(){
    if (this.data.hasNext){
      App.log("onreachebottom");
      this.setData({
        p: this.data.nextPage
      });
      this.showList();
    }
  },
  bindGoMall:function(e){
    var mallId = e.target.dataset.id;
    //App.WxService.navigateTo('/pages/mall/index?id=' + mallId);
    wx.navigateToMiniProgram({
      appId: 'wx25c8a13b10b2d895',
      extraData: {
        "mallId": mallId
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  bindBook:function(e){
    var id = e.target.dataset.id;
    App.WxService.navigateTo('/pages/dyna/order/index?id='+id);
  },
  bindDele: function (e) { //删除文章
    var id = e.target.dataset.id;
    var that = this
    wx.showModal({
      content: '您确定要删除么？',
      success: function (res) {
        if (res.confirm) {
          App.HttpService.dynaRemove({
            "token": App.getToken(),
            "id": id
          }).then(json => {
            if(json.ret){
              that.renderQuan(id);
            }
          });
        }
      }
    });
  },
  renderQuan: function (id){
    var that = this;
    var ss = this.data.page.result;
    if (typeof ss === "object") {
      ss.forEach(function (elem, index) {
        if (elem.id === id) {
          var removed = ss.splice(index, 1);
        }
      });
      this.data.page.result = ss;
      this.setData({
        page: that.data.page
      });
    }
  },
  renderQuanRemoveComment:function(id,cid){
    var ss = this.data.page.result;
    if (typeof ss === "object") {
      ss.forEach(function (elem, index) {
        if (elem.id === id) {
          if (elem.comments && elem.comments.length>0){
            elem.comments.forEach(function (comm, index2) {
              if(comm.id === cid){
                var removed = elem.comments.splice(index2, 1);
              }
            });
          }
        }
      });
      this.data.page.result = ss;
      this.setData({
        page: this.data.page
      });
    }
  },
  renderQuanAddComment: function (id, thisComm) {
    var ss = this.data.page.result;
    if (typeof ss === "object") {
      ss.forEach(function (elem, index) {
        if (elem.id === id) {
          if (elem.comments && elem.comments.length > 0) {
              elem.comments.push(thisComm);
          }else{
              elem.comments = [thisComm];
          }
        }
      });
      this.data.page.result = ss;
      this.setData({
        page: this.data.page
      });
    }
  },
  previewImage: function (e) { // 展示图片
    var current = e.target.dataset.src;
    console.log(e.target.dataset.count);
    var count = [];
    for (var index in e.target.dataset.count){
      count.push(e.target.dataset.count[index].path);
    }
    wx.previewImage({
      current: current,
      urls: count
    });
  },
  bindAddCommentBlur:function(){
    this.setData({
      showComment: false,
      commentFocus: false
    });
  },
  bindAddComment:function(e){
    var that = this;
    var content = e.detail.value;
    App.HttpService.dynaAddComment({
      "token": App.getToken(),
      "id": this.data.dz_id,
      "content": content
    }).then(json => {
      App.log("bindAddComment", json);
      that.setData({
        showComment: false,
        commentFocus: false,
        commentContent: ""
      });
      that.renderQuanAddComment(that.data.dz_id,json.comment);
    });
  },
  bindPingLunA:function(e){
    var offsetTop = Math.floor(e.currentTarget.offsetTop);
    this.setData({
      showComment: true,
      commentFocus: true,
      commentInput: "添加评论",
      cz_pinglunbox: offsetTop + this.data.height
    });
  },
  bindPingLunB:function(e){
    var that = this;
    var commId = e.target.dataset.id;
    var fid = e.target.dataset.fid;
    //评论创建者
    var uid = e.target.dataset.create_uid;

    var offsetTop = Math.floor(e.currentTarget.offsetTop);
    App.log(offsetTop, this.data.height);
    this.setData({
      cz_pinglunbox: offsetTop + this.data.height
    });
    App.log("pinglunb:", uid,App.globalData.user);
    if(this.data.userId === uid){
      wx.showActionSheet({
        itemList: ['删除'],
        success: function (res) {
          if (res.tapIndex == 0){
            App.HttpService.removeComment({
              "token": App.getToken(),
              "id": commId
            }).then(json => {
              App.log("removeComment", json);
              that.renderQuanRemoveComment(fid, commId);
            });
          }
        }
      })
    }else{
      //App.log(commId,fid);
      this.setData({
        showComment: true,
        commentFocus: true,
        commentInput: "回复评论"
      });
    }
    
  },
  bindCaoZuo: function (e) {
    var that = this
    var dz_id = e.currentTarget.dataset.id;
    var offsetTop = Math.floor(e.currentTarget.offsetTop);
    that.setData({
      dz_id: dz_id,
      cz_top: offsetTop,
      cz_flag: true
    });
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 0,
    });
    setTimeout(function () {
      animation.right(40).opacity(1).step()
      that.setData({
        animationData: animation.export()
      })
    }, 300)
    var timeout = setTimeout(function () {
      animation.top(0).right(0).opacity(0).step();
      that.setData({
        animationData: animation.export()
      });
    }, 5000);
  },
  bindDianZan: function (){
    App.HttpService.dynaLike({
      "token": App.getToken(),
      "id": this.data.dz_id,
      "sts": "like"
    }).then(json => {
      App.log("bindDianZan", json);
    });
  }
})
