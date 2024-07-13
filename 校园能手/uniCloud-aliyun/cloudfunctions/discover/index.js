'use strict';
const crypto = require('crypto')
const db = uniCloud.database()
let uniID = require('uni-id')
const UniSecCheck = require('uni-sec-check')
const dbCmd = db.command
const dbcom = db.collection('mdsh-discover-comment') //评论
const dbdis = db.collection('mdsh-discover') //圈子
const dbcon = db.collection('mdsh-discover-content') //内容
const dbuser = db.collection('uni-id-users') //用户
exports.main = async (event, context) => {
	uniID = uniID.createInstance({
		context
	})
	const {
		funct,
		token
	} = event
	
	const uniSecCheck = new UniSecCheck({ // 创建内容安全检测模块实例
		provider: 'mp-weixin', // 指定所使用服务的提供商，目前仅支持mp-weixin
	})

	switch (funct) {
		case "imgSecCheckRes"://图片检测
			var arr= event.imgs
			var imgs=[]
			for (var i =0;i<arr.length;i++) {
				var imgSecCheckRes = await uniSecCheck.imgSecCheck({
					image: arr[i]
				})
				if (imgSecCheckRes.errCode == 0) {
					imgs.push(arr[i])
				}
			}
			return {
				code: 0,
				message: "图片检测完成,违规内容自动删除",
				data:arr
			}
		break;
		case "imgSecCheckResone"://图片检测单个
			var imgSecCheckRes = await uniSecCheck.imgSecCheck({
				image: event.image
			})
			if (imgSecCheckRes.errCode == 0) {
				return {
					code: 0,
					message: '检测通过'
				}
			}else{
				var title='';
				switch(imgSecCheckRes.errCode){
					case 'uni-sec-check-system-error':
						title="系统错误";
					break;
					case 'uni-sec-check-risk-content':
						title="禁止上传违规内容";
					break;
					default:
						title="检测失败";
					break;
				}
				return {
					code: -2,
					message: title
				}
			}
		break;
		case "textSecCheckRes": //文字检测
			var textSecCheckRes = await uniSecCheck.textSecCheck({
				content: event.content
			})
			if (textSecCheckRes.errCode == 0) {
				return {
					code: 0,
					message: '检测通过'
				}
			}else{
				var title='';
				switch(imgSecCheckRes.errCode){
					case 'uni-sec-check-system-error':
						title="系统错误";
					break;
					case 'uni-sec-check-risk-content':
						title="禁止上传违规内容";
					break;
					default:
						title="检测失败";
					break;
				}
				return {
					code: -2,
					message: title
				}
			}
		break;
		case 'comup':
			await dbcom.where({
				_id: event.id
			}).update({
				up: dbCmd.inc(1)
			})
		break;
	}

};
