<template>
	<view>
		<view class="grid col-1" v-if="hasLogin">
			<view class="bg-img padding-top-xl flex align-end" style="height: 540upx;background-repeat: no-repeat;" :style="[{ backgroundImage:'url(' + userinfo.backgroundImage + ')' }]">
				<view class="bg-shadeBottomb padding padding-top flex-sub">
					<view>
						<view class="flex justify-between align-center">
							<view class="cu-avatar xl round" style="border: 4rpx solid #FFFFFF;" :style="[{ backgroundImage:'url(' + userinfo.avatar+ ')' }]">
								<view class="cu-tag badge" :class="userinfo.gender==1?'cuIcon-female bg-pink':'cuIcon-male bg-blue'"></view>
							</view>
							<view class="">
								<button @click="editor" class="cu-btn round bg-blue">个人中心</button>
							</view>
						</view>
						<view class="margin-top" style="font-size: 34rpx;font-weight: 500;">
							{{userinfo.nickName}}  
						</view>
						<view class="margin-top-sm" style="font-size: 24rpx;">
							{{userinfo.introduce ? userinfo.introduce : '暂无个人简介'}}
							<text class="cuIcon-edit margin-left-sm"></text>
						</view>
					</view>
					<view class="margin-top-sm" style="font-size: 24rpx;">
						<!-- <view class="cu-avatar xl round" style="border: 4rpx solid #FFFFFF;" :style="[{ backgroundImage:'url(' + userinfo.avatar+ ')' }]">
						</view> -->
						{{userinfo.school ? userinfo.school : '请绑定学校'}}
					</view>
					<!-- <view class="flex justify-between margin-top">
						<view class="flex flex-sub justify-between">
							<view class="">
								1获赞
							</view>
							<view class="">
								1关注
							</view>
							<view class="">
								1粉丝
							</view>
						</view>
						<view class="flex-sub"></view>
					</view> -->
				</view>
			</view>
		</view>
		<view class="grid col-1" v-else>
			<view class="bg-img padding-top-xl flex align-end" style="height: 540upx;background-repeat: no-repeat;background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/799097e4-177b-4a20-9e28-5b81be356293.png);">
				<view class="bg-shadeBottomb flex-sub text-center" @click="login">
					<view class="cu-avatar xl round" style="background-image:url(../../static/refresh_loading_frog.png);border: 4rpx solid #FFFFFF;"></view>
					<view class="margin-top margin-bottom-xl" style="font-size: 34rpx;font-weight: 500;">
						请登录 
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="grid bg-white margin-sm text-center col-4" style="border-radius: 15rpx;">
			<view class="padding-sm" v-for="(res,index) in list" :key="index" @click="detail(res)">
				<image :src="res.cover" mode="scaleToFill" style="width: 70rpx;height: 70rpx;"></image>
				<view class="">
					{{res.name}}
				</view>
			</view>
		</view>
		
		<!-- 功能结束 -->
		<view class="padding bg-white radis-img " style="margin: 15rpx;">
			<view class=" flex text-center bg-white flex-wrap">
				<view class="padding-sm" style="width: 25%;">
					<image src="../../static/system/kf.png" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
					<view class="">
						<!-- #ifndef MP -->
						客服
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button hover-class="none" class="cu-btn sm bg-white" style="font-size: 30rpx;" open-type="contact">客服</button>
						<!-- #endif -->
						<!-- #ifdef MP-QQ -->
						<button hover-class="none" class="cu-btn sm bg-white" style="font-size: 30rpx;" @addfriend="addfriend" open-type="addFriend" open-id="2175FEF85F22CFD4BA4A5D548E50E716">客服</button>
						<!-- #endif -->
					</view>
				</view>
				
				<view class="padding-sm" style="width: 25%;">
					<image src="../../static/system/gywm.png" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
					<view class="">
						<button hover-class="none" class="cu-btn sm bg-white" style="font-size: 30rpx;" open-type="feedback">反馈</button>
					</view>
				</view>
				<!-- #ifdef MP-QQ -->
				<view class="padding-sm" style="width: 25%;">
					<image src="../../static/system/qqq.png" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
					<view class="">
						<button hover-class="none" class="cu-btn sm bg-white" style="font-size: 30rpx;" open-type="openGroupProfile" group-id="244370240">官方群</button>
					</view>
				</view>
				<!-- #endif -->
				<view class="padding-sm" style="width: 25%;" v-if="userinfo && userinfo.is_manage" @click="admin">
					<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/0f9c2891-2b2d-416b-a721-5bb01f12c5eb.png" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
					<view class="">
						管理员
					</view>
				</view>
			</view>
		</view>
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import auth from "@/components/auth.vue"
	const db = uniCloud.database()
	export default {
		components: {
			auth
		},
		data() {
			return {
				keyword:'',
				list:[],
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			this.getfunct()
			//#ifdef MP-QQ
			uni.getSetting({
				success(res){
					if (!res.authSetting['setting.addFriend']) {
					  uni.authorize({
					  	scope:"setting.addFriend",
					  	success(e) {
					  		//console.log(e)
					  	},
						fail(e) {
							//console.log(e)
						}
					  })
					}
				},
				complete(e) {
					//console.log(e)
				}
			})
			//#endif
		},
		onShow() {
			
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.getfunct()
		},
		methods:{
			editor(){
				uni.navigateTo({
					url:"/user/info/info"
				})
			},
			pay(){
				//#ifdef MP-QQ
				qq.requestWxPayment({
				  url: "weixin://wxpay/s/An4baqw",
				  referer: "https://xiaoyuan.redlk.com",
				  success(res) {
					  console.log(res)
				  },
				  fail(res) { 
					  console.log(res)
				  }
				})
				//#endif
			},
			getfunct(){
				db.collection('mdsh-apply')
				.where({
					status: true,
					from:2,
					cate:'60d1aa9f9dad850001d0ae03',
				})
				.orderBy("sort desc")
				.get().then((res) => {
					const data = res.result.data
					this.list=data
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading();
					uni.stopPullDownRefresh()
				})
			},
			addfriend(e){
				uni.authorize({
					scope: "setting.addFriend",
					success(res) {
						  console.log(res)
				    }
				})
			},
			admin(){
				uni.navigateTo({
					url:"/admin/apply/apply"
				})
			},
			getuserinfo(){
				var that=this
				uniCloud.callFunction({
					name:"login-by-weixin",
					data:{
						funct:"getuserinfotoken",
						token:uni.getStorageSync('uni_id_token')
					},
					success(res) {
						if(res.result.code==-2){
							uni.showToast({
								icon:"none",
								title:res.result.message
							})
							that.login()
						}else{
							uni.setStorageSync('userinfo',res.result.userInfo)
							that.userinfo=uni.getStorageSync('userinfo')
							if(res.result.userInfo.school_id==''){
								uni.showToast({
									icon:"none",
									title:"请绑定学校"
								})
								setTimeout(() => {
									uni.navigateTo({
										url:"/user/school/school"
									})
								}, 2000)						
							}else{
								uni.setStorageSync('school_id',res.result.userInfo.school_id)
							}
						}
					}
				}) 
			},
			detail(e){
				if(this.hasLogin){
					if(e.type==1){//不处理
						
					}else if(e.type==2){//应用内
						uni.navigateTo({
							url:e.url+'&title='+e.name,
							success: res => {},fail: () => {},complete: () => {}
						})
					}else if(e.type==3){//链接
						uni.navigateTo({
							url:"../apply/web?url="+e.url
						})
					}else if(e.type==4){//小程序
						uni.navigateToMiniProgram({
						  appId: e.appid,
						  path: e.url,
						  extraData: e.extraData,
						  success(res) {
						    // 打开成功
						  }
						})
					}
				}else{
					this.login()
				}
			},
			login(){
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url: "/pages/login/login"
				})
				//#endif
			},
			authSuccess(){
				// this.getapply()
			},
			setschool(){
				if(this.hasLogin){
					uni.navigateTo({
						url:"/user/school/school"
					})
				}else{
					this.login()
				}
			}
		}
	}
</script>

<style lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30upx;
	}
</style>
