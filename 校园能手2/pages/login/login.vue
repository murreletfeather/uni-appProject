<template>
	<view>
		<input type="text" placeholder="请输入用户名" v-model="form.username" />
		<input type="text" placeholder="请输入密码" v-model="form.password" />
		<view class="captcha-box" v-if="captchaBase64">
			<image class="captcha-img" @click="createCaptcha" :src="captchaBase64" mode="widthFix"></image>
			<input type="text" class="input-box captcha" :inputBorder="false" v-model="form.captcha" placeholder="请输入验证码"/>
		</view>
		<button type="default" @click="loginIn">登录</button>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				form:{
					username:'',
					password:'',
					nickname:""
				},
				captchaBase64:'',
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			console.log(this.userInfo);
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/login'
			}),
			loginIn(){
				uniCloud.callFunction({
					name:'uni-id-cf',
					data:{
						action:'login',
						params:this.form
					},
					success: ({result}) => {
						console.log(result);
						if (result.code === 0) {
							this.setUserInfo(result)
						} else {
							if (result.needCaptcha) {
								uni.showToast({
									title: result.msg,
									icon: 'none'
								});
								this.createCaptcha()
							}else{
								uni.showModal({
									title: '错误',
									content: result.msg,
									showCancel: false,
									confirmText: '知道了'
								});
							}
						}
					}
				})
			},
			createCaptcha(){
				uniCloud.callFunction({
					name:'uni-id-cf',
					data:{
						action:'createCaptcha',
						params:{
							scene: "login"
						},
					},
					success: ({result}) => {
						if (result.code === 0) {
							this.captchaBase64 = result.captchaBase64
						}else{
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					}
				})
			},
		}
	}
</script>

<style>

</style>
