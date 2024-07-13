'use strict';
const createConfig = require('uni-config-center')
const uniPay = require('uni-pay')
const uniID = require('uni-id')
const fs = require('fs');
const path = require('path');

const db = uniCloud.database()
const dbCmd = db.command
const dbp = db.collection('mdsh-store-product') //商品
const dborder = db.collection('mdsh-order') //订单
const dba = db.collection('mdsh-assist') //跑腿
const dbbill = db.collection('mdsh-user-bill') //用户账单
exports.main = async (event, context) => {
	const uniPayConfig = createConfig({
		pluginId: 'uni-pay'
	})
	const {
		wxConfigMp,
		wxConfigApp,
		wxConfigH5,
		aliConfigMp,
		aliConfigApp,
		aliConfigH5,
		// aliConfigSandbox
	} = uniPayConfig.requireFile('config.js')

	let {
		provider,
		id,
		funct,
		type,
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
console.log(666666666);
console.log(uid);
	switch (funct) {
		case 'pay':
			if (type == 1) { //商品
				var orderList = await dborder.where({
					_id: id,
					uid: uid
				}).get()
			} else { //跑腿
				var orderList = await dba.where({
					_id: id,
					uid: uid
				}).get()
			}

			if (orderList.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}

			var orderInfo = orderList.data[0]

			if (type == 1) {
				let arr =orderInfo.ids
				
				let ids = [];
				
				arr.forEach((food) => {
					ids.push(food._id)
				})
				const prod = await dbp.where({
					_id: dbCmd.in(ids),
					status: true
				}).field({
					'name': true,
					'price': true,
					'stock': true,
					'school_id':true,
					'cover':true,
					'store_id': true,
				}).get()
				
				if (prod.data.length !== arr.length) {
					return {
						code: -2,
						message: '商品不存在'
					}
				}
				var pinfo = prod.data;
				var name = pinfo[0].name
				var notifyUrl =
					"https://ad262787-dade-474e-b9c6-8f8330817a02.bspapp.com/http/payment-notify/11";
			} else {
				var name = orderInfo.des
				var notifyUrl = "https://ad262787-dade-474e-b9c6-8f8330817a02.bspapp.com/http/payment-notify/21"
			}

			if (orderInfo.is_pay) {
				return {
					code: -2,
					message: '订单已支付'
				}
			}

			if (orderInfo.is_refund) {
				return {
					code: -2,
					message: '订单已退款'
				}
			}

			const userList = await db.collection('uni-id-users').where({
				_id: uid
			}).get()
			const userInfo = userList.data[0]

			var unipayIns,
				openid,
				tradeType
			// notifyUrl为接收通知的云函数的url，云函数Url化请参考：https://uniapp.dcloud.io/uniCloud/http
			switch (provider) {
				case 'wxpay_mp-weixin':
					unipayIns = uniPay.initWeixin(wxConfigMp)
					openid = userInfo.wx_openid['mp-weixin']
					tradeType = 'JSAPI'
					break;
				case 'alipay_mp-alipay':
					unipayIns = uniPay.initAlipay(aliConfigMp)
					openid = userInfo.ali_openid
					break;
				case 'wxpay_app-plus':
					unipayIns = uniPay.initWeixin(wxConfigApp)
					tradeType = 'APP'
					break;
				case 'alipay_app-plus':
					unipayIns = uniPay.initAlipay(aliConfigApp)
					break;
				case 'wxpay_h5':
					unipayIns = uniPay.initWeixin(wxConfigH5)
					tradeType = 'NATIVE'
					break;
				case 'alipay_h5':
					unipayIns = uniPay.initAlipay(aliConfigH5)
					// unipayIns  = uniPay.initAlipay(aliConfigSandbox)
					tradeType = 'NATIVE'
					break;
				default:
					return {
						code: -1,
							message: '参数错误'
					}
			}


			let order

			// 请填写对应平台接收通知云函数对应的云函数url化地址，云函数url化请参考：https://uniapp.dcloud.io/uniCloud/http
			try {
				// 获取支付信息
				order = await unipayIns.getOrderInfo({
					openid, // App端支付时不需要openid，传入个undefined也没有影响
					outTradeNo: orderInfo.order_id,
					totalFee: orderInfo.pay_money * 100,
					subject: name,
					body: name,
					notifyUrl,
					tradeType
				})
			} catch (e) {
				console.log(e)
				return {
					code: -2,
					message: '获取支付信息失败，请稍后再试'
				}
			}
			return {
				order
			}
			break;
		case 'refund':
			let userinfo = await uniID.getUserInfo({
				uid: uid
			})
			if (type == 1) { //商品
				var orderList = await dborder.where({
					_id: id,
					store_id: userinfo.userInfo.store_id
				}).get()
			} else { //跑腿
				var orderList = await dba.where({
					_id: id,
					uid: uid
				}).get()
			}

			if (orderList.data.length !== 1) {
				return {
					code: -2,
					message: '订单不存在'
				}
			}


			var orderInfo = orderList.data[0]

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
			if (orderInfo.status == 5) {
				return {
					code: -2,
					message: '订单已退款'
				}
			}
			if (type == 1) {
				if (event.status == 2) { //不退款
					await dborder.where({
						order_id: orderInfo.order_id
					}).update({
						status: 1,
						no_refund_res: event.no_refund_res,
						no_refund_time:Date.parse(new Date())
					})
					await uniCloud.callFunction({
						name: "template",
						data: {
							funct: "RefundReviewNoticeUser",
							id: id
						}
					})
					return {
						code: 0,
						message: '修改成功'
					}
				} else {
					wxConfigMp.pfx = fs.readFileSync(path.resolve(__dirname, 'cert/apiclient_cert.p12'))

					var unipayIns = uniPay.initWeixin(wxConfigMp)

					try {
						var res = await unipayIns.refund({
							outTradeNo: orderInfo.order_id,
							outRefundNo: Date.parse(new Date()), // 支付宝可不填此项
							totalFee: orderInfo.pay_money * 100, // 订单总金额，支付宝可不填此项
							refundFee: orderInfo.pay_money * 100, // 退款总金额
						})
						console.log("退款结果：" + res)
						if (res.resultCode === 'SUCCESS' && res.returnCode === 'SUCCESS') {
							await dborder.where({
								order_id: res.outTradeNo
							}).update({
								is_refund: true,
								status: 5,
								refund_time: Date.parse(new Date()),
								refund_no: res.refundId
							})
							await dbbill.add({
								uid: orderInfo.uid,
								cid: orderInfo._id,
								type: 1,
								from: 1,
								money: orderInfo.pay_money,
								create_date: Date.parse(new Date())
							})
							await uniCloud.callFunction({
								name: "template",
								data: {
									funct: "RefundReviewNoticeUser",
									id: id
								}
							})
							return {
								code: 0,
								message: '退款成功'
							}
						} else {
							return {
								code: -2,
								message: '退款失败'
							}
						}
					} catch (e) {
						return {
							code: -2,
							message: '退款失败'
						}
					}
				}
			} else {
				wxConfigMp.pfx = fs.readFileSync(path.resolve(__dirname, 'cert/apiclient_cert.p12'))

				var unipayIns = uniPay.initWeixin(wxConfigMp)

				try {
					var res = await unipayIns.refund({
						outTradeNo: orderInfo.order_id,
						outRefundNo: Date.parse(new Date()), // 支付宝可不填此项
						totalFee: orderInfo.pay_money * 100, // 订单总金额，支付宝可不填此项
						refundFee: orderInfo.pay_money * 100, // 退款总金额
					})
					console.log("退款结果：" + res)
					if (res.resultCode === 'SUCCESS' && res.returnCode === 'SUCCESS') {
						await dba.where({
							order_id: res.outTradeNo
						}).update({
							is_refund: true,
							status: 5,
							refund_time: Date.parse(new Date()),
							refund_no: res.refundId
						})
						await dbbill.add({
							uid: orderInfo.uid,
							cid: orderInfo._id,
							type: 1,
							from: 2,
							money: orderInfo.pay_money,
							create_date: Date.parse(new Date())
						})
						return {
							code: 0,
							message: '退款成功'
						}
					} else {
						return {
							code: -2,
							message: '退款失败'
						}
					}
				} catch (e) {
					return {
						code: -2,
						message: '退款失败'
					}
				}
			}
			break;
	}
};
