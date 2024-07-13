<template>
	<view class="flex flex-col pt-20 text-gray-800">
		<view class="flex flex-col items-center space-y-4">
			<image class="w-20" mode="widthFix" :src="logo"></image>
			<text class="text-2xl font-bold leading-none text-gray-800">南山咖啡</text>
			<text class="text-sm text-gray-400">Coffee Shop App</text>
		</view>
		<view class="flex flex-col items-center justify-center space-y-2 mt-10 text-xl font-bold">
			<text class="text-gray-600">记得爱。记得时光</text>
			<text class="text-gray-700">每个时刻，都有南山与你为伴</text>
		</view>
		
		<view class="px-8 mt-10">
			<button  @click="goto" class="flex items-center justify-center w-full h-14 space-x-2 rounded-full text-base capitalize font-bold" type="default">
				<image class="w-6 h-6" mode="widthFix" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/172d3297-2923-4a48-a9fa-b3e2c9ef8888.svg"></image>
				<text>使用电子邮箱登录</text>
			</button>
		</view>
		
		<view class="flex flex-col items-center px-8 py-10 mt-8">
			<text class="text-sm text-gray-400">其他登录方式</text>
			<view class="grid grid-cols-4 gap-6 mt-5">
				<button class="flex items-center justify-center w-8 h-8 rounded-full" type="default">
					<uni-icons type="weixin" color="#FFFFFF" size="40"></uni-icons>
				</button>
				<button class="flex items-center justify-center w-8 h-8 rounded-full" type="default">
					<uni-icons type="weibo" color="#FFFFFF" size="40"></uni-icons>
				</button>
				<button class="flex items-center justify-center w-8 h-8 rounded-full" type="default">
					<uni-icons type="qq" color="#FFFFFF" size="40"></uni-icons>
				</button>
				<button class="flex items-center justify-center w-8 h-8 rounded-full" type="default">
					<uni-icons type="zhifubao" color="#FFFFFF" size="40"></uni-icons>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/9a0371aa-41f6-4982-a421-3a20a239f726.png",
			};
		},
		methods:{
			goto(){
				uni.navigateTo({
					url: '/pages/signin/login'
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
