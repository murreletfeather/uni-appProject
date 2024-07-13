<template>
	<view class="">
		<view class="" v-if="info">
			<view class="bg-white margin-sm radis-img">
				<view class="solid-bottom padding-sm">
					类型：
					<view class='cu-tag radius bg-blue margin-right-sm' v-if="info.type==1">代买</view>
					<view class='cu-tag radius bg-orange margin-right-sm' v-else-if="info.type==2">代取</view>
					<view class='cu-tag radius bg-green margin-right-sm' v-else-if="info.type==3">代排队</view>
					<view class='cu-tag radius bg-yellow margin-right-sm' v-else-if="info.type==4">代课</view>
				</view>
				<view class="solid-bottom padding-sm">
					描述：{{info.des}}
				</view>
				<view class="solid-bottom padding-sm">
					费用：<text class="text-red" style="font-weight: 600;">{{info.pay_money}}</text>
				</view>
				<view class="solid-bottom padding-sm" v-if="info.type==1 || info.type==2">
					送达时间：{{info.arrive_time}}
				</view>
				<view class="solid-bottom padding-sm">
					用户：
					<view class="cu-avatar sm round shadow-warp margin-right-sm" :style="[{ backgroundImage:'url(' + info.uid[0].avatar+ ')' }]"></view>
					{{info.uid[0].nickName}}
				</view>
			</view>
			<view class="bg-white margin-sm radis-img">
				<view class="solid-bottom padding-sm">
					联系人：{{info.uname}}
				</view>
				<view class="solid-bottom padding-sm">
					联系电话：{{info.phone}}
				</view>
				<view class="solid-bottom padding-sm" v-if="info.type==1 || info.type==2">
					送货地址：{{info.address}}
				</view>
				<view class="solid-bottom padding-sm">
					隐私信息：{{info.hide_content}}
				</view>
				<view class="" v-if="info.status==2 || info.status==3">
					<view class="solid-bottom padding-sm">
						接单用户：{{info.join_user_name}}
					</view>
					<view class="solid-bottom padding-sm" @click="callPhone(info.join_user_phone)">
						接单用户手机：{{info.join_user_phone}}
					</view>
					<view class="solid-bottom padding-sm">
						接单时间：{{$u.timeFormat(info.join_time, 'yyyy-mm-dd hh:MM:ss')}}
					</view>
					<view class="solid-bottom padding-sm" v-if="info.finish_time">
						完成时间：{{$u.timeFormat(info.finish_time, 'yyyy-mm-dd hh:MM:ss')}}
					</view>
				</view>
				<view class="" v-if="info.is_refund">
					<view class="solid-bottom padding-sm">
						退款时间：{{$u.timeFormat(info.refund_time, 'yyyy-mm-dd hh:MM:ss')}}
					</view>
				</view>
			</view>
			
			<view class="text-center margin-top-xl" v-if="info.is_pay">
				<template v-if="info.status==1">
					<button class="cu-btn round sm item-bgr" style="width: 80%;height: 66rpx;">等待接单</button>
					<button class="cu-btn round sm bg-grey margin-top" style="width: 80%;height: 66rpx;" @click="sqrunf">申请退款</button>
				</template>
				<button class="cu-btn round sm bg-orange" style="width: 80%;height: 66rpx;" @click="receipt" v-else-if="info.status==2">确认完成</button>
				<button class="cu-btn round sm bg-grey" disabled style="width: 80%;height: 66rpx;" v-else-if="info.status==3">已完成</button>
				
				<button class="cu-btn round sm bg-grey" style="width: 80%;height: 66rpx;" v-else-if="info.status==5" disabled>已退款</button>
			</view>
			<view class="text-center margin-top-xl" v-else>
				<button class="cu-btn round sm item-bgr" style="width: 80%;height: 66rpx;" @click="settempst">立即支付</button>
			</view>
		</view>
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import auth from "@/components/auth.vue"
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		components: {
			auth
		},
		data() {
			return {
				id:'',
				info:'',
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad(e) {
			this.id=e.id
			if(this.hasLogin){
				if(this.id){
					this.getinfo()
				}else{
					uni.showToast({
						icon:"none",
						title:"参数错误"
					})
				}
			}else{
				this.login()
			}
		},
		methods: {
			getinfo(){
				uni.showLoading({
				    title: '加载中'
				});
				db.collection("mdsh-assist,uni-id-users").where({
					_id:this.id,
					uid:db.env.uid
				}).get({getOne:true}).then((res) => {
					this.info=res.result.data
				}).catch((err) => {
					uni.showModal({
						content: err.message || '查询失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			sqrunf(){
				var that=this
				uni.showModal({
				    title: '',
				    content: '确定要退款吗',
				    success: function (res) {
				        if (res.confirm) {
				            that.refund()
				        } else if (res.cancel) {
				           
				        }
				    }
				});
			},
			refund(){
				var that=this;
				uniCloud.callFunction({
					name: 'pay',
					data: {
						token:uni.getStorageSync('uni_id_token'),
						funct:'refund',
						id:that.id,
						type:2
					},
					success(res) {
						if(res.result.code==0){
							uni.showToast({
								icon:"success",
								title:res.result.message
							})
							that.getinfo()
						}else{
							uni.showToast({
								icon:"none",
								title:res.result.message
							})
						}
					}
				})
			},
			callPhone(phone){
				uni.makePhoneCall({
				    phoneNumber: phone
				});
			},
			pay(){
				var that=this
				new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: 'pay',
						data: {
							token:uni.getStorageSync('uni_id_token'),
							provider:'wxpay_mp-weixin',
							funct:'pay',
							type:2,
							id:that.info._id
						},
						success(res) {
							if (res.result.order) {
								return new Promise((resolve, reject) => {
									uni.requestPayment({
										// #ifdef APP-PLUS
										provider: selectedProvider,
										// #endif
										// #ifdef MP-WEIXIN
										...res.result.order,
										// #endif
										// #ifdef APP-PLUS || MP-ALIPAY
										orderInfo: res.result.order,
										// #endif
										success: function (res) {
											that.getinfo()
											uni.showToast({
												icon:"success",
												title:"支付成功"
											})
										},
										fail: function (err) {
											uni.showToast({
												icon:"none",
												title:"支付失败"
											})
										}
									})
								})
							} else {
								uni.showModal({
									content: '支付失败',
									showCancel: false
								})
							}
						},
						fail() {
							uni.showToast({
								icon:"none",
								title:"支付失败"
							})
						}
					})
				}).catch((err) => {console.log("结果"+err)
					uni.showModal({
						content: err.message || '支付失败',
						showCancel: false
					})
				})
			},
			settempst(){
				var that=this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
				  tmplIds: ['O6JJHqEZrsYNLfEhxmvRwCAh2_k8Q8jgWAOV_NG7Gec',
				  	'xPQILFhAa-7rrz4dNYfEkMqH_ookXcX5TJMouBIb2xk'
				  ],
				  complete (res) {
				  	that.pay()
				  }
				})
				//#endif	
			},
			receipt(){
				var that=this;
				uni.showModal({
				    title: '',
				    content: '业务员是否已完成任务？',
				    success: function (res) {
				        if (res.confirm) {
				            db.action("assist-receipt")
							.collection("mdsh-assist").where({
				            	_id:that.id,
				            	uid:db.env.uid
				            }).update({
								status:3,
								finish_time:db.env.now
							}).then((res) => {
				            	that.getinfo()
				            }).catch((err) => {
				            	uni.showModal({
				            		content: err.message || '操作失败',
				            		showCancel: false
				            	})
				            }).finally(() => {
				            	uni.hideLoading()
				            })
				        } else if (res.cancel) {
				            
				        }
				    }
				});
			},
			login() {
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url: "/pages/login/login"
				})
				//#endif
			},
			authSuccess() {
				// this.userinfo=uni.getStorageSync('userinfo')
			},
		}
	}
</script>

<style>

</style>
