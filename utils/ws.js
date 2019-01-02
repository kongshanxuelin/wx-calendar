var url = 'wss://webs.sumslack.com';

function connect(user, func) {

  wx.connectSocket({
    "url": url
  });
  wx.onSocketOpen(function (res) {
    console.log('WebSocket连接已打开！')
  });
  wx.onSocketError(function (res) {
    console.log('WebSocket连接打开失败，请检查！')
  });
  wx.onSocketClose(function (res) {
    console.log('WebSocket 已关闭！')
  });
  wx.onSocketMessage(func);
}


function send(msg) {
  wx.sendSocketMessage({ data: msg });
}
module.exports = {
  connect: connect,
  send: send
}