<template>
	<view>
		<view  v-if="info" class="" style="margin-bottom: 120rpx;">
			<view class="bg-white radis-img" style="margin: 15rpx;"  >
				<view class="padding-sm" v-for="(res,index) in info.ids" :key="index" @click="prodDetail(res._id)">
					
					<view class="flex " >
						<view class="">
							<image :src="res.cover" mode=" aspectFill" style="width: 140rpx;height: 140rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="margin-left-sm" style="height: 140rpx;width: 100%;">
							<view class="" style="height: 100rpx;">
								{{res.name}}
							</view>
							<view class="flex justify-between">
								<view class="text-red" style="font-size: 34rpx;font-weight: 600;">
									￥{{res.price}}
								</view>
								<view class="">
									x {{res.count}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="padding bg-white radis-img" style="margin: 15rpx;" >
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">收货人：{{info.take_user}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">手机号：{{info.take_phone}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">送达地址：{{info.take_address}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					备注：{{info.remarks}}
				</view>
			</view>
			
			<view class="padding bg-white radis-img" style="margin: 15rpx;" >
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">订单号：{{info.order_id}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">订单金额：<text class="text-orange" style="font-size: 34rpx;font-weight: 600;">￥{{info.pay_money}}</text></view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">下单时间：{{$u.timeFormat(info.create_date, 'yyyy-mm-dd hh:MM:ss')}}</view>
				</view>
				
				<template v-if="info.is_pay">
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">订单状态：
						<view class="cu-tag radius bg-orange" v-if="info.status==1">待配送</view>
						<view class="cu-tag radius bg-green" v-else-if="info.status==2">待收货</view>
						<view class="cu-tag radius bg-green'>" v-else-if="info.status==3">订单完成</view>
						<view class="cu-tag radius bg-blue" v-else-if="info.status==4">退款中</view>
						<view class="cu-tag radius bg-yellow" v-else-if="info.status==5">已退款</view>
						</view>
					</view>
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">支付时间：{{$u.timeFormat(info.pay_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
					</view>
					<view class="cu-form-group"  v-if="info.status==2" style="padding: 0;">
						<view class="title">配送时间：{{$u.timeFormat(info.delivery_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
					</view>
				</template>
				<template class="" v-else>
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">订单状态：
						<view class="cu-tag radius bg-orange">待支付</view>
						</view>
					</view>
				</template>
				
				<view class="cu-form-group" style="padding: 0;" v-if="info.status==5 || info.status==4">
					<view class="title">退款原因：{{info.refund_res}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;" v-if="info.status==5">
					<view class="title">退款时间：{{$u.timeFormat(info.refund_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
				</view>
			</view>
			
			<view class="padding bg-white radis-img " style="margin: 15rpx;">
				<view class="">
					支付方式
				</view>
				<view class="">
					<radio-group class="block">
						<view class="cu-form-group margin-top">
							<view class="title">
								<text class="cuIcon-weixin" style="font-size: 36rpx;color: #18B566;"></text>
								微信支付</view>
							<radio class='radio' color="#00bc8e" checked></radio>
						</view>
					</radio-group>
				</view>
			</view>
		</view>
		
		<view class="cu-bar bg-white tabbar  shop foot justify-end" style="padding: 0 26rpx;" v-if="info">
			<view class="" v-if="info.is_pay">
				<button class="cu-btn bg-grey round shadow-blur" @click="refund" v-if="info.status==1">申请退款</button>
				<button class="cu-btn bg-orange round shadow-blur margin-left" @click="receipt" v-if="info.status==2">确认收货</button>
				<button class="cu-btn bg-green round shadow-blur margin-left" @click="backhome">回到首页</button>
			</view>
			<view class="" v-else>
				<button class="cu-btn bg-orange round shadow-blur margin-left" @click="settempst1" >立即支付</button>
				<button class="cu-btn bg-green round shadow-blur margin-left" @click="backhome" >回到首页</button>
			</view>
		</view>
		
		<u-modal v-model="show" title="退款申请" show-cancel-button @cancel="cancel" @confirm="confirm">
			<view class="slot-content padding">
				<u-input v-model="refund_res" placeholder="请输入退款原因" type="textarea" />
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		data() {
			return {
				show:false,
				refund_res:'',
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
			if(this.id && this.hasLogin){
				this.orderinfo()
			}
		},
		methods: {
			orderinfo(){
				uni.showLoading({
				    title: '加载中'
				});
				db.collection('mdsh-order')
				.where({
					del: false,
					_id: this.id,
					uid:db.env.uid
				})
				.get().then((res) => {
					uni.hideLoading();
					const data = res.result.data
					if (data.length ==1) {
						this.info=data[0]
					} else {
						uni.showToast({
							icon:"none",
							title:'订单不存在'
						})
					}
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
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
							type:1,
							id:that.id
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
											uni.showToast({
												icon:"success",
												title:"支付成功"
											})
											that.orderinfo()
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
			refund(){
				this.settempst()
			},
			cancel(){
				this.refund_res=''
			},
			confirm(){
				if(this.refund_res<4) return this.showtotal('请输入退款原因4字符以上')
				db.action('order-refund')
				.collection('mdsh-order')
				.where({
					del: false,
					_id: this.id,
					is_pay:true,
					uid:db.env.uid
				})
				.update({
					status:4,
					refund_apply_time:db.env.now,
					refund_money:this.info.pay_money,
					refund_res:this.refund_res,
				}).then((res) => {
					uni.showToast({
						icon:"success",
						title:"申请成功，等待商家处理"
					})
					this.orderinfo()
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},
			settempst(){
				//#ifdef MP-WEIXIN
				var that=this;
				uni.requestSubscribeMessage({
				  tmplIds: ['DDvm1XYWBHqxRgoojmQrMD6WG2rqw3pORcbq7z5yGDc'],
				  complete(){
					  that.show=true
				  }
				})
				//#endif
				// #ifndef MP-WEIXIN
				this.show=true
				//#endif
			},
			settempst1(){
				var that=this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
				   tmplIds: ['LmeczVAWZm_n0hzrseuzwSBDMDhOFzqbpVZBbYsFStY','xPQILFhAa-7rrz4dNYfEkMz3Py7GNBiQR9UvJjQFwZk','WyPKnL0yL1wry_7IVpWG6Wd72TdEWLgW5tNUS7M8oYg'],
				  complete (res) {
				  	that.pay()
				  }
				})
				//#endif	
			},
			backhome(){
				uni.reLaunch({
					url:"/pages/index/index"
				})
			},
			receipt(){
				var that=this;
				uni.showModal({
				    title: '',
				    content: '是否已收到物品？',
				    success: function (res) {
				        if (res.confirm) {
				        	db.action('order-receipt')
				        	.collection('mdsh-order')
				        	.where({
				        		del: false,
				        		_id: that.id,
								is_pay:true,
								uid:db.env.uid
				        	})
				        	.update({
				        		status:3,
				        		confirm_time:db.env.now
				        	}).then((res) => {
				        		uni.showToast({
				        			icon:"success",
				        			title:"欢迎下次光临"
				        		})
				        		that.orderinfo()
				        	}).catch((err) => {
				        		uni.hideLoading();
				        		uni.showModal({
				        			content: err.message || '请求服务失败',
				        			showCancel: false
				        		})
				        	})
				        	
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			showtotal(title){
				uni.showToast({
					icon:"none",
					title:title
				})
			},
			prodDetail(id){
				uni.navigateTo({
					url:"/shop/product/product?id="+id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>