import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$prefix = ''
		this.$$path = {	

			checkLogin	: 'wx/wx_checkLogin.jhtml',

			//绑定邮箱
			getEmailCode: 'wx/getEmailCode.jhtml',
			bindEmailSave:'wx/bindEmailSave.jhtml',

			//获取所有自定义Tags
			tagLastTime	: 'tag/lasttime.jhtml', //传入token,t(mytag,other)
			tagAll		: 'tag/all.jhtml',	
			myTags		: 'tag/mytag.jhtml',	//传入token
			tagHidden: 'tag/sethidden.jhtml', //id,ishidden
			tagRemove	: 'tag/removetag.jhtml', //id
			tagAdd		: 'tag/addtag.jhtml',//t
			tagSave		: 'tag/savetag.jhtml',//t,id,bgcolor
			tagUp		: 'tag/moveup.jhtml',//id
			tagDown		: 'tag/movedown.jhtml',//id
			//获取当前mytagid下的统计信息
			statMyTag		: 'tag/statMyTag.jhtml',//mytagid
			//分享分类二维码给朋友
			mytagshare		: 'tag/mytagshare.jhtml',//tagid
			//初始化mytag
			mytaginit		: 'tag/mytaginit.jhtml',

			taskLastTime: 'task/lasttime.jhtml', 

			getTask		: 'task/getTask.jhtml',
			listTask	: 'task/listMyTask.jhtml',
			addTask		: 'task/addPlainTask.jhtml',
      saveTask  : 'task/saveTask.jhtml',
			removeTask	: 'task/removeTask.jhtml',
			prepay		: 'pay/prePay.jhtml',
			uploadFile	: 'task/uploadFile.jhtml',
			addPayThank	: 'pay/addPayThank.jhtml',
			listPayThank: 'pay/listPayThank.jhtml',

			//feedback
			fb_list		: 'feedback/list.jhtml',
			fb_add		: 'feedback/addFeedback.jhtml',
			fb_remove	: 'feedback/removeFeedback.jhtml',
			fb_reply	: 'feedback/addReply.jhtml',

			//card service
			card_view	: 'card/cardView.jhtml',
      card_save: 'card/saveMyCard.jhtml',

      card_mylist: 'card/myCardList.jhtml',

      card_addview: 'card/view.jhtml',
      card_addsave: 'card/save.jhtml',
      card_addlike: 'card/like.jhtml',
      card_quanpic: 'card/genCardImage.jhtml',

      //eform service
      eform_tmplget:'working/invoke.jhtml',
      working_genqrcode:'working/genQrCode.jhtml',

      //搜索服务
      search_invest_companys: 'search/investCompanys.jhtml',
      search_invest_detail: 'search/investDetail.jhtml',



			//todo list
			todo_add	:  'memo/add.jhtml',
			todo_remove	:  'memo/remove.jhtml',
			todo_alarm	:	'memo/setAlarm.jhtml',
			todo_finish	:	'memo/finish.jhtml',
      todo_restart: 'memo/restart.jhtml',
			todo_list	:	'memo/listDoing.jhtml',
			todo_listFinished:'memo/listFinished.jhtml',
			todo_lasttime	:'memo/lasttime.jhtml',

			//发布动态
      dynaPublish: 'wx/dyna/publish.jhtml',
      dynaList: 'wx/dyna/mylist.jhtml',
      dynaRemove: 'wx/dyna/remove.jhtml',
      dynaLike: 'wx/dyna/like.jhtml',
      dynaAddComment: 'wx/dyna/addComment.jhtml',
      removeComment: 'wx/dyna/removeComment.jhtml',
      dynaGet: 'wx/dyna/get.jhtml',

      //商城接口
      mallGet: 'wx/mall/get.jhtml',
      mallReq: 'wx/mall/reqMall.jhtml',


      //订单相关
      orderAdd: 'wx/order/add.jhtml',
      orderList: 'wx/order/list.jhtml',
      orderStatusChange: 'wx/order/changeStatus.jhtml',

      //试卷相关
      paperGet: 'paper/share.jhtml',
      paperGenImage: 'paper/genImage.jhtml',

        }
	}
	//todo service
	todo_add(params){
    return this.getRequest(this.$$path.todo_add,params)
	}
	todo_remove(params){
		return this.getRequest(this.$$path.todo_remove,params)
	}
	todo_alarm(params){
		return this.getRequest(this.$$path.todo_alarm,params)
	}
	todo_finish(params){
		return this.getRequest(this.$$path.todo_finish,params)
	}
  todo_restart(params) {
    return this.getRequest(this.$$path.todo_restart, params)
  }
	todo_list(params){
		return this.getRequest(this.$$path.todo_list,params)
	}
	todo_listFinished(params){
		return this.getRequest(this.$$path.todo_listFinished,params)
	}
	todo_lasttime(params){
		return this.getRequest(this.$$path.todo_lasttime,params)
	}

	mytaginit(params){
		return this.getRequest(this.$$path.mytaginit,params)
	}
	statMyTag(params){
		return this.getRequest(this.$$path.statMyTag,params)
	}
	taskLastTime(params){
		return this.getRequest(this.$$path.taskLastTime,params)
	}
	tagLastTime(params) {
		return this.getRequest(this.$$path.tagLastTime,params)
	}
	mytagshare(params) {
		return this.getRequest(this.$$path.mytagshare,params)
	}
	getTask(params) {
		return this.getRequest(this.$$path.getTask,params)
	}
	tagAll(params) {
		return this.getRequest(this.$$path.tagAll,params)
	}

	myTags(params) {
		return this.getRequest(this.$$path.myTags,params)
	}

	tagHidden(params) {
		return this.getRequest(this.$$path.tagHidden,params)
	}
	tagRemove(params) {
		return this.getRequest(this.$$path.tagRemove,params)
	}
	tagAdd(params) {
		return this.getRequest(this.$$path.tagAdd,params)
	}
	tagSave(params) {
		return this.getRequest(this.$$path.tagSave,params)
	}
	tagUp(params) {
		return this.getRequest(this.$$path.tagUp,params)
	}
	tagDown(params) {
		return this.getRequest(this.$$path.tagDown,params)
	}

	bindEmailSave(params) {
		return this.getRequest(this.$$path.bindEmailSave,params)
	}

	getEmailCode(params) {
		return this.getRequest(this.$$path.getEmailCode,params)
	}

	checkLogin(params) {
		return this.getRequest(this.$$path.checkLogin,params)
	}

	listTask(params) {
		return this.getRequest(this.$$path.listTask,params)
	}

	addTask(params) {
		return this.postRequest(this.$$path.addTask,params)
	}

	card_view(params) {
		return this.getRequest(this.$$path.card_view,params)
	}

  card_save(params) {
    return this.getRequest(this.$$path.card_save, params)
  }

  card_mylist(params) {
    return this.getRequest(this.$$path.card_mylist, params)
  }

  card_addview(params) {
    return this.getRequest(this.$$path.card_addview, params)
  }
  card_addsave(params) {
    return this.getRequest(this.$$path.card_addsave, params)
  }
  card_addlike(params) {
    return this.getRequest(this.$$path.card_addlike, params)
  }
  card_quanpic(params) {
    return this.getRequest(this.$$path.card_quanpic, params)
  }

  eform_tmpl_mylist(params){
    return this.getRequest(this.$$path.eform_tmplget +'?act=tmpl.mylist', params)
  }

  eform_qrcode(params) {
    return this.getRequest(this.$$path.working_genqrcode + '?act=eform', params)
  }

  qrcode_invest(params) {
    return this.getRequest(this.$$path.working_genqrcode + '?act=invest', params)
  }

  eform_tmpl_get(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.get', params)
  }
  
  eform_tmpl_dataGet(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.data.get', params)
  }

  eform_tmpl_dataAdd(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.data.add', params)
  }

  eform_tmpl_dataSave(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.data.save', params)
  }
  
  eform_tmpl_dataRemove(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.data.remove', params)
  }
  //token,tmplid
  eform_tmpl_myform_existdata(params) {
    console.log("***************",this.$$path.eform_tmplget + '?act=tmpl.myform.data.exist');
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.myform.data.exist', params)
  }
  //token,id
  eform_tmpl_myform_getdata(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.myform.data', params)
  }
  //token,tmplId,tmplIdId
  eform_tmpl_myform_savedata(params) {
    return this.getRequest(this.$$path.eform_tmplget + '?act=tmpl.myform.data.save', params)
  }

  saveTask(params) {
    return this.postRequest(this.$$path.saveTask, params)
  }

	removeTask(params) {
		return this.postRequest(this.$$path.removeTask,params)
	}

	prePay(params){
		return this.getRequest(this.$$path.prepay,params)
	}

	addPayThank(params){
		return this.getRequest(this.$$path.addPayThank,params)
	}

	listPayThank(params){
		return this.getRequest(this.$$path.listPayThank,params)
	}

	//feedback
	fb_list(params){
		return this.getRequest(this.$$path.fb_list,params)
	}
	fb_add(params){
		return this.getRequest(this.$$path.fb_add,params)
	}
	fb_remove(params){
		return this.getRequest(this.$$path.fb_remove,params)
	}
	fb_reply(params){
		return this.getRequest(this.$$path.fb_reply,params)
	}

	putCartByUser(id, params) {
		return this.putRequest(`${this.$$path.cart}/${id}`, params)
	}

	delCartByUser(id) {
		return this.deleteRequest(`${this.$$path.cart}/${id}`)
	}

	clearCartByUser() {
		return this.postRequest(`${this.$$path.cart}/clear`)
	}

	deleteAddress(id, params) {
		return this.deleteRequest(`${this.$$path.address}/${id}`)
	}

  search_invest_companys(params) {
    return this.getRequest(this.$$path.search_invest_companys, params)
  }

  search_invest_detail(params) {
    return this.getRequest(this.$$path.search_invest_detail, params)
  }


	dynaPublish(params) {
    return this.postRequest(this.$$path.dynaPublish, params)
  }	
  dynaList(params) {
    return this.getRequest(this.$$path.dynaList, params)
  }	
  dynaLike(params) {
    return this.getRequest(this.$$path.dynaLike, params)
  }	
  dynaAddComment(params) {
    return this.getRequest(this.$$path.dynaAddComment, params)
  }	
  removeComment(params) {
    return this.getRequest(this.$$path.removeComment, params)
  }	
  dynaRemove(params) {
    return this.getRequest(this.$$path.dynaRemove, params)
  }	
  orderAdd(params) {
    return this.getRequest(this.$$path.orderAdd, params)
  }	
  orderList(params) {
    return this.getRequest(this.$$path.orderList, params)
  }	
  orderStatusChange(params) {
    return this.getRequest(this.$$path.orderStatusChange, params)
  }	
  dynaGet(params) {
    return this.getRequest(this.$$path.dynaGet, params)
  }	
  mallGet(params) {
    return this.getRequest(this.$$path.mallGet, params)
  }	
  mallReq(params) {
    return this.getRequest(this.$$path.mallReq, params)
  }	
  paperGet(params) {
    return this.getRequest(this.$$path.paperGet, params)
  }	
  paperGenImage(params) {
    return this.getRequest(this.$$path.paperGenImage, params)
  }	
}

export default Service