'use strict';
var uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
const dba = db.collection('mdsh-assist') //跑腿
const dbuser = db.collection('uni-id-users') //用户
const dbbill = db.collection('mdsh-user-bill') //用户账单
exports.main = async (event, context) => {
	const {
		token
	} = event
	
	var userinfo;
	var uid;
	
	if (event.token) {
		var payload = await uniID.checkToken(event.token)
		if (payload.code > 0) {
	
		} else {
			uid = payload.uid
			var user = await uniID.getUserInfo({
				uid: uid
			})
			userinfo = user.userInfo
		}
	}
	
	var res;
	var skip;
	var limit = 10;
	switch (event.funct) {
		case "assist-list": //跑腿订单列表
			skip = (event.page - 1) * limit;
			if (userinfo=='') {
				return {
					code: -2,
					message: '请登录'
				}
			}
			event.form.school_id = userinfo.school_id;
			res = await dba.where(event.form).skip(skip).limit(limit).orderBy("create_date", "desc").get()
			return res.data
			break;
		case "user-assist-list": //用户跑腿订单列表
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			event.form.uid = uid;
			skip = (event.page - 1) * limit;
			res = await dba.where(event.form).skip(skip).limit(limit).orderBy("create_date", "desc").get()
			return res.data
			break;
		case "user-assist-del": //用户删除跑腿订单
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			res = await dba.where({
				_id: event.id,
				uid: uid,
				del: false
			}).get()
			if (res.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}
			var orderInfo = res.data[0]
			if (orderInfo.is_pay && !orderInfo.is_refund) {
				return {
					code: -2,
					message: '请先申请退款'
				}
			}
			if (orderInfo.status == 2) {
				return {
					code: -2,
					message: '已接单'
				}
			}
			if (orderInfo.status == 3) {
				return {
					code: -2,
					message: '已完成'
				}
			}
			await dba.where({
				_id: event.id,
				uid: uid
			}).update({
				del: true,
				del_time: Date.parse(new Date())
			})
			return {
				code: 0,
					message: '删除成功'
			}
			break;
		case "assist-release": //跑腿发布
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
				minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
				second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
			month >= 1 && month <= 9 ? (month = "0" + month) : "";
			day >= 0 && day <= 9 ? (day = "0" + day) : "";
			var timer = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
			const outTradeNo = timer + Math.round(Math.random() * (999999 - 111111) + 111111);

			const orderResult = await dba.add({
				uid: uid,
				des: event.form.des,
				user_name: userinfo.nickName,
				avatarUrl: userinfo.avatar,
				type: event.form.type,
				status: 1,
				pay_money: event.form.price,
				phone: event.form.phone,
				uname: event.form.uname,
				address: event.form.address,
				hide_content: event.form.hide_content,
				view: 1,
				arrive_time: event.form.arrive_time,
				order_id: outTradeNo,
				create_date: Date.parse(new Date()),
				is_pay: false, // 1 - 未支付，2 - 已支付
				is_refund: false,
				del: false,
				school_id: userinfo.school_id
			})
			if (!orderResult.id) {
				return {
					code: -2,
					message: '创建订单失败，请稍后再试'
				}
			}

			return {
				orderResult
			}
			break;
		case "assist-detail": //跑腿详情
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			
			res = await dba.where({
				_id: event.id,
				del: false
			}).get()

			if (res.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}
			return res.data
			break;
		case "assist-receipt": //跑腿用户确认送达
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}

			res = await dba.where({
				_id: event.id,
				uid: uid,
				del: false
			}).get()

			if (res.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}
			var orderInfo = res.data[0]
			if (!orderInfo.is_pay) {
				return {
					code: -2,
					message: '未支付'
				}
			}
			if (orderInfo.status == 1) {
				return {
					code: -2,
					message: '未接单'
				}
			}
			if (orderInfo.status == 3) {
				return {
					code: -2,
					message: '已完成'
				}
			}
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '已退款'
				}
			}
			await dba.where({
				_id: event.id
			}).update({
				status: 3,
				finish_time: Date.parse(new Date())
			})
			await dbuser.where({
				_id: orderInfo.join_uid
			}).update({
				balance:dbCmd.inc(orderInfo.pay_money)
			})
			await dbbill.add({
				uid: orderInfo.join_uid,
				cid: orderInfo._id,
				type: 1,
				from: 2,
				money: orderInfo.pay_money,
				create_date:Date.parse(new Date())
			})
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "assist-receipt",
					id: id
				}
			})
			return {
				code: 0,
					message: '订单完成'
			}
			break;
		case "manage-assist-list": //业务员订单列表
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			
			if (!userinfo.is_assist) {
				return {
					code: -2,
					message: '请先成为业务员'
				}
			}
			skip = (event.page - 1) * limit;
			event.form.join_uid = uid;
			res = await dba.where(event.form).skip(skip).limit(limit).orderBy("create_date", "desc").get()
			return res.data
			break;
		case "manage-assist-taking": //业务员接单
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			
			if (!userinfo.is_assist) {
				return {
					code: -2,
					message: '请先成为业务员'
				}
			}
			res = await dba.where({
				_id: event.id,
				is_pay: true,
				is_refund: false,
				del: false
			}).get()

			if (res.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}
			var orderInfo = res.data[0]
			if (orderInfo.school_id != userinfo.school_id) {
				return {
					code: -2,
					message: '无法跨校接单'
				}
			}
			if (orderInfo.status == 2) {
				return {
					code: -2,
					message: '已接单'
				}
			}
			if (orderInfo.status == 3) {
				return {
					code: -2,
					message: '已完成'
				}
			}
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '已退款'
				}
			}
			await dba.where({
				_id: event.id
			}).update({
				status: 2,
				join_uid: uid,
				join_user_phone: userinfo.phone,
				join_user_name: userinfo.real_name,
				join_avatarUrl: userinfo.mobile,
				join_time: Date.parse(new Date())
			})
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "manage-assist-taking",
					id: id
				}
			})
			return {
				code: 0,
				message: '接单成功，请尽快送达'
			}
			break;
	}
};
