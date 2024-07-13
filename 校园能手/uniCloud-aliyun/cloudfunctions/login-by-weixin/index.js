'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const $ = db.command.aggregate
const dbu = db.collection('uni-id-users')
const dbbill = db.collection('mdsh-user-bill') //用户账单
const dbuapply = db.collection('mdsh-user-apply') //用户申请单
const dbstore = db.collection('mdsh-store') //商铺


exports.main = async function(event, context) {
	var res;
	var skip;
	var limit = 10;
	switch (event.funct) {
		case "login"://用户登录注册
			res = await uniID.loginByWeixin({
				code: event.code,
			})
			await uniID.updateUser({
				uid: res.uid,
				avatar: event.info.avatarUrl,
				nickName: event.info.nickName,
				province: event.info.province,
				country: event.info.country,
				city: event.info.city,
				gender: event.info.gender,
				mobile: '',
				status: 0,
				register_date: Date.parse(new Date()),
				is_assist: false,
				is_manage: false,
				store_id: '',
				type: 1,
				real_name: '',
				college: '',
				major: '',
				grade: '',
				student_number: '',
				balance: 0.00,
				password: '',
				school_id: '',
				rate: 0.02,
				school: '',
				friend_num:0,
				backgroundImage:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/799097e4-177b-4a20-9e28-5b81be356293.png"
			})
			let resc = await uniID.getUserInfo({
				uid: res.uid
			})
			res.userInfo = resc.userInfo
		break;
		case "loginByQQ"://用户登录注册
			res = await uniID.loginByQQ({
				code: event.code,
			})
			await uniID.updateUser({
				uid: res.uid,
				avatar: event.info.avatarUrl,
				nickName: event.info.nickName,
				province: event.info.province,
				country: event.info.country,
				city: event.info.city,
				gender: event.info.gender,
				mobile: '',
				status: 0,
				register_date: Date.parse(new Date()),
				is_assist: false,
				is_manage: false,
				store_id: '',
				type: 2,
				real_name: '',
				college: '',
				major: '',
				grade: '',
				student_number: '',
				balance: 0.00,
				password: '',
				school_id: '',
				rate: 0.02,
				school: '',
				friend_num:0,
				backgroundImage:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/799097e4-177b-4a20-9e28-5b81be356293.png"
			})
			var resdd= await uniID.getUserInfo({
				uid: res.uid
			})
			res.userInfo = resdd.userInfo
		break;
		case "getuserinfo"://获取用户信息 通过code
			res = await uniID.loginByWeixin({
				code: event.code,
			})
		break;
		case "getuserinfoqq"://获取用户信息 通过code qq
			res = await uniID.loginByQQ({
				code: event.code,
			})
		break;
		case "getuserinfouid"://获取用户信息 通过uid
			res = await uniID.getUserInfo({
				uid: event.uid,
			})
		break;
		case "getuserinfotoken"://获取用户信息 通过token
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			var userinfo = await uniID.getUserInfo({
				uid: uid
			})
			return userinfo;
		break;
		case "user-expenses"://统计
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			res = await dbbill.aggregate()
			  .group({
			    _id: '$type',
			    total: $.sum('$money')
			  }).match({
				uid:uid
			  })
			  .end()
			return res;
		break;
		case "user-apply-submit"://用户提交申请单
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			var user = await uniID.getUserInfo({
				uid: uid
			})
			var userinfo = user.userInfo
			var info = await dbuapply.where({
				uid:uid,
				type:event.form.type
			}).get()
			if (info.data.length !== 1) {
				var retid = await dbuapply.add({
					uid:uid,
					type:event.form.type,
					status: 1,
					create_date: Date.parse(new Date()),
					des: event.form.des,
					phone: event.form.phone,
					real_name:event.form.real_name,
					college:event.form.college,
					major:event.form.major,
					grade:event.form.grade,
					school_id:userinfo.school_id,
					store_name:event.form.store_name,
					address:event.form.address,
					ref_reason:'',
					ref_time:''
				})
				await uniCloud.callFunction({
					name: "template",
					data: {
						funct: "user-apply-submit",
						id: retid.id
					}
				})
				return {
					code: 0,
					message: '申请成功，等待审核'
				}
			}else{
				var det = info.data[0]
				if(det.status==1){
					return {
						code: -2,
						message: '审核中，请等待'
					}
				}else if(det.status==2){
					return {
						code: -2,
						message: '审核通过，无需申请'
					}
				}else{
					await dbuapply.where({
						_id: det._id,
						uid: uid,
						type:event.form.type
					}).update({
						status: 1,
						create_date: Date.parse(new Date()),
						des: event.form.des,
						phone: event.form.phone,
						real_name:event.form.real_name,
						college:event.form.college,
						major:event.form.major,
						grade:event.form.grade,
						store_name:event.form.store_name,
						address:event.form.address,
						ref_reason:'',
						ref_time:''
					})
					await uniCloud.callFunction({
						name: "template",
						data: {
							funct: "user-apply-submit",
							id: det._id
						}
					})
					return {
						code: 0,
						message: '申请成功，等待审核'
					}
				}
			}
		break;
		case "user-apply-info"://用户申请单详情
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			var info = await dbuapply.where({
				uid:uid,
				type:event.form.type
			}).get()
			return info.data;
		break;
		case "user-apply-list"://用户申请单列表 管理员
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			var userinfo = await uniID.getUserInfo({
				uid: uid
			})
			if(!userinfo.userInfo.is_manage){
				return {
					code: -2,
					message: '暂无权限'
				}
			}
			skip = (event.where.page - 1) * limit;
			res = await dbuapply.where({
				status: event.where.status
			}).skip(skip).limit(limit).orderBy("create_date", "desc").get()
			return res.data
		break;
		case "user-apply-info-admin"://用户申请单详情 管理员
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			var userinfo = await uniID.getUserInfo({
				uid: uid
			})
			if(!userinfo.userInfo.is_manage){
				return {
					code: -2,
					message: '暂无权限'
				}
			}
			var info = await dbuapply.where({
				_id:event.id
			}).get()
			if (info.data.length !== 1) {
				return {
					code: -2,
					message: '查询失败'
				}
			}
			return info.data;
		break;
		case "user-apply-examine"://用户申请单审核 管理员
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			var userinfo = await uniID.getUserInfo({
				uid: uid
			})
			if(!userinfo.userInfo.is_manage){
				return {
					code: -2,
					message: '暂无权限'
				}
			}
			var info = await dbuapply.where({
				_id:event.id
			}).get()
			if (info.data.length !== 1) {
				return {
					code: -2,
					message: '查询失败'
				}
			}
			var dinf=info.data[0]
			if (dinf.status ==2) {
				return {
					code: -2,
					message: '审核通过，无需操作'
				}
			}
			await dbuapply.where({
				_id:event.id
			}).update({
				status: event.status,
				create_date: Date.parse(new Date()),
				ref_reason:event.ref_reason,
				ref_time:event.status==3 ? Date.parse(new Date()) : ''
			})
			if(event.status==2){
				if(dinf.type==1){
					await dbu.where({
						_id:dinf.uid
					}).update({
						mobile: dinf.phone,
						is_assist: true,
						real_name:dinf.real_name,
						college:dinf.college,
						major:dinf.major,
						grade:dinf.grade,
					})
				}else{
					var user = await uniID.getUserInfo({
						uid: dinf.uid
					})
					
					var userInfo = user.userInfo;
					
					var did = await dbstore.add({
						school_id: userInfo.school_id,
						name: dinf.store_name,
						cover:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/ce88016e-0d23-4f00-9fae-32f2379b9420.png",
						sort:0,
						shopkeeper:dinf.real_name,
						score:10,
						phone:dinf.phone,
						address:dinf.address,
						rate:0.02,
						status:true,
						create_date:Date.parse(new Date())
					})
					
					await dbu.where({
						_id:dinf.uid
					}).update({
						mobile: dinf.phone,
						real_name:dinf.real_name,
						college:dinf.college,
						major:dinf.major,
						grade:dinf.grade,
						store_id:did.id
					})
				}
			}
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "user-apply-examine",
					id: event.id
				}
			})
			return {
				code: 0,
				message: '审核成功'
			}
		break;
		case "user-update"://用户信息更新
			var payload = await uniID.checkToken(event.token)
			if (payload.code > 0) {
				return {
					code: -2,
					message: '用户身份验证失败，请重新登录'
				}
			}
			var uid = payload.uid
			await dbu.where({
				_id:uid
			}).update(event.form)
			return {
				code: 0,
				message: '保存成功'
			}
		break;
	}

	return res
}
