<template>
	<view>
		<view  v-if="info"  style="margin-bottom: 120rpx;">
			<view class="bg-white radis-img" style="margin: 15rpx;"  >
				<view class="padding-sm" v-for="(res,index) in info.ids" :key="index">
					
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
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">订单状态：
						<template v-if="info.is_pay">
							<view class="cu-tag radius bg-orange" v-if="info.status==1">待发货</view>
							<view class="cu-tag radius bg-green" v-else-if="info.status==2">待收货</view>
							<view class="cu-tag radius bg-green'>" v-else-if="info.status==3">订单完成</view>
							<view class="cu-tag radius bg-blue" v-else-if="info.status==4">退款中</view>
							<view class="cu-tag radius bg-yellow" v-else-if="info.status==5">已退款</view>
						</template>
						<template v-else>
							<view class="cu-tag radius bg-orange">待支付</view>
						</template>
					</view>
				</view>
				<view class="cu-form-group" style="padding: 0;" v-if="info.is_pay">
					<view class="title">支付时间：{{$u.timeFormat(info.pay_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
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
			<view class="" style="position: absolute;right: 20rpx;">
				<button class="cu-btn bg-orange round shadow-blur" @click="settempst1" v-if="!info.is_pay">立即支付</button>
				<button class="cu-btn bg-orange round shadow-blur" @click="backhome" v-else>回到首页</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				info:'',
			}
		},
		onLoad(e) {
			this.id=e.id
			if(this.id){
				this.orderinfo()
			}
		},
		methods: {
			orderinfo(){
				uni.showLoading({
				    title: '加载中'
				});
				var that=this
				uniCloud.callFunction({
					name:"order",
					data:{
						funct:"order-info",
						id:that.id,
						token:uni.getStorageSync('uni_id_token')
					},
					success(res) {
						if(res.result.code==-2){
							uni.showToast({
								icon:"none",
								title:res.result.message
							})
						}else{
							that.info=res.result[0]
						}
						uni.hideLoading();
					}
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
			showtotal(title){
				uni.showToast({
					icon:"none",
					title:title
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>