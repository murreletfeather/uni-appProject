<template>
	<view class="bg-white">
		<!-- 功能 -->
		<view v-if="sgloading" class="u-skeleton padding">
			<view  v-for="(item,index) in 5" :key="index">
				<view class="u-skeleton-fillet margin-top-sm" style="width: 40%;height: 60rpx;">
				</view>
				<view class="grid col-4 margin-top-sm justify-between">
					<view v-for="(item,index) in 4" :key="index" class="u-skeleton-fillet" style="width: 140rpx;height: 140rpx;"></view>
				</view>
			</view>
		</view>
		<view v-else>
			<view v-for="(res,index) in list" :key="index">
				<view class="padding item-title">
					{{res.name}}
				</view>
				<!-- #ifdef MP-QQ -->
				<view class="grid bg-white margin-sm text-center col-4" style="border-radius: 15rpx;">
					<view class="padding-sm" v-for="(resb,indexb) in res._id['mdsh-apply']" :key="indexb"
						@click="detail(resb)" v-if="!resb.platform || resb.platform!='mpwx'">
						<image :src="resb.cover" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
						<view class="">
							{{resb.name}}
						</view>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="grid bg-white margin-sm text-center col-4" style="border-radius: 15rpx;">
					<view class="padding-sm" v-for="(resb,indexb) in res._id['mdsh-apply']" :key="indexb"
						@click="detail(resb)" v-if="!resb.platform || resb.platform!='mpqq'">
						<image :src="resb.cover" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
						<view class="">
							{{resb.name}}
						</view>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="grid bg-white margin-sm text-center col-4" style="border-radius: 15rpx;">
					<view class="padding-sm" v-for="(resb,indexb) in res._id['mdsh-apply']" :key="indexb"
						@click="detail(resb)">
						<image :src="resb.cover" mode="scaleToFill" style="width: 80rpx;height: 80rpx;"></image>
						<view class="">
							{{resb.name}}
						</view>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<!-- 功能结束 -->
		<auth ref="auth"></auth>
		<u-skeleton :loading="sgloading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import auth from "@/components/auth.vue"
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		components: {
			auth
		},
		data() {
			return {
				sgloading:true,
				list: []
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			});
			this.getDate()
		},
		onReady() {

		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.getDate()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮

			}
			return {
				title: '校园能手-应用中心',
				path: '/pages/apply/apply?id='
			}
		},
		onShareTimeline() {
			return {
				title: '校园能手-应用中心',
				path: '/pages/apply/apply?id='
			}
		},
		methods: {
			getDate() {
				db.collection('mdsh-apply-cate,mdsh-apply').where(
					dbCmd.and([{
							from: 1
						},
						{
							status: true
						},
						{
							'_id.mdsh-apply.status': true
						},
						{
							'_id.mdsh-apply.school_id': this.userinfo.school_id || ''
						}
					], )
				).orderBy("sort desc,list.sort desc").limit(200).get().then(res => {
					var data = res.result.data;
					this.list = data;
					this.sgloading=false;
					uni.hideLoading();
					uni.stopPullDownRefresh()
				})
				.catch(err => {
					this.sgloading=false;
					uni.hideLoading();
					uni.stopPullDownRefresh()
				})
			},
			detail(e) {
				if(this.hasLogin){
					if (e.type == 1) { //不处理
						
					} else if (e.type == 2) { //应用内
						uni.navigateTo({
							url: e.url + '&title=' + e.name,
							success: res => {},
							fail: () => {},
							complete: () => {}
						})
					} else if (e.type == 3) { //链接
						uni.navigateTo({
							url: "/pages/apply/web?url=" + e.url
						})
					} else if (e.type == 4) { //小程序
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
			login() {
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url: "/pages/login/login"
				})
				//#endif
			},
			authSuccess() {
				// this.userinfo=uni.getStorageSync('userinfo')
			},
		}
	}
</script>

<style lang="scss">
page{
	background-color: #FFFFFF;
}
</style>
