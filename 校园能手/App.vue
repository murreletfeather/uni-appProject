<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			this.login()
			// #endif
			//#ifdef MP-QQ
			this.loginByqq()
			// #endif
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		},
		methods:{
			...mapMutations({
				setUserInfo: 'user/login'
			}),
			login(){
				// #ifdef MP-WEIXIN
				var that=this;
				uni.login({
				  provider: 'weixin',
				  success(res) {
					uniCloud.callFunction({
						name:"login-by-weixin",
						data:{
							funct:"getuserinfo",
							code:res.code
						},
						success(res) {
							if(res.result.code==0){
								if(res.result.userInfo.nickName){
									that.setUserInfo(res.result)
								}
							}else{
								uni.showModal({
									content: res.result.message,
									showCancel: false
								})
							}
						}
					})
				  },
				  fail(err) {
					  uni.showToast({
						  icon:"none",
					  	title:"登录失败"
					  })
				  }
				})
				// #endif
			},
			loginByqq(){
				// #ifdef MP-QQ
				var that=this;
				uni.login({
				  provider: 'qq',
				  success(res) {
					uniCloud.callFunction({
						name:"login-by-weixin",
						data:{
							funct:"getuserinfoqq",
							code:res.code
						},
						success(res) {
							if(res.result.code==0){
								if(res.result.userInfo.nickName){
									that.setUserInfo(res.result)
								}
							}else{
								uni.showModal({
									content: res.result.message,
									showCancel: false
								})
							}
						}
					})
				  },
				  fail(err) {
					  uni.showToast({
						  icon:"none",
					  	title:"登录失败"
					  })
				  }
				})
				// #endif
			},
			getsysteminfo(){
				//#ifdef APP-VUE
				uni.setStorageSync('system',3)
				//#endif
				//#ifdef H5
				uni.setStorageSync('system',4)
				//#endif
				//#ifdef MP-QQ
				uni.setStorageSync('system',2)
				//#endif
				//#ifdef MP-WEIXIN
				uni.setStorageSync('system',1)
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "static/xiaoyuan.css";
	@import url("./common/aui/css/aui.css");
	@import url("./common/aui/css/aui.iconfont.css");
	.radis-img {
		border-radius: 15upx;
	}
	.line-clamp1 {
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	}
	.line-clamp2 {
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	}
	.item-bgr {
		background-image: linear-gradient(45deg, #52bde8, #73eac4);
		color: #ffffff;
	}

	.item-bgs {
		background-color: #00bc8e;
		color: #ffffff;
	}

	.item-color {
		color: #00bc8e;
	}

	.item-bg {
		background-color: #f6f9f9;
	}

	.item-title {
		font-weight: 700;
		font-size: 36upx;
	}

	.margin-bottom {
		margin-bottom: 30rpx;
	}

	.box-bg {
		background-color: #F8F8F8;
	}
	.bg-z{
		background-color: #7674f3;
		color: #FFFFFF;
	}
	.item-z{
		color: #7674f3;
	}
	.shadowit{
	   -webkit-box-shadow: #c8c8c8 0px 0px 10px; 
	   -moz-box-shadow: #c8c8c8 0px 0px 10px; 
	   box-shadow: #c8c8c8 0px 0px 10px; 
	} 
</style>
