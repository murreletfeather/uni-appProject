'use strict';
const crypto = require('crypto')
const db = uniCloud.database()
let uniID = require('uni-id')
const dbCmd = db.command
const dbp = db.collection('mdsh-store-product') //商品
const dborder = db.collection('mdsh-order') //订单
const dbs = db.collection('mdsh-store') //商铺
const dbuser = db.collection('uni-id-users') //用户
const dbbill = db.collection('mdsh-user-bill') //用户账单
exports.main = async (event, context) => {
	uniID = uniID.createInstance({
		context
	})
	const {
		num,
		cid,
		id,
		take_user,
		take_phone,
		take_address,
		remarks,
		funct,
		token
	} = event
	const payload = await uniID.checkToken(token)
	if (payload.code > 0) {
		return {
			code: -2,
			message: '用户身份验证失败，请重新登录'
		}
	}
	const uid = payload.uid
	var user = await uniID.getUserInfo({
		uid: uid
	})
	const userinfo = user.userInfo
	
	var res;
	var skip;
	var limit = 10;

	switch (funct) {
		case "order-add":
			let arr =event.list
			
			// let ids = [];
			// let nums = [];
			// let num=0;
			// arr.forEach((food) => {
			// 	ids.push(food._id)
			// 	nums.push(food.count)
			// 	num+=food.count
			// })
			// const prod = await dbp.where({
			// 	_id: dbCmd.in(ids),
			// 	status: true
			// }).field({
			// 	'name': true,
			// 	'price': true,
			// 	'stock': true,
			// 	'school_id':true,
			// 	'cover':true,
			// 	'store_id': true,
			// }).get()
		
			if (arr.length<1) {
				return {
					code: -2,
					message: '商品不存在'
				}
			}
			//const goodsList = prod.data
			
			
			function accMul(arg1, arg2) {
				let m = 0,
					s1 = '',
					s2 = '';
				if (arg1 && arg1 != null)
					s1 = arg1.toString();
				if (arg2 && arg2 != null)
					s2 = arg2.toString();
				try {
					m += s1.split('.')[1].length
				} catch (e) {}
				try {
					m += s2.split('.')[1].length
				} catch (e) {}
			
				return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
			}
			function getAllPrice() {
				let result = 0;
				let result1 = 0;
				arr.forEach((food) => {
					result1 += accMul(food.count, food.price)
					result = result1.toFixed(2);
				})
				return result
			}
			function getAllCount() {
				let result = 0;
				arr.forEach((food) => {
					result += food.count
				})
				return result
			}
			let totalFee=getAllPrice();
			// for (var i=0;i<goodsList.length;i++) {
			// 	if (goodsList[i].school_id != userinfo.school_id) {
			// 		return {
			// 			code: -2,
			// 			message: '无法跨校下单'
			// 		}
			// 	}
			// 	if (arr[i]._id== goodsList[i]._id) {
			// 		if (arr[i].count> goodsList[i].stock) {
			// 			return {
			// 				code: -2,
			// 				message: '库存不足'
			// 			}
			// 		}
			// 		goodsList[i].count=arr[i].count
			// 		totalFee+=goodsList[i].price * arr[i].count;return totalFee
			// 	}
			// }
			
			//totalFee=totalFee.toFixed(2);
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
		
			const orderResult = await dborder.add({
				uid: uid,
				order_id: outTradeNo,
				pay_money: totalFee,
				ids: arr,
				store_id: arr[0].store_id,
				school_id:arr[0].school_id,
				status: 1,
				del: false,
				//cate_id: goodsDetail.cate_id,
				num: getAllCount(),
				is_refund: false,
				take_user: take_user,
				take_phone: take_phone,
				take_address: take_address,
				remarks: remarks,
				create_date: Date.parse(new Date()),
				is_pay: false // 1 - 未支付，2 - 已支付
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
		// case "order-add":
		// 	// 获取订单中的商品信息
		// 	const prod = await dbp.where({
		// 		_id: cid,
		// 		status: true
		// 	}).field({
		// 		'name': true,
		// 		'price': true,
		// 		'stock': true,
		// 		'store_id': true,
		// 	}).get()

		// 	if (prod.data.length !== 1) {
		// 		return {
		// 			code: -2,
		// 			message: '商品不存在'
		// 		}
		// 	}
		// 	const goodsDetail = prod.data[0]
			
		// 	if (goodsDetail.school_id != userinfo.school_id) {
		// 		return {
		// 			code: -2,
		// 			message: '无法跨校下单'
		// 		}
		// 	}
			
		// 	if (goodsDetail.stock < num) {
		// 		return {
		// 			code: -2,
		// 			message: '库存不足'
		// 		}
		// 	}
			
		// 	//计算总金额
		// 	const totalFee = goodsDetail.price * num;

		// 	var date = new Date(),
		// 		year = date.getFullYear(),
		// 		month = date.getMonth() + 1,
		// 		day = date.getDate(),
		// 		hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
		// 		minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
		// 		second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		// 	month >= 1 && month <= 9 ? (month = "0" + month) : "";
		// 	day >= 0 && day <= 9 ? (day = "0" + day) : "";
		// 	var timer = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
		// 	const outTradeNo = timer + Math.round(Math.random() * (999999 - 111111) + 111111);

		// 	const orderResult = await dborder.add({
		// 		uid: uid,
		// 		order_id: outTradeNo,
		// 		pay_money: totalFee,
		// 		cid: goodsDetail._id,
		// 		store_id: goodsDetail.store_id,
		// 		school_id:goodsDetail.school_id,
		// 		status: 1,
		// 		del: false,
		// 		cate_id: goodsDetail.cate_id,
		// 		num: num,
		// 		is_refund: false,
		// 		take_user: take_user,
		// 		take_phone: take_phone,
		// 		take_address: take_address,
		// 		remarks: remarks,
		// 		create_date: Date.parse(new Date()),
		// 		is_pay: false // 1 - 未支付，2 - 已支付
		// 	})
		// 	if (!orderResult.id) {
		// 		return {
		// 			code: -2,
		// 			message: '创建订单失败，请稍后再试'
		// 		}
		// 	}

		// 	return {
		// 		orderResult
		// 	}
		// 	break;
		case "order-info":
			res = await dborder.aggregate()
				.lookup({
					from: 'mdsh-store-product',
					localField: 'cid',
					foreignField: '_id',
					as: 'product',
				}).match({
					uid: uid,
					del: false,
					_id: id
				}).end()
			if (res.data.length != 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}
			return res.data
			break;
		case "user-order-list": //用户订单列表
			skip = (event.where.page - 1) * limit;
			res = await dborder.aggregate()
				.lookup({
					from: 'mdsh-store',
					localField: 'store_id',
					foreignField: '_id',
					as: 'store',
				}).match({
					uid: uid,
					del: false,
					status: event.where.status,
					is_pay: event.where.is_pay
				}).skip(skip).limit(limit).sort({
					create_date: -1
				}).end()
			return res.data
			break;
		case 'user-apply-refund': //用户申请退款
			var res = await dborder.where({
				_id: id,
				del: false,
				uid: uid
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
					message: '订单未支付'
				}
			}
			if (orderInfo.status == 2) {
				return {
					code: -2,
					message: '订单已配送'
				}
			}
			if (orderInfo.status == 3) {
				return {
					code: -2,
					message: '订单已完成'
				}
			}
			if (orderInfo.status == 4) {
				return {
					code: -2,
					message: '订单退款中'
				}
			}
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '订单已退款'
				}
			}
			await dborder.where({
				_id: id,
				uid: uid
			}).update({
				status: 4,
				refund_apply_time: Date.parse(new Date()),
				refund_money: orderInfo.pay_money,
				refund_res: event.refund_res
			})

			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "user-refund",
					id: id
				}
			})

			return {
				code: 0,
					message: '申请成功，等待处理'
			}
			break;
		case 'user-confirm': //用户确认收货
			var res = await dborder.where({
				_id: id,
				del: false,
				uid: uid
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
					message: '订单未支付'
				}
			}
			if (orderInfo.status == 1) {
				return {
					code: -2,
					message: '订单未配送'
				}
			}
			if (orderInfo.status == 3) {
				return {
					code: -2,
					message: '订单已完成'
				}
			}
			if (orderInfo.status == 4) {
				return {
					code: -2,
					message: '订单退款中'
				}
			}
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '订单已退款'
				}
			}
			await dborder.where({
				_id: id,
				uid: uid
			}).update({
				status: 3,
				confirm_time: Date.parse(new Date())
			})
			
			var user = await dbuser.where({
				store_id: orderInfo.store_id
			}).get()
			
			var wx_openid = user.data[0].wx_openid['mp-weixin'];
			
			await dbuser.where({
				_id: user.data[0]._id
			}).update({
				balance:dbCmd.inc(orderInfo.pay_money)
			})
			await dbbill.add({
				uid: user.data[0]._id,
				cid: orderInfo._id,
				type: 1,
				from: 1,
				money: orderInfo.pay_money,
				create_date:Date.parse(new Date())
			})
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "user-confirm",
					id: id
				}
			})

			return {
				code: 0,
					message: '欢迎下次再来哦'
			}
			break;
		case 'user-order-del': //用户删除订单
			var res = await dborder.where({
				_id: id,
				uid: uid
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
					message: '订单配送中'
				}
			}
			if (orderInfo.status == 4) {
				return {
					code: -2,
					message: '订单退款中'
				}
			}
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '订单已退款'
				}
			}
			await dborder.where({
				_id: id,
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
		case "store-order-list": //商户订单列表
			skip = (event.where.page - 1) * limit;
			res = await dborder.aggregate()
				.lookup({
					from: 'mdsh-store-product',
					localField: 'cid',
					foreignField: '_id',
					as: 'product',
				}).match({
					store_id: userinfo.store_id,
					status: event.where.status,
					is_pay: event.where.is_pay,
					del: false
				}).skip(skip).limit(limit).sort({
					create_date: -1
				}).end()
			return res.data
			break;
		case "order-delivery": //商户订单配送
			var res = await dborder.where({
				_id: id,
				del: false,
				store_id: userinfo.store_id
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
					message: '订单未支付'
				}
			}
			if (orderInfo.status == 2) {
				return {
					code: -2,
					message: '订单在配送'
				}
			}
			if (orderInfo.status == 3) {
				return {
					code: -2,
					message: '订单已完成'
				}
			}
			if (orderInfo.status == 4) {
				return {
					code: -2,
					message: '订单退款中'
				}
			}
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '订单已退款'
				}
			}
			await dborder.where({
				_id: id
			}).update({
				status: 2,
				delivery_time: Date.parse(new Date())
			})

			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "order-delivery",
					id: id
				}
			})

			return {
				code: 0,
					message: '请尽快送达'
			}
			break;
		case "shop-order-info": //商户订单详情
			if (userinfo.store_id == '') {
				return {
					code: -2,
					message: '未开通商铺'
				}
			}
			var storeinfo = await dbs.where({
				_id: userinfo.store_id
			}).get()

			if (storeinfo.data[0].status == 0) {
				return {
					code: -2,
					message: '店铺已关闭，请联系管理员'
				}
			}
			res = await dborder.aggregate()
				.lookup({
					from: 'mdsh-store-product',
					localField: 'cid',
					foreignField: '_id',
					as: 'product',
				}).match({
					_id: id,
					del: false,
					store_id: userinfo.store_id
				}).end()
			if (res.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}
			return res.data
			break;
	}

};
