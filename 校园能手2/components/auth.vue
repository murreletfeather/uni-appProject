<template>
	<view>
		<u-popup v-model="show" mode="center" border-radius="14" :mask-close-able="false">
			<view class="padding-lx">
				<view class="text-center">
					<image src="../static/logo.png" mode="scaleToFill" style="width: 120rpx;height: 120rpx;"></image>
					<view class="">
						请授权个人信息进行登录
					</view>
				</view>
				<view class="flex margin-top">
					<button @click="show=false" style="width: 220rpx;margin-right: 16rpx;"
						class="round  cu-btn">取消</button>
						<!-- #ifdef MP-QQ -->
						<button  open-type="getUserInfo" @getuserinfo="getuserinfo" style="width: 220rpx;"
							class="round item-bgr cu-btn">授权</button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button  open-type="getUserInfo" @tap="login" style="width: 220rpx;"
							class="round item-bgr cu-btn">授权</button>
						<!-- #endif -->
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		name: "auth",
		data() {
			return {
				show: false,
				Info:''
			};
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/login'
			}),
			showpop() {
				this.show = true
			},
			login(){
				var that=this
				//#ifdef MP-WEIXIN
				uni.getUserProfile ({
					desc:'用于完善会员资料',
					lang:"zh_CN",
					success: (info) => {
						uni.login({
						  provider: 'weixin',
						  success(res) {
							uniCloud.callFunction({
							  name:"login-by-weixin",
							  data: {
								  funct:"login",
								  code:res.code,
								  info:info.userInfo
							  },
							  success(e) {
								  if(e.result.code==0 && e.result.userInfo.avatar){
								  	that.setUserInfo(e.result)
									that.requs()
								  }else{
									  uni.showToast({
									  	title: "微信登录授权失败",
									  	icon: "none"
									  });
								  }
							  }
							})
						  },
						  fail(err) {
							reject(new Error('微信登录失败'))
						  }
						})
					},
					fail: (e) => {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				})
				//#endif
			},
			getuserinfo(e){
				var that=this
				uni.login({
					provider:"qq",
					success(res) {
						uniCloud.callFunction({
						  name:"login-by-weixin",
						  data: {
							  funct:"loginByQQ",
							  code:res.code,
							  info:e.detail.userInfo
						  },
						  success(e) {
							  if(e.result.code==0 && e.result.userInfo.avatar){
							  that.setUserInfo(e.result)
								that.requs()
							  }else{
								  uni.showToast({
								  	title: "QQ登录授权失败",
								  	icon: "none"
								  });
							  }
						  }
						})
					},
					fail(err) {
						reject(new Error('QQ登录失败'))
					}
				})
			},
			requs(){
				this.show = false
				this.$parent.authSuccess();
			}
		}
	}
</script>

<style lang="scss">
	.padding-lx {
		padding: 30rpx;
	}
</style>
