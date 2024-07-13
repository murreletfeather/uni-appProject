<template>
	<view>
		<view class="">
			<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/9f446dc7-bbce-40fd-8982-2b054d47c82b.png" mode="scaleToFill" style="width: 100%;height: 500rpx;"></image>
		</view>
		<view class="">
			<uni-notice-bar background-color="#FFFFFF" showIcon="true" scrollable="true" single="true" :text="notice"></uni-notice-bar>
		</view>
		<view class="">
			<view class="cu-form-group">
				<input placeholder="请输入视频链接" style="border: 1rpx solid #39b54a;padding: 30rpx 20rpx;border-radius: 15rpx;height: 100rpx;" v-model="url"></input>
				<button class='cu-btn bg-green shadow margin-left-sm' @click="jiexi">解析</button>
			</view>
		</view>
		<view class="text-center">
			支持100多个视频平台解析去水印
		</view>
		<view class="padding text-center flex">
			<button class="cu-btn flex-sub bg-green shadow padding-sm margin-xs radius" @click="getclip">粘贴地址</button>
			<button class="cu-btn flex-sub bg-grey shadow padding-sm margin-xs radius" @click="clear">清空地址</button>
		</view>
		
		<view class="">
			<view class="cu-list menu card-menu margin-top">
				<view class="cu-item arrow">
					<view class="content" @click="question">
						<text class="cuIcon-qrcode text-grey"></text>
						<text class="text-grey">常见问题</text>
					</view>
				</view>
				<view class="cu-item arrow">
					<view class="content" @click="about">
						<text class="cuIcon-usefull text-grey"></text>
						<text class="text-grey">联系我们</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				notice:"有问题请联系我们反馈"
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '去水印助手',
				path: '/jiexi/index/index'
			}
		},
		onShareTimeline() {
			return {
				title: '去水印助手',
				path: '/jiexi/index/index'
			}
		},
		methods: {
			question(){
				uni.navigateTo({
					url:"../question/question"
				})
			},
			about(){
				
			},
			jiexi(){
				if(this.url==''){
					uni.showToast({
						icon:"none",
						title:"请输入视频链接"
					})
				}else{
					uni.navigateTo({
						url:"../result/result?url="+this.url
					})
				}
			},
			getclip(){
				var that=this
				uni.getClipboardData({
				    success: function (res) {
				        that.url=res.data
				    }
				});
			},
			clear(){
				this.url=''
			}
		}
	}
</script>

<style>

</style>
