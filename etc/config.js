export default {


	/* dev 


  domain:'http://192.168.1.154:7680/',
  basePath: 'http://192.168.1.154:7680/restful/',
  uploadPath:"http://192.168.1.154:7680/upload/",
  socketUrl:'ws://localhost:8787/',
*/
	/* production	 */
  socketUrl: 'ws://wx.sumslack.com/socket.io',
	domain:'https://wx.sumslack.com/',
	basePath: 'https://wx.sumslack.com/restful/',
	uploadPath:"https://wx.sumslack.com/upload/",


   mode:"dev",//是否是开发模式
	 version:"5.25.0",
	 appName:"商务工作记事册",
	 appDesc:"日程编排，记事记账，支持语音图片",
	 desc:"Bug Fixed",

   //常用表单ID,针对表单的我的单一的数据
   formid:{
     fapiao:"m3fwnk581s"
   },
	
	 selectColors:[
     "#2F74D0","#BE51BA","#9770C0",
     "#E175AB","#6CA870","#AEB025",
     "#EB7C0E","#C6AE59","#C48484",
     "#D73E68","#7ACC7A","#C40404"
	 ]
	
}