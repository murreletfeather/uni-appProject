<template>
	<view class="relative container h-screen">
		<view class="relative min-h-full z-10 pt-20 text-white bg-green-700 bg-opacity-75 backdrop-filter backdrop-blur-sm">
			
			<view class="px-7">
				<view class="flex items-end">
					<image class="w-16" mode="widthFix" :src="logo"></image>
					<view class="flex flex-col items-start space-y-2">
						<text class="text-2xl leading-none  font-medium">用户登录</text>
						<text class="text-sm leading-none text-gray-300">南山咖啡，让美好与你更近一步</text>
					</view>
				</view>
				
				<form class="block mt-10" @submit="loginSubmit" @reset="loginReset">
					<view class="flex flex-col items-start space-y-2">
						<text class="capitalize text-gray-100">电子邮箱</text>
						<input class="form-input w-full text-sm" name="email" v-model="email" placeholder="请输入你的邮箱地址" />
					</view>
					<view class="flex flex-col items-start space-y-2 mt-7">
						<text class="capitalize text-gray-100">密码</text>
						<input class="form-input w-full text-sm" name="password" v-model="password" placeholder="请输入您的账户密码" />
					</view>
					<view class="flex items-center justify-between mt-8">
						<view class="text-sm underline text-gray-300">忘记密码？ </view>
						<button form-type="submit" class="flex items-center justify-center w-24 h-12 rounded-full bg-yellow-500 text-white">
							<text class="text-sm font-bold leading-none">登录</text>
						</button>
					</view>
				</form>
			</view>
			
			<view class="flex flex-col items-center px-7 mt-20">
				<text class="text-sm text-gray-200">~遇见你，相寻梦里路，飞雨落花中~</text>
				<button @click="goto" class="flex items-center justify-center w-full h-14 mt-3 rounded-full bg-yellow-200 text-base font-bold uppercase">创建账户</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/9a0371aa-41f6-4982-a421-3a20a239f726.png",
				email: 'Coffee2021@email.com',
				password: 'Coffee123'
			}
		},
		methods: {
			loginSubmit(){
				uni.switchTab({
					url: '/pages/store/list'
				})
			},
			loginReset(){
				
			},
			goto(){
				uni.navigateTo({
					url: '/pages/signin/register'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container::after{
		position: fixed;
		z-index: 0;
		top: 0;
		left: 0;
		content: '';
		width: 100vw;
		height: 100%;
		background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/cb8bb1e7-af42-4cf1-be15-47c9858bc74f.jpg);
		background-repeat: no-repeat;
		background-size: cover;
	}
	::v-deep .uni-input-placeholder{
		--tw-placeholder-opacity: 1;
		color: rgba(209, 213, 219, var(--tw-placeholder-opacity));
	}
	.form-input{
		height: 80rpx;
		border-bottom: 1px solid #059669;
	}
</style>
