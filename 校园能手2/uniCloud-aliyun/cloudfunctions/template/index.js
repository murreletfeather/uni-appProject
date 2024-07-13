'use strict';
const uniID = require('uni-id')
const openapi = require('mp-cloud-openapi')

const db = uniCloud.database()
const dbuser = db.collection('uni-id-users') //用户
const dborder = db.collection('mdsh-order') //订单
const dbproduct = db.collection('mdsh-store-product') //商品
const dbassist = db.collection('mdsh-assist') //跑腿
const dbuapply = db.collection('mdsh-user-apply') //用户申请单
const dbdiscover = db.collection('mdsh-discover') //圈子
const dbcontent = db.collection('mdsh-discover-content') //圈子帖子
const dbcomment = db.collection('mdsh-discover-comment') //圈子帖子评论

exports.main = async (event, context) => {
	const appId = 'wx60eeb38ba0432f63';
	const secret = 'a94fe98d67d270718fc6830751ed96d5';
	var res;
	var access_token;
	var user;
	var touser;
	
	// //获取微信小程序access_token
	const getTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
	
	access_token = await uniCloud.httpclient.request(getTokenUrl, {
		method: 'GET',
		dataType: 'json'
	})
	access_token = access_token.data.access_token;
	
	const openapiWeixin = openapi.initWeixin({
	  appId: appId,
	  secret: secret,
	  accessToken:access_token
	})
	
	function getitme(create_date){
		var date = new Date(create_date);
		var year = date.getFullYear();
		var mon = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minu = date.getMinutes();
		var sec = date.getSeconds();
		var trMon = mon < 10 ? '0' + mon : mon
		var trDay = day < 10 ? '0' + day : day
		var time = year + '-' + trMon + '-' + trDay + " " + hours + ":" + minu + ":" + sec;
		return time;
	}
	
	function getordertype(type){
		switch(type){
			case '1':
				return '代买';
			break;
			case '2':
				return '代取';
			break;
			case '3':
				return '代排队';
			break;
			case '4':
				return '代课';
			break;
		}
	}
	async  function getwxopenid(id){
		 user = await  dbuser.where({
			_id: id
		}).get()
		touser = user.data[0].wx_openid['mp-weixin'];
		return touser;
	}
	
	event.funct='NotificationOfAuditResults';
	event.id='6132e2c79a42f60001ec1d80'
	switch(event.funct){
		case 'CommentReplyNotice'://评论回复通知
			res = await dbcomment.aggregate()
			  .lookup({
				from: 'mdsh-discover-content',
				localField: 'cid',
				foreignField: '_id',
				as: 'contentList',
			  })
			  .match({
				  _id:event.id
			  })
			  .end()
			if(res.data.length==1){
				var respid = await dbcomment.where({
					pid: event.id
				}).get()
				var pidinfo=respid.data[0];
				var info=res.data[0];
				user = await  dbuser.where({
					_id: pidinfo.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin'];
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/pages/discover/detail/detail?id="+info.contentList[0]['_id'],
						'template_id': "vsH964PBVRMKjIA5YaWen8O3t7ti4-N7rSP6kKrt4hI",
						'data': {
							"thing10": {
								"value":info.contentList[0]['content'].substring(0, 20)
							},
							"thing1": {
								"value":pidinfo.content.substring(0, 20)
							},
							"thing2": {
								"value": info.content.substring(0, 20)
							},
							"thing3": {
								"value": info.nickName.substring(0, 20)
							},
							"time9": {
								"value": getitme(info.report_time)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'NewCommentReminder'://新的评论提醒
			res = await dbcomment.aggregate()
			  .lookup({
				from: 'mdsh-discover-content',
				localField: 'cid',
				foreignField: '_id',
				as: 'contentList',
			  })
			  .match({
				  _id:event.id
			  })
			  .end()
			  
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.contentList[0].uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin'];
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/pages/discover/detail/detail?id="+info.contentList[0]['_id'],
						'template_id': "ApwIEyiP5HHfCUZcrVj5D3IZYs0ULFdM8XqtxASzXmw",
						'data': {
							"thing1": {
								"value":info.contentList[0]['content'].substring(0, 20)
							},
							"thing2": {
								"value":info.content.substring(0, 20)
							},
							"time3": {
								"value": getitme(info.report_time)
							},
							"thing5": {
								"value": info.nickName.substring(0, 20)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'PostDynamicNotification'://帖子动态通知
			user = await  dbuser.where({
				_id: event.uid
			}).get()
			touser = user.data[0].wx_openid['mp-weixin'];
			try {
				const result = await openapiWeixin.subscribeMessage.send({
					"touser": touser,
					'template_id': "1lWfUSMRkVHKSqfN6hpP4ASUforudiCyZBjTwqNkb1g",
					'data': {
						"thing1": {
							"value":"帖子被删除"
						},
						"time2": {
							"value":info.content.substring(0, 20)
						}
					}
				  })
				return result
			  } catch (err) {
				return err
			  }
		break;
		case 'NewPostPostingReminder'://新帖子发布提醒
			res = await dbcontent.aggregate()
			  .lookup({
				from: 'mdsh-discover',
				localField: 'cid',
				foreignField: '_id',
				as: 'discoverList',
			  })
			  .match({
				  _id:event.id
			  })
			  .end()
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin'];
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/pages/discover/detail/detail?id="+info._id,
						'template_id': "6LrUIBoyCZk76ZI_q6uEIz_U7FHgNqmgbFG67MN28Vw",
						'data': {
							"thing1": {
								"value":user.data[0].nickName.substring(0, 20)
							},
							"thing2": {
								"value":info.discoverList[0]['name'].substring(0, 20)
							},
							"thing3": {
								"value": info.content.substring(0, 20)
							},
							"time6": {
								"value": getitme(info.create_date)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'OrderReminderToMerchant'://订单下单提醒给商户
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await dbuser.where({
					store_id: info.store_id
				}).get()
	
				var wx_openid = user.data;
				for(var i=0;i<wx_openid.length;i++){
					var accurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
					var token;
					var acctk = await uniCloud.httpclient.request(accurl, {
						method: 'GET',
						dataType: 'json'
					}).then((ack)=>{
						token = ack.data.access_token;
					})
					
					var openapiwx = openapi.initWeixin({
					  appId: appId,
					  secret: secret,
					  accessToken:token
					})
					if(wx_openid[i].wx_openid){
						try {
							var result = openapiwx.subscribeMessage.send({
								"touser": wx_openid[i].wx_openid['mp-weixin'],
								"page": "/shop/manage/order/order?id="+info._id,
								'template_id': "aQwqp-1Y_3hE7b3gvYY0HTAqhbTWa8AMteB5fU5GOqg",
								'data': {
									"amount1": {
										"value":info.pay_money
									},
									"character_string2": {
										"value":info.order_id
									},
									"thing4": {
										"value": info.ids[0].name.substring(0, 20)
									},
									"thing8": {
										"value": info.take_address.substring(0, 20)
									},
									"time14": {
										"value": getitme(info.create_date)
									}
								}
							  })
							return result
						  } catch (err) {
							return err
						  }
					}
				}
			}
		break;
		case 'ReceiptReminderNotice'://收货提醒通知
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true,
				status:3
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await dbuser.where({
					store_id: info.store_id
				}).get()
			
				var wx_openid = user.data;
				for(var i=0;i<wx_openid.length;i++){
					var accurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
					var token;
					var acctk = await uniCloud.httpclient.request(accurl, {
						method: 'GET',
						dataType: 'json'
					}).then((ack)=>{
						token = ack.data.access_token;
					})
					
					var openapiwx = openapi.initWeixin({
					  appId: appId,
					  secret: secret,
					  accessToken:token
					})
					if(wx_openid[i].wx_openid){
						try {
							var result = openapiwx.subscribeMessage.send({
								"touser": wx_openid[i].wx_openid['mp-weixin'],
								"page": "/shop/manage/order/order?id="+info._id,
								'template_id': "HaBy1DKNPfsnS27Vh7PqW7GBHbCVZ14BGhmAhvElpY8",
								'data': {
									"character_string9": {
										"value":info.order_id
									},
									"thing2": {
										"value": info.ids[0].name.substring(0, 20)
									},
									"thing4": {
										"value": info.take_address.substring(0, 20)
									},
									"date8": {
										"value": getitme(info.confirm_time)
									}
								}
							  })
							return result
						  } catch (err) {
							return err
						  }
					}
				}
			}
		break;
		case 'OrderCancellationNotice'://订单取消通知
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true,
				status:5
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await dbuser.where({
					store_id: info.store_id
				}).get()
			
				var wx_openid = user.data;
				for(var i=0;i<wx_openid.length;i++){
					var accurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
					var token;
					var acctk = await uniCloud.httpclient.request(accurl, {
						method: 'GET',
						dataType: 'json'
					}).then((ack)=>{
						token = ack.data.access_token;
					})
					
					var openapiwx = openapi.initWeixin({
					  appId: appId,
					  secret: secret,
					  accessToken:token
					})
					if(wx_openid[i].wx_openid){
						try {
							var result = openapiwx.subscribeMessage.send({
								"touser": wx_openid[i].wx_openid['mp-weixin'],
								"page": "/shop/manage/order/order?id="+info._id,
								'template_id': "E68oDfU169LbWm5Hk2JLJeQ6qlBUYfS6uEX1kH_h35M",
								'data': {
									"number7": {
										"value":info.order_id
									},
									"thing6": {
										"value": info.ids[0].name.substring(0, 20)
									},
									"thing1": {
										"value": info.refund_res.substring(0, 20)
									},
									"amount9": {
										"value": info.pay_money
									},
									"date10": {
										"value": getitme(info.create_date)
									}
								}
							  })
							return result
						  } catch (err) {
							return err
						  }
					}
				}
			}
		break;
		case 'RefundReviewNoticeShop'://退款审核通知 商户
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true,
				status:4
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await dbuser.where({
					store_id: info.store_id
				}).get()
			
				var wx_openid = user.data;
				for(var i=0;i<wx_openid.length;i++){
					var accurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
					var token;
					var acctk = await uniCloud.httpclient.request(accurl, {
						method: 'GET',
						dataType: 'json'
					}).then((ack)=>{
						token = ack.data.access_token;
					})
					
					var openapiwx = openapi.initWeixin({
					  appId: appId,
					  secret: secret,
					  accessToken:token
					})
					if(wx_openid[i].wx_openid){
						try {
							var result = openapiwx.subscribeMessage.send({
								"touser": wx_openid[i].wx_openid['mp-weixin'],
								"page": "/shop/manage/order/order?id="+info._id,
								'template_id': "DDvm1XYWBHqxRgoojmQrMD6WG2rqw3pORcbq7z5yGDc",
								'data': {
									"character_string7": {
										"value":info.order_id
									},
									"thing2": {
										"value": info.ids[0].name.substring(0, 20)
									},
									"amount3": {
										"value": info.pay_money
									},
									"phrase5": {
										"value": "待退款"
									},
									"thing6": {
										"value": info.refund_res.substring(0, 20)
									}
								}
							  })
							return result
						  } catch (err) {
							return err
						  }
					}
				}
			}
		break;
		case 'OrderCompletedNotification'://订单已完成通知给用户
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true,
				status:3
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin']; 
				
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/user/order/info?id="+info._id,
						'template_id': "WyPKnL0yL1wry_7IVpWG6Wd72TdEWLgW5tNUS7M8oYg",
						'data': {
							"thing3": {
								"value":info.ids[0].name.substring(0, 20)
							},
							"thing5": {
								"value": info.take_address.substring(0, 20)
							},
							"character_string10": {
								"value": info.order_id.substring(0, 20)
							},
							"time19": {
								"value": getitme(info.create_date)
							},
							"date9": {
								"value": getitme(info.finish_time)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'OrderDeliveryNotice'://订单配送通知给用户
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true,
				status:2
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin']; 
				
				var stuser = await dbuser.where({
					store_id: info.store_id
				}).get()
				
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/user/order/info?id="+info._id,
						'template_id': "LmeczVAWZm_n0hzrseuzwSBDMDhOFzqbpVZBbYsFStY",
						'data': {
							"character_string1": {
								"value":info.order_id.substring(0, 20)
							},
							"thing8": {
								"value": info.ids[0].name.substring(0, 20)
							},
							"phone_number10": {
								"value": stuser.data[0].mobile
							},
							"time22": {
								"value": getitme(info.delivery_time)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'RefundReviewNoticeUser'://退款审核通知 用户
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				var title;
				var refund_res;
				if(info.status==5){
					title="已退款";
					refund_res="商家通过了退款申请"
				}else{
					title="拒绝";
					refund_res=info.no_refund_res
				}
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin']; 
				
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/user/order/info?id="+info._id,
						'template_id': "DDvm1XYWBHqxRgoojmQrMD6WG2rqw3pORcbq7z5yGDc",
						'data': {
							"character_string7": {
								"value":info.order_id
							},
							"thing2": {
								"value": info.ids[0].name.substring(0, 20)
							},
							"amount3": {
								"value": info.pay_money
							},
							"phrase5": {
								"value": title
							},
							"thing6": {
								"value": refund_res.substring(0, 20)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'OrderProcessingNotification'://订单处理通知给用户
			res = await dborder
			  .where({
				_id: event.id,
				is_pay:true,
				status:5
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin']; 
				
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/user/order/info?id="+info._id,
						'template_id': "xPQILFhAa-7rrz4dNYfEkMz3Py7GNBiQR9UvJjQFwZk",
						'data': {
							"character_string1": {
								"value":info.order_id
							},
							"phrase2": {
								"value": '已退款'
							},
							"thing3": {
								"value": info.ids[0].name.substring(0, 20)
							},
							"amount4": {
								"value": info.pay_money
							},
							"thing9": {
								"value": '全额退款'
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'assistOrderCompletionNotice'://订单完成通知 给业务员
			res = await dbassist
			  .where({
				_id: event.id,
				is_pay:true,
				status:3
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				
				var jduser=await  dbuser.where({
					_id: info.join_uid
				}).get()
				touser = jduser.data[0].wx_openid['mp-weixin']; 
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/assist/detail/detail?id="+info._id,
						'template_id': "mPVgV3IvEXPDlOSn2ZAWX8JT3DAeskaiYH_I8sY-GUI",
						'data': {
							"character_string1": {
								"value":info.order_id
							},
							"thing12": {
								"value": getordertype(info.type)
							},
							"thing11": {
								"value": jduser.data[0].real_name.substring(0, 20)
							},
							"amount10": {
								"value": info.pay_money
							},
							"time4": {
								"value": getitme(info.finish_time)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'HelperReceivingNotice'://帮手接单通知 给用户
			res = await dbassist
			  .where({
				_id: event.id,
				is_pay:true,
				status:2
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin']; 
				
				var jduser=await  dbuser.where({
					_id: info.join_uid
				}).get()
				
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/assist/detail/detail?id="+info._id,
						'template_id': "O6JJHqEZrsYNLfEhxmvRwCAh2_k8Q8jgWAOV_NG7Gec",
						'data': {
							"phrase1": {
								"value":"帮手已接单"
							},
							"thing2": {
								"value": info.des.substring(0, 20)
							},
							"time3": {
								"value": getitme(info.join_time)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'NoticeToBeReviewedAdmin'://待审核通知管理员
			res = await dbuapply
			  .where({
				_id: event.id
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await dbuser.where({
					is_manage: true
				}).get()
			
				var wx_openid = user.data;
				for(var i=0;i<wx_openid.length;i++){
					var accurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
					var token;
					var acctk = await uniCloud.httpclient.request(accurl, {
						method: 'GET',
						dataType: 'json'
					}).then((ack)=>{
						token = ack.data.access_token;
					})
					
					var openapiwx = openapi.initWeixin({
					  appId: appId,
					  secret: secret,
					  accessToken:token
					})
					if(wx_openid[i].wx_openid){
						try {
							var result = openapiwx.subscribeMessage.send({
								"touser": wx_openid[i].wx_openid['mp-weixin'],
								"page": "/admin/userapply/info?id="+info._id,
								'template_id': "BwEPL8aWlukMY_tX9ygnQHTj584UyxrPyW4kZRkm8UQ",
								'data': {
									"name1": {
										"value":info.real_name.substring(0, 3)
									},
									"thing3": {
										"value": info.type==1 ? '业务员' : '店铺'
									},
									"time2": {
										"value": getitme(info.create_date)
									}
								}
							  })
							return result
						  } catch (err) {
							return err
						  }
					}
				}
			}
		break;
		case 'NotificationOfAuditResults'://审核结果通知 给用户 跑腿 开店申请
			res = await dbuapply
			  .where({
				_id: event.id,
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await  dbuser.where({
					_id: info.uid
				}).get()
				touser = user.data[0].wx_openid['mp-weixin']; 
				
				try {
					const result = await openapiWeixin.subscribeMessage.send({
						"touser": touser,
						"page": "/user/form/form?id="+info._id+"&type="+info.type,
						'template_id': "UNF_0URHjtfuDFu-h9ywjoxqs4HAul13My8mvVR4FIU",
						'data': {
							"thing3": {
								"value":info.type==1 ? '业务员' : '店铺'
							},
							"date4": {
								"value": getitme(info.sh_time)
							},
							"phrase1": {
								"value": info.real_name.substring(0, 20)
							},
							"time9": {
								"value": getitme(info.create_date)
							}
						}
					  })
					return result
				  } catch (err) {
					return err
				  }
			}
		break;
		case 'NewOrderNotificationErrand'://新订单通知跑腿 给业务员
			res = await dbassist
			  .where({
				_id: event.id,
				is_pay:true,
				status:1
			  })
			  .get()
			if(res.data.length==1){
				var info=res.data[0];
				user = await dbuser.where({
					school_id: info.school_id,
					is_assist:true
				}).get()
			
				var wx_openid = user.data;
				for(var i=0;i<wx_openid.length;i++){
					var accurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + secret + "";
					var token;
					var acctk = await uniCloud.httpclient.request(accurl, {
						method: 'GET',
						dataType: 'json'
					}).then((ack)=>{
						token = ack.data.access_token;
					})
					
					var openapiwx = openapi.initWeixin({
					  appId: appId,
					  secret: secret,
					  accessToken:token
					})
					if(wx_openid[i].wx_openid){
						try {
							var result = openapiwx.subscribeMessage.send({
								"touser": wx_openid[i].wx_openid['mp-weixin'],
								"page": "/assist/detail/detail?id="+info._id,
								'template_id': "29cwShRFGCkXBt7BzBvS20OVjDNLqeLtRB4d9r_czCY",
								'data': {
									"thing1": {
										"value":getordertype(info.type)
									},
									"amount3": {
										"value": info.pay_money
									},
									"date6": {
										"value": getitme(info.create_date)
									},
									"thing10": {
										"value": info.address ? info.address.substring(0, 20) : '无'
									}
								}
							  })
							return result
						  } catch (err) {
							return err
						  }
					}
				}
			}
		break;
	}
};
