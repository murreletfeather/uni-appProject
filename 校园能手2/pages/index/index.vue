<template>
	<view>
		<u-navbar :is-back="false" :border-bottom="false">
			<view class="slot-wrap">
				<u-search style="width: 100%;" :disabled="true" placeholder="请输入搜索内容" :show-action="false"></u-search>
			</view>
		</u-navbar>
		<view v-if="sgloading" class="u-skeleton padding">
			<view class="u-skeleton-fillet" style="width: 100%;height: 350rpx;"></view>
			<view class="grid col-4 margin-top-sm justify-between">
				<view v-for="(item,index) in 4" :key="index" class="u-skeleton-fillet" style="width: 140rpx;height: 140rpx;"></view>
			</view>
			<view class="bg-white margin-top-sm" v-for="(res,index) in 3" :key="index">
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
			<view class="padding bg-white">
				<!-- 轮播 -->
				<uni-swiper-dot v-if="bannerList.length" :info="bannerList" :current="current" field="content"
					mode="default">
					<swiper @change="change" autoplay interval="3000" circular>
						<swiper-item v-for="(item ,index) in bannerList" :key="index">
							<view @click="advDetail(item)" vl>
								<image :src="item.cover" mode="scaleToFill" style="width: 100%;height: 350rpx;"></image>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
				<!-- 轮播结束 -->
			
				<!-- 公告 -->
				<view class="" v-if="notice">
					<uni-notice-bar @click="advDetail(notice)" background-color="#FFFFFF" showIcon="true" scrollable="true"
						single="true" :text="notice.value"></uni-notice-bar>
				</view>
				<!-- 公告结束 -->
			
				<!-- 功能 -->
				<view class="grid col-4 text-center margin-top-xs" v-if="applyList.length">
					<view class="" v-for="(res,index) in applyList" :key="index" @click="advDetail(res)">
						<image :src="res.cover" mode="scaleToFill" style="width: 80rpx;height: 80rpx;"></image>
						<view class="">
							{{res.name}}
						</view>
					</view>
				</view>
				<!-- 功能结束 -->
			</view>
			<!-- 热门新闻 -->
			<view class="bg-white padding margin-top-sm" v-if="newsList.length">
				<view class="bg-white flex justify-between align-center">
					<view class=" item-title">
						最新资讯
					</view>
					<view class="text-gray text-sm" @click="moreNews">
						更多<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="grid col-1 justify-between">
					<view v-for="(res,index) in newsList" :key="index" @click="newsDetail(res._id)">
						<view class="padding-sm flex">
							<view class="">
								<image :src="res.cover" mode="scaleToFill"
									style="width: 180rpx;height: 150rpx;border-radius: 10rpx;"></image>
							</view>
							<view class="margin-left-sm">
								<view class="line-clamp2" style="font-size: 30rpx;font-weight: 600;">
									{{res.name}}
								</view>
								<view class="text-gray line-clamp2">
									{{res.description}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 热门店铺 -->
			<view class="bg-white padding margin-top-sm" v-if="storeList.length">
				<view class="bg-white flex justify-between align-center">
					<view class=" item-title">
						热门店铺
					</view>
					<view class="text-gray text-sm" @click="moreStore">
						更多<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="grid col-2 justify-between">
					<view v-for="(res,index) in storeList" :key="index" class="shadowit radis-img bg-white padding margin-xs"
						style="width: 47%;" @click="storeDetail(res._id)">
						<view class="">
							<view class="cu-avatar round" :style="[{ backgroundImage:'url(' + res.cover+ ')' }]"></view>
							<text class="margin-left-sm">{{res.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 热门店铺结束 -->
			
			<!-- 热门商品 -->
			<view class="bg-white padding margin-top-sm" v-if="productList.length">
				<view class="bg-white flex justify-between align-center">
					<view class=" item-title">
						热门商品
					</view>
					<view class="text-gray text-sm" @click="moreProduct">
						更多<text class="cuIcon-right"></text>
					</view>
				</view>
				<view>
					<view class="flex margin-top" v-for="(res,index) in productList" :key="index"
						@click="prodDetail(res._id)">
						<view class="">
							<image :src="res.cover" lazy-load webp mode="scaleToFill"
								style="width: 170rpx;height: 170rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="margin-left-sm" style="height: 180rpx;width: 100%;">
							<view>
								<view class="" style="height: 80rpx;">
									<text class="lg text-orange cuIcon-hotfill" v-if="res.is_hot"></text>
									{{res.name}}
									<view class='cu-tag radius sm bg-green' v-if="res.is_best">精选</view>
			
								</view>
								<view class="flex justify-between">
									<view class="text-red" style="font-size: 34rpx;font-weight: 600;">
										￥{{res.price}}
									</view>
									<!-- <view class="">
											<text class="cuIcon-cartfill item-color" style="font-size: 38rpx;"></text>
										</view> -->
								</view>
							</view>
							<view class="" @click.stop="storeDetail(res.store_id[0]._id)">
								<view class="cu-avatar round sm"
									:style="[{ backgroundImage:'url(' + res.store_id[0].cover+ ')' }]"></view>
								<text class="margin-left-sm">{{res.store_id[0].name}}</text>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="load"></uni-load-more>
			</view>
		</view>
			<!-- 热门商品结束 -->
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

	export default {
		data() {
			return {
				sgloading: true, // 是否显示骨架屏组件
				base64: '',
				load: 'more',
				current: 0,
				mode: 'round',
				bannerList: [],
				applyList: [],
				storeList: [],
				newsList: [],
				notice: '',
				productList: [],
				page: 1,
				limit: 10
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onShow() {

		},
		onLoad(e) {
			uni.showLoading({
				title: '加载中'
			});
			this.getDate()
			this.getProduct()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮

			}
			return {
				title: '校园能手-校园好帮手',
				path: '/pages/index/index'
			}
		},
		onShareTimeline() {
			return {
				title: '校园能手-校园好帮手',
				path: '/pages/index/index'
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			this.productList = [];
			this.load = 'more';
			this.getDate()
			this.getProduct()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getProduct()
			}
		},
		methods: {
			getDate() {
				var bannerQuery = db.collection('mdsh-advertisement').where(
					dbCmd.and([{
							cate: 1
						},
						{
							status: true
						},{
							school_id:this.userinfo.school_id || ''
						}
					])
				).orderBy("sort desc").getTemp();
				var noticeQuery = db.collection('mdsh-config').where({
					status: true,
					label: 'home-notice',
					school_id: this.userinfo.school_id
				}).getTemp()
				var applyQuery = db.collection('mdsh-apply').where(
					dbCmd.and([{
							from: 1
						},
						{
							status: true
						}
						,{
							school_id:this.userinfo.school_id || ''
						}
					])
				).orderBy("sort desc").limit(4).getTemp()
				var storeQuery = db.collection('mdsh-store').where(
					dbCmd.and([{
							is_recommend: true
						},
						{
							status: true
						}
						,{
							school_id:this.userinfo.school_id || ''
						}
					])
				).orderBy("sort desc").limit(4).getTemp()
				var newsQuery = db.collection('mdsh-news,mdsh-news-cate').where(
						dbCmd.and([{
								status: true
							},{
							school_id:this.userinfo.school_id || ''
						}
						])
					).field("name,cover,create_date,description,is_hot,is_news,is_top,views,cate_id{name}").limit(4)
					.orderBy('is_top desc,is_hot desc,is_news desc,sort desc,create_date desc').getTemp()
				db.multiSend(bannerQuery, applyQuery, storeQuery, noticeQuery, newsQuery).then(res => {
						var data = res.result.dataList;
						this.bannerList = data[0].data;
						this.applyList = data[1].data;
						this.storeList = data[2].data;
						this.notice = data[3].data[0];
						this.newsList = data[4].data;
						this.sgloading=false
						uni.hideLoading();
						uni.stopPullDownRefresh()
					})
					.catch(err => {
						this.sgloading=false
						uni.hideLoading();
						uni.stopPullDownRefresh()
					})
			},
			getProduct() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-store-product,mdsh-store')
					.where(
						dbCmd.and([{
								status: true
							},
							{
								is_best: true
							},
							{
								'store_id.school_id':this.userinfo.school_id || ''
							},{
								'store_id.status':true
							}
						])
					)
					.field(
						"name,cover,stock,sales,price,sort,status,is_best,is_top,is_hot,store_id{name,cover,is_currency,school_id,status}"
					)
					.orderBy('sort desc')
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
							this.productList = this.productList.concat(data)
						}
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
			handleLoad(data, ended, pagination) {
				if (ended) {
					this.load = "noMore"
				} else {
					this.load = "more"
				}
			},
			advDetail(e) {
				if (e.type == 1) { //不处理
					// uni.showToast({
					// 	icon:'none',
					// 	title:"开发中..."
					// })
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
			moreProduct() {
				uni.navigateTo({
					url: "/shop/product/list"
				})
			},
			prodDetail(id) {
				uni.navigateTo({
					url: "/shop/product/product?id=" + id
				})
			},
			moreStore() {
				uni.navigateTo({
					url: "/shop/store/list"
				})
			},
			newsDetail(id) {
				uni.navigateTo({
					url: "/pages/news/news?id=" + id
				})
			},
			storeDetail(id) {
				uni.navigateTo({
					url: "/shop/store/store?id=" + id
				})
			},
			change(e) {
				this.current = e.detail.current;
			},
			moreNews() {
				uni.navigateTo({
					url: "/pages/news/list"
				})
			}
		}
	}
</script>

<style>
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30upx;
	}
</style>
