const App = getApp()
Page({
    onLoad: function () {
        this.loadPage(1);
    },
    loadPage:function(p){
        var that = this;
        App.HttpService.listPayThank({
            "p":p
        }).then(page => {
            if(p == 1){
                that.setData({
                    users:page.result
                });
            }else{
                for(var i in page.result){
                    that.data.users.push(page.result[i]);
                }
                
                that.setData({
                    users:that.data.users
                });
                
            }
            that.setData({
                "page":page
            });
        });
    },
    loadmore:function(){
        var p = this.data.page.nextPage;
        this.loadPage(p);
    }
});