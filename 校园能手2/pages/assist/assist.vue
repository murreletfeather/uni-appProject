<template>
	<view>
		<view v-if="sgloading" class="u-skeleton padding-sm">
			<view class="bg-white margin-top-sm" v-for="(res,index) in 4" :key="index">
				<view class="flex align-center">
					<view class="u-skeleton-circle cu-avatar round"></view>
					<view class="u-skeleton-fillet margin-left-sm" style="width: 100%;height: 50rpx;"></view>
				</view>
				<view class="grid col-1 margin-top-sm">
					<view class="u-skeleton-fillet" style="width: 100%;height: 200rpx;">

					</view>
				</view>
				<view class="u-skeleton-fillet margin-top-sm" style="width: 100%;height: 50rpx;"></view>
			</view>
		</view>
		<view v-else>
			<view class="padding bg-white" v-if="bannerList.length">
				<uni-swiper-dot :info="bannerList" :current="current" field="content" mode="default">
					<swiper @change="change" autoplay interval="3000" circular>
						<swiper-item v-for="(item ,index) in bannerList" :key="index">
							<view @click="advDetail(item)">
								<image :src="item.cover" mode="scaleToFill" style="width: 100%;height: 350rpx;"></image>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>

			<view class="margin-top-sm" v-if="notice">
				<uni-notice-bar @click="advDetail(notice)" background-color="#FFFFFF" showIcon="true" scrollable="true"
					single="true" :text="notice.value"></uni-notice-bar>
			</view>

			<view class="bg-white">
				<u-dropdown>
					<u-dropdown-item @change="changetaa" v-model="type" title="类型" :options="typelist">
					</u-dropdown-item>
					<u-dropdown-item @change="changetbb" v-model="status" title="状态" :options="state"></u-dropdown-item>
				</u-dropdown>
			</view>

			<view class="padding bg-white margin-top-xs" v-for="(res,index) in list" :key="index"
				@click="detail(res._id)">
				<view class="flex justify-between align-center">
					<view class="flex align-center">
						<view class="">
							<view class="cu-avatar lg round shadow-warp"
								:style="[{ backgroundImage:'url(' + res.uid[0].avatar+ ')' }]"></view>
						</view>
						<view class="margin-left-sm" style="line-height: 40rpx;">
							<view class="" style="font-size: 32rpx;font-weight: 600;">
								{{res.uid[0].nickName}}
							</view>
							<view class="text-gray">
								{{$u.timeFormat(res.create_time, 'yyyy-mm-dd hh:MM:ss')}}
								<text class="cuIcon-attention margin-left"></text>{{res.view}}
							</view>
						</view>
					</view>
					<view class="text-gray" v-if="userinfo && userinfo.is_manage===1">
						<text class="cuIcon-more" @click.stop="delt(res.id)"></text>
					</view>
				</view>
				<view class="margin-top-sm">
					<view class='cu-tag radius bg-blue margin-right-sm' v-if="res.type==1">代买</view>
					<view class='cu-tag radius bg-orange margin-right-sm' v-else-if="res.type==2">代取</view>
					<view class='cu-tag radius bg-green margin-right-sm' v-else-if="res.type==3">代排队</view>
					<view class='cu-tag radius bg-yellow margin-right-sm' v-else-if="res.type==4">代课</view>
					{{res.des}}
				</view>
				<view class="flex justify-between">
					<view class="">
						价格：<text class="text-red">￥</text><text class="text-orange"
							style="font-size: 36rpx;font-weight: 600;">{{res.pay_money}}</text>
					</view>
					<view class="">
						<button class="cu-btn round sm bg-gradual-green" v-if="res.status==1">等待接单</button>
						<button class="cu-btn round sm bg-yellow" v-else-if="res.status==2">已接单</button>
						<button class="cu-btn round sm" disabled v-else-if="res.status==3">完成</button>
					</view>
				</view>
			</view>
			<uni-load-more v-if="userinfo && userinfo.school_id" :status="load"></uni-load-more>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<uni-fab :pattern="pattern" @fabClick="release" horizontal="right"></uni-fab>
		<!-- #endif -->
		<auth ref="auth"></auth>
		<u-skeleton :loading="sgloading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	import auth from "@/components/auth.vue"
	export default {
		components: {
			auth
		},
		data() {
			return {
				sgloading: true,
				bannerList: [],
				notice: '',
				assisrList: [],
				aswhere: '',
				page: 1,
				limit: 10,
				list: [],

				current: 0,
				typelist: [{
						label: '全部',
						value: 0,
					},
					{
						label: '帮我买',
						value: 1,
					},
					{
						label: '帮我取',
						value: 2,
					},
					{
						label: '帮我排队',
						value: 3,
					},
					{
						label: '帮我代课',
						value: 4,
					},
				],
				state: [{
						label: '全部',
						value: 0,
					},
					{
						label: '待接单',
						value: 1,
					},
					{
						label: '已接单',
						value: 2,
					},
					{
						label: '已完成',
						value: 3,
					},
				],
				pattern: {
					buttonColor: "#00bc8e"
				},
				load: 'loading',
				type: 0,
				status: 0,
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '代取快递,跑腿,代课,排队一站式服务',
				path: '/pages/assist/assist?id='
			}
		},
		onShareTimeline() {
			return {
				title: '代取快递,跑腿,代课,排队一站式服务',
				path: '/pages/assist/assist?id='
			}
		},
		onShow() {
			this.aswhere = {
				is_pay: true,
				del: false,
				is_refund: false,
				school_id: this.userinfo.school_id
			}
		},
		onLoad(e) {
			this.getDate()
			if (this.hasLogin && this.userinfo.school_id) {
				this.aswhere = {
					is_pay: true,
					del: false,
					is_refund: false,
					school_id: this.userinfo.school_id
				}
				this.getAssist()
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.getDate()
			this.page = 1;
			this.list = [];
			this.load = "loading";
			this.getAssist()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getAssist()
			}
		},
		methods: {
			getDate() {
				if (this.hasLogin && this.userinfo.school_id) {
					var bannerQuery = db.collection('mdsh-advertisement').where(
						dbCmd.and([{
								cate: 2
							},
							{
								status: true
							},
							dbCmd.or([{
									school_id: this.userinfo.school_id
								},
								{
									is_currency: true
								}
							])
						], )
					).orderBy("sort desc").getTemp();
					var noticeQuery = db.collection('mdsh-config').where({
						status: true,
						label: 'assist-notice',
						school_id: this.userinfo.school_id
					}).getTemp()
					db.multiSend(bannerQuery, noticeQuery).then(res => {
							var data = res.result.dataList;
							this.bannerList = data[0].data;
							this.notice = data[1].data[0];
							this.sgloading = false;
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
						.catch(err => {
							this.sgloading = false;
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
				} else {
					var bannerQuery = db.collection('mdsh-advertisement').where({
						status: true,
						cate: 2,
						is_currency: true
					}).orderBy("sort desc").getTemp();
					db.multiSend(bannerQuery).then(res => {
							var data = res.result.dataList;
							this.bannerList = data[0].data;
							this.notice = '';
							this.sgloading = false;
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
						.catch(err => {
							this.sgloading = false;
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
				}
			},
			getAssist() {
				if (this.hasLogin && this.userinfo.school_id) {
					let skip = (this.page - 1) * this.limit;
					db.collection('mdsh-assist,uni-id-users')
						.where(this.aswhere)
						.field(
							"des,type,status,pay_money,view,create_time,uid{avatar,nickName}"
						)
						.orderBy("create_time desc")
						.skip(skip)
						.limit(this.limit)
						.get().then((res) => {
							const data = res.result.data
							if (data.length < this.limit) {
								this.load = "noMore"
							} else {
								this.load = "more"
							}
							if (data) {
								this.list = this.list.concat(data)
							}
						}).catch((err) => {
							uni.hideLoading();
							uni.stopPullDownRefresh()
							uni.showModal({
								content: err.message || '请求服务失败',
								showCancel: false
							})
						}).finally(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
				} else {
					// uni.showToast({
					// 	icon: "none",
					// 	title: "请先绑定学校",
					// 	success() {
					// 		setTimeout(() => {
					// 			uni.navigateTo({
					// 				url: "/user/school/school"
					// 			})
					// 		}, 2000)
					// 	}
					// })
					this.login()
				}
			},
			advDetail(e) {
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
			},
			change(e) {
				this.current = e.detail.current;
			},
			changetaa(e) {
				this.type = e;
				if (this.status) {
					if (e == 0) {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id,
							status: this.status
						}
					} else {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id,
							type: this.type,
							status: this.status
						}
					}
				} else {
					if (e == 0) {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id
						}
					} else {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id,
							type: this.type
						}
					}
				}
				this.page = 1;
				this.list = [];
				this.load = "loading";
				this.getAssist()
			},
			changetbb(e) {
				this.status = e;
				if (this.type) {
					if (e == 0) {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id,
							type: this.type
						}
					} else {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id,
							type: this.type,
							status: this.status
						}
					}
				} else {
					if (e == 0) {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id
						}
					} else {
						this.aswhere = {
							is_pay: true,
							del: false,
							is_refund: false,
							school_id: this.userinfo.school_id,
							status: this.status
						}
					}
				}
				this.page = 1;
				this.list = [];
				this.load = "loading";
				this.getAssist()
			},
			release() {
				if (this.hasLogin) {
					uni.navigateTo({
						url: "/assist/release/release"
					})
				} else {
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
			detail(id) {
				if (this.hasLogin) {
					uni.navigateTo({
						url: "/assist/detail/detail?id=" + id
					})
				} else {
					this.login()
				}
			}
		}
	}
</script>

<style>

</style>
