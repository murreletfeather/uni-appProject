// 订单提交
const db = uniCloud.database()
const dbCmd = db.command
const dbstore = db.collection('mdsh-store') //店铺
const dborder = db.collection('mdsh-order') //订单
module.exports = {
	before: async (state, event) => {
		var form=state.newData
		if(form.ids.length<1){
			throw new Error("商品信息错误") 
		}
		if(form.take_user==''){
			throw new Error("请输入收货人信息") 
		}
		if(form.take_address==''){
			throw new Error("请输入收货人地址") 
		}
		var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
		if(!myreg.test(form.take_phone)){
			throw new Error("手机号错误") 
		}
		if(form.store_id==''){
			throw new Error("订单信息有误") 
		}
		if(form.num<1){
			throw new Error("商品数量不能小于1") 
		}
		if(form.pay_money<1){
			throw new Error("订单金额不能小于1") 
		}
		
		var storeinfo = await dbstore.where({
			_id: form.store_id
		}).get()
		
		if (storeinfo.data.length !== 1) {
			throw new Error("店铺不存在") 
		}
		if (storeinfo.data[0].status !== 1) {
			throw new Error("店铺已打烊") 
		}
		if(form.pay_money<storeinfo.data[0].delivery_price){
			throw new Error("商家起送价为"+storeinfo.data[0].delivery_price+"元") 
		}
		
	},
	after: async (state, event, error, result) => {
		if (error) {
			throw error
		}
		console.log("测试赛所所所");
		console.log(result);
		// if(result.data._id){
		// 	var order = await uniCloud.callFunction({
		// 		name: "pay",
		// 		data: {
		// 			provider:'wxpay_mp-weixin',
		// 			funct:'pay',
		// 			type:1,
		// 			id: result.data._id
		// 		}
		// 	})
		// 	if(order.result.code==0){
		// 		return order.result.data
		// 	}else{
		// 		throw new Error("订单提交失败") 
		// 	}
		// }else{
		// 	throw new Error("订单提交失败") 
		// }
		return result
	}
}
