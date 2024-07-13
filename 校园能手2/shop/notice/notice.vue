<template>
	<view class="padding bg-white">
		<view class="flex justify-between">
			<view class="">
				订单通知
			</view>
			<view class="">
				<button @click="settempst1" class="cu-btn round bg-green">订阅</button>
			</view>
		</view>
		<view class="flex justify-between margin-top-sm">
			<view class="">
				服务通知
			</view>
			<view class="">
				<button @click="settempst2" class="cu-btn round bg-green">订阅</button>
			</view>
		</view>
		<!-- <view class="flex justify-between margin-top-sm">
			<view class="">
				工单通知
			</view>
			<view class="">
				<button @click="settempst3" class="cu-btn round bg-green">订阅</button>
			</view>
		</view> -->
		<view class="margin-top-xl">
			<view class="">
				订阅消息之后将通过微信小程序订阅消息发送相关服务信息，务必订阅，否则无法接收服务订单信息
			</view>
			<view class="">
				<image src="../../static/dyxx.png" mode="aspectFit" style="width: 100%;height: 800rpx;"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			settempst1(){
				var that=this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
				  tmplIds: ['aQwqp-1Y_3hE7b3gvYY0HTAqhbTWa8AMteB5fU5GOqg','HaBy1DKNPfsnS27Vh7PqW7GBHbCVZ14BGhmAhvElpY8','E68oDfU169LbWm5Hk2JLJeQ6qlBUYfS6uEX1kH_h35M']
				})
				//#endif	
			},
			settempst2(){
				var that=this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
				  tmplIds: ['DDvm1XYWBHqxRgoojmQrMD6WG2rqw3pORcbq7z5yGDc','60tdhURWOAghousEcDOGcoFHDFXIvk9OYASvsVhmMUI']
				})
				//#endif	
			},
		}
	}
</script>

<style lang="less">

</style>
