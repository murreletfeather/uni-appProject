'use strict';
var uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
const dbadv = db.collection('mdsh-advertisement') //广告
const dbapp = db.collection('mdsh-apply') //应用
const dbappc = db.collection('mdsh-apply-cate') //应用分类
const dbconfig = db.collection('mdsh-config') //系统参数
const dbschool = db.collection('mdsh-school') //学校
exports.main = async (event, context) => {
	
	// var userinfo;
	// var uid;
	
	// if (event.token) {
	// 	var payload = await uniID.checkToken(event.token)
	// 	if (payload.code > 0) {
	
	// 	} else {
	// 		uid = payload.uid
	// 		var user = await uniID.getUserInfo({
	// 			uid: uid
	// 		})
	// 		userinfo = user.userInfo
	// 	}
	// }
	
	var res;
	var skip;
	var limit = 10;
	switch (event.funct) {
		case "adv-list": //获取广告列表
			if(event.school_id){
				res = await dbadv.where(dbCmd.and([{
						cate: event.cate
					},
					{
						status: true
					},
					
				],dbCmd.or([
						{
							school_id: event.school_id
						},
						{
							is_currency: true
						}
					]))).orderBy("sort", "desc").get()
				
			}else{
				res = await dbadv.where({
					cate: event.cate,
					is_currency:true,
					status: true
				}).orderBy("sort", "desc").get()
			}
			break;
		case "school-list": //获取学校列表
			skip = (event.page - 1) * limit;
			res = await dbschool.where({
				status: true
			}).skip(skip).limit(limit).orderBy("sort", "desc").get()
			break;
		case "app-list-home": //首页获取推荐应用
			if(userinfo){
				res = await dbapp.where(dbCmd.and([{
						from:1
					},
					{
						status: true
					},
					{
						is_best: true
					},
					dbCmd.or([
						{
							school_id: userinfo.school_id
						},
						{
							is_currency: true
						}
					])
				])).limit(4).orderBy("sort", "desc").get()
			}else{
				res = await dbapp.where({
					cate: event.cate,
					from: 1,
					is_best: true,
					status: true,
					is_currency: true
				}).limit(4).orderBy("sort", "desc").get()
			}
			break;
		case "app-list": //获取应用
			if (userinfo) {
				if (userinfo.is_manage) {
					res = await dbappc.where(dbCmd.and([{
							from: event.from
						},
						{
							status: true
						},
						{
							is_admin: true
						},
						dbCmd.or([
							{
								school_id: userinfo.school_id
							},
							{
								is_currency: true
							}
						])
					])).get()
				} else {
					if (userinfo.is_assist && userinfo.store_id != '') {
						res = await dbappc.where(dbCmd.and([{
								from: event.from
							},
							{
								status: true
							},
							dbCmd.or([{
									is_assist:true
								},
								{
									is_store:true
								}
							]),
							dbCmd.or([
								{
									school_id: userinfo.school_id
								},
								{
									is_currency: true
								}
							])
						])).get()
					} else if (!userinfo.is_assist && userinfo.store_id) {
						res = await dbappc.where(dbCmd.and([{
								from: event.from
							},
							{
								status: true
							},
							{
								is_store: true
							},
							dbCmd.or([
								{
									school_id: userinfo.school_id
								},
								{
									is_currency: true
								}
							])
						])).get()
					} else if (userinfo.is_assist && userinfo.store_id == '') {
						res = await dbappc.where(dbCmd.and([{
								from: event.from
							},
							{
								status: true
							},
							{
								is_assist: true
							},
							dbCmd.or([
								{
									school_id: userinfo.school_id
								},
								{
									is_currency: true
								}
							])
						])).get()
					} else if (!userinfo.is_assist && userinfo.store_id == '') {
						res = await dbappc.where(dbCmd.and([{
								from: event.from
							},
							{
								status: true
							},
							{
								is_user: true
							},
							dbCmd.or([
								{
									school_id: userinfo.school_id
								},
								{
									is_currency: true
								}
							])
						])).get()
					}
				}
			} else {
				res = await dbappc.where({
					from: event.from,
					status: true,
					is_user: true,
					is_currency: true
				}).get()
			}

			let cate = res.data;
			for (let i = 0; i < cate.length; i++) {
				let list = await dbapp.where({
					cate: cate[i]['_id'],
					status: true
				}).orderBy("sort", "desc").get()
				cate[i]['list'] = list.data
			}
			break;
		case "get-config": //获取系统参数
			if(userinfo){
				res = await dbconfig.where(dbCmd.and([{
						label: event.label
					},
					{
						status: true
					},
					dbCmd.or([
						{
							school_id: userinfo.school_id
						},
						{
							is_currency: true
						}
					])
				])).get()
			}else{
				res = await dbconfig.where({
					label: event.label,
					status: true,
					is_currency: true
				}).get()
			}
			break;
		case "jiexi":
			var url = "http://test.dlao.net?url="+event.url
			res = await uniCloud.httpclient.request(url, {
				method: 'GET',
				contentType: 'json',
				dataType: 'json'
			})
		break;
	}
	return res.data
};
