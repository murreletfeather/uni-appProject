<template>
	<view class="padding bg-white">
		<view class="flex justify-between">
			<view class="">
				服务通知
			</view>
			<view class="">
				<button @click="settempst1" class="cu-btn round bg-green">订阅</button>
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
				  tmplIds: ['BwEPL8aWlukMY_tX9ygnQHTj584UyxrPyW4kZRkm8UQ']
				})
				//#endif	
			}
		}
	}
</script>

<style lang="less">

</style>
