function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatRecordTime(time){
   if(typeof time !== "number" || time<0){
     return time;
   }
   var hour = parseInt(time/3600);
   time = time % 3600;
   var minute = parseInt(time /60);
   time = time % 60;
   var second = parseInt(time);

   return ([hour,minute,second]).map(function(n){
      n = n.toString();
      return n[1]? n: '0' + n;
   }).join(":");
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function dateFormat (date,fmt) {
  var o = {
    "y+": date.getFullYear(),
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "h+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S+": date.getMilliseconds()             //毫秒
  };
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)){
      if(k == "y+"){
        fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
      }
      else if(k=="S+"){
        var lens = RegExp.$1.length;
        lens = lens==1?3:lens;
        fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
      }
      else{
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
  }
  return fmt;
}

function formatNiceTime(publishTime){       
    var d_minutes,d_hours,d_days;       
    var timeNow = parseInt(new Date().getTime()/1000);       
    var d;       
    d = timeNow - publishTime;       
    d_days = parseInt(d/86400);       
    d_hours = parseInt(d/3600);       
    d_minutes = parseInt(d/60);       
    if(d_days>0 && d_days<4){       
        return d_days+"天前";       
    }else if(d_days<=0 && d_hours>0){       
        return d_hours+"小时前";       
    }else if(d_hours<=0 && d_minutes>0){       
        return d_minutes+"分钟前";       
    }else{       
        var s = new Date(publishTime*1000);       
        return (s.getMonth()+1)+"月"+s.getDate()+"日";       
    }       
}    

function formatNullStr(obj){
  if(typeof obj === "undefined"){
    return "";
  }
  if(obj === null){
    return "";
  }
  return obj;
}   

module.exports = {
  formatTime: formatTime,
  dateFormat:dateFormat,
  formatNiceTime:formatNiceTime,
  formatRecordTime:formatRecordTime,
  formatNullStr:formatNullStr
}
