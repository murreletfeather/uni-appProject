'use strict';
var uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
const dbp = db.collection('mdsh-store-product') //商品
const dbc = db.collection('mdsh-store-product-cate') //商品分类
const dbs = db.collection('mdsh-store') //商铺
const dbbill = db.collection('mdsh-user-bill') //用户账单
const dbschool = db.collection('mdsh-school') //学校
exports.main = async (event, context) => {
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
		case "store-home": //首页店铺推荐
			if(userinfo){
				res = await dbs.where(dbCmd.and([{
						is_recommend: true
					},
					{
						status: 1
					},
					dbCmd.or([
						{
							school_id: userinfo.school_id
						},
						{
							is_currency: true
						}
					])
				])).field({
					'name': true,
					'cover': true,
					'school_id': true
				}).orderBy("sort", "desc").get()
			}else{
				res = await dbs.where({
					is_recommend: true,
					is_currency: true,
					status: 1
				}).field({
					'name': true,
					'cover': true,
					'school_id': true
				}).orderBy("sort", "desc").get()
			}
			break;
		case "store-info": //店铺详情
			res = await dbs.aggregate()
			.lookup({
				from: 'mdsh-school',
				localField: 'school_id',
				foreignField: '_id',
				as: 'school',
			}).match({
				_id: event.id
			}).end()
			
			if (res.data.length != 1) {
				return {
					code: -2,
					message: '店铺不存在或已打烊'
				}
			}
			if (event.user) {
				if (res.data[0].status == 0) {
					return {
						code: -2,
						message: '店铺不存在或已下架'
					}
				}
			}
			break;
		case "store-cate-list": //店铺分类 列表
			res = await dbc.where({
				store_id: event.store_id,
				status: true
			}).get()
			break;
		case "store-list": //店铺列表
			skip = (event.page - 1) * limit;
			if(userinfo){
				res = await dbs.where(dbCmd.and([
					{
						status: 1
					},
					dbCmd.or([
						{
							school_id: userinfo.school_id
						},
						{
							is_currency: true
						}
					])
				])).field({
					'name': true,
					'cover': true,
					'school_id': true
				}).skip(skip).limit(limit).orderBy("sort", "desc").get()
			}else{
				res = await dbs.where({
					status: 1,
					is_currency: true
				}).field({
					'name': true,
					'cover': true,
					'school_id': true
				}).skip(skip).limit(limit).orderBy("sort", "desc").get()
			}
			
			for (var i = 0; i < res.data.length; i++) {
				var list = await dbp.where({
					store_id: res.data[i]['_id'],
					status: true
				}).field({
					'name': true,
					'cover': true,
					'is_best': true,
					'is_hot': true,
					'is_top': true,
					'price': true,
					'sales': true,
					'stock': true
				}).limit(3).orderBy("sort", "desc").get()
				res.data[i]['list'] = list.data
			}
			break;
		case "product-info": //商品详情
			res = await dbp.aggregate()
				.lookup({
					from: 'mdsh-store',
					localField: 'store_id',
					foreignField: '_id',
					as: 'store',
				}).match({
					_id: event.id
				}).end()
			if (res.data.length != 1) {
				return {
					code: -2,
					message: '商品不存在或已下架'
				}
			}
			if (event.user) {
				if (!res.data[0].status) {
					return {
						code: -2,
						message: '商品不存在或已下架'
					}
				}
			}
			break;
		case "product-list": //商品列表
			skip = (event.page - 1) * limit;
			if(userinfo){
				res = await dbp.aggregate()
				.lookup({
					from: 'mdsh-store',
					localField: 'store_id',
					foreignField: '_id',
					as: 'store',
				}).match(dbCmd.and([
					event.where,
					dbCmd.or([
						{
							school_id: userinfo.school_id
						},
						{
							is_currency: true
						}
					])
				])).skip(skip).limit(limit).sort({
					create_date: -1,
					sort: -1
				}).end()
			}else{
				res = await dbp.aggregate()
				.lookup({
					from: 'mdsh-store',
					localField: 'store_id',
					foreignField: '_id',
					as: 'store',
				}).match(event.where).skip(skip).limit(limit).sort({
					create_date: -1,
					sort: -1
				}).end()
			}
			break;
		case "product-listb": //商品列表 测试
			res = await dbc.aggregate()
			.lookup({
				from: 'mdsh-store-product',
				localField: '_id',
				foreignField: 'cate_id',
				as: 'prod',
			}).match(event.where).sort({
				create_date: -1,
				sort: -1
			}).end()
			break;
		case "store-product-list": //商店 商品列表
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}

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
			skip = (event.page - 1) * limit;
			res = await dbp.where({
				store_id: userinfo.store_id
			}).field({
				'name': true,
				'cover': true,
				'school_id': true,
				'price': true,
				'cate_id': true,
				'is_best': true,
				'is_hot': true,
				'is_top': true,
				'sales': true,
				'stock': true,
				'status': true
			}).skip(skip).limit(limit).orderBy("sort", "desc").get()
			break;
		case "store-product-edit": //商店 商品修改
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			
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
			res = await dbp.where({
				store_id: userinfo.store_id,
				_id: event.id
			}).update(event.form)
			return {
				code: 0,
					message: '修改成功'
			}
			break;
		case "store-info-uid": //店铺详情 通过uid查询
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			
			if (userinfo.store_id == '') {
				return {
					code: -2,
					message: '未开通商铺'
				}
			}
			var res = await dbs.where({
				_id: userinfo.store_id
			}).get()

			if (res.data[0].status == 0) {
				return {
					code: -2,
					message: '店铺已关闭，请联系管理员'
				}
			}
			break;
		case "store-save": //店铺 修改
			if (userinfo=='') {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			
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
			await dbs.where({
				_id: userinfo.store_id
			}).update(event.form)
			return {
				code: 0,
					message: '修改成功'
			}
			break;
	}
	return res.data
};
