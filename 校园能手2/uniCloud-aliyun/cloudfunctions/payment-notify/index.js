'use strict';
const createConfig = require('uni-config-center')
const uniPay = require('uni-pay')
const uniID = require('uni-id')

const db = uniCloud.database()
const dbCmd = db.command
const dba = db.collection('mdsh-assist') //跑腿
const dbp = db.collection('mdsh-store-product') //商品
const dborder = db.collection('mdsh-order') //订单
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
	let uniPayInstance
	let provider

	var parameter = event.path.substring(1)

	const type = parameter.substring(0, 1); //订单类型1商品2跑腿 参数1
	const prov = parameter.substring(2, 1); //支付方式1小程序微信 参数2

	switch (prov) {
		case '1':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigMp)
			break;
		case 'wxpay_app-plus':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigApp)
			break;
		case 'wxpay_h5':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigH5)
			break;
		case 'alipay_mp-alipay':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigMp)
			break;
		case 'alipay_app-plus':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigApp)
			break;
		case 'alipay_h5':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigH5)
			// uniPayInstance = uniPay.initAlipay(aliConfigSandbox)
			break;
		default:
			console.log('---------参数错误-------')
			return {
				code: -1,
					message: '参数错误'
			}
	}
	let verifyResult = await uniPayInstance.verifyPaymentNotify(event)
	if (!verifyResult) {
		console.log('---------!verifyResult-------')
		return {}
	}
	let {
		outTradeNo,
		totalFee,
		transactionId,
		resultCode,
		timeEnd
	} = verifyResult

	totalFee = totalFee / 100;
// console.log('回调',verifyResult,'类型',type);
	if (type == 1) { //商品
		var orderList = await dborder.where({
			order_id: outTradeNo
		}).get()

		if (orderList.data.length < 0) {
			console.log('---------orderList.data.length < 0-------')
			return {}
		}

		var orderDetail = orderList.data[0]

		if (totalFee == orderDetail.pay_money && (resultCode === 'SUCCESS' || resultCode === 'FINISHED')) {
			await dborder.where({
				_id: orderDetail._id
			}).update({
				is_pay: true,
				pay_time: Date.parse(new Date()),
				transaction_id: transactionId
			}).then((rtu)=>{
				let arr =orderDetail.ids
				
				for(var i=0;i<arr.length;i++){
					dbp.where({
						_id: arr[i]._id
					}).update({
						sales: dbCmd.inc(arr[i].count),
						stock: dbCmd.inc(-arr[i].count),
					})
				}
			})
			await dbbill.add({
				uid: orderDetail.uid,
				cid: orderDetail._id,
				type: 2,
				from: 1,
				money: orderDetail.pay_money,
				create_date:Date.parse(new Date())
			})
			
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "OrderReminderToMerchant",
					id: orderDetail._id
				}
			}).then((err)=>{
				
			}) 
		}
	} else { //跑腿
		var orderList = await dba.where({
			order_id: outTradeNo
		}).get()

		if (orderList.data.length < 0) {
			console.log('---------orderList.data.length < 0-------')
			return {}
		}

		var orderDetail = orderList.data[0]

		if (totalFee == orderDetail.pay_money && (resultCode === 'SUCCESS' || resultCode === 'FINISHED')) {
			await dba.where({
				order_id: outTradeNo
			}).update({
				is_pay: true,
				pay_time: Date.parse(new Date()),
				transaction_id: transactionId
			})
			await dbbill.add({
				uid: orderDetail.uid,
				cid: orderDetail._id,
				type: 2,
				from: 2,
				money: orderDetail.pay_money,
				create_date:Date.parse(new Date())
			})
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "NewOrderNotificationErrand",
					id: orderDetail._id
				}
			}).then((err)=>{
				
			}) 
		}
	}
	// console.log("verifyResult: " + JSON.stringify(verifyResult));
	// 注意如果处理成功需要严格按照下面的格式进行返回，否则厂商会持续通知
	if (provider === 'weixin') {
		// 微信处理成功之后 
		return {
			mpserverlessComposedResponse: true,
			statusCode: 200,
			headers: {
				'content-type': 'text/xml;charset=utf-8'
			},
			body: `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`
		}
	}
	// 支付宝处理成功后  
	return {
		mpserverlessComposedResponse: true,
		statusCode: 200,
		headers: {
			'content-type': 'text/plain'
		},
		body: "success"
	}
};
