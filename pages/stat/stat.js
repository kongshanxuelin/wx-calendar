//var wxCharts = require('../../utils/wxcharts-min.js')
const App = getApp()
var lineChart;
Page({
    data: {
        index: 0,
        array:[],
        objArray:[]
    },
    getData: function () {
        var that = this;
        var mytagid = this.data.objArray[this.data.index].id;
        App.HttpService.statMyTag({
            "token":App.globalData.token,
            "mytagid":mytagid
        }).then(json => {
            console.log(json);
            if(json && json.res){
                that.setData({
                    shouru:json.stat.shouru,
                    zhichu:json.stat.zhichu
                });
            }
        });
    },
    bindPickerChange: function(e) {
        console.log("pick value change:",e.detail.value);
        this.setData({
            index: e.detail.value
        });

        this.getData(); 
    },
    onLoad: function (option) {
        if(!App.isNetworkConnet()){
            App.alert("需联网访问！");
            return;
        }
        var _id = option.id || "none";
        var mytags = App.getCacheSync("mytags");
        var _arr = [];
        var _arrIds = [];
        var _index = 0;
        for(var index in mytags){
            if(mytags[index].label.indexOf("账")>=0){
                _arr.push(mytags[index].label); 
                _arrIds.push(mytags[index].id); 
            } 
        }  
        for(var i in _arrIds){
            if(_arrIds[i]===_id){
                _index = i;
            }  
        }
        this.setData({
            objArray:mytags,
            array:_arr,
            index:_index
        }); 
        
    },
    onShow:function(){
        this.getData(); 
    },
    isArrayValue:function(arr,dt){
        var j = {};
        for(var i in arr){
            j[arr[i].dt] = arr[i].num;
        }
        if(typeof j[dt] != "undefined"){
            return j[dt];
        }    
        return null;
    }
});