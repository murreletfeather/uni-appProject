<template>
	<view>
		<view class="grid col-1 justify-between">
			<view v-for="(res,index) in newsList" :key="index"  @click="newsDetail(res._id)">
				<view class="padding-sm flex">
					<view class="">
						<image :src="res.cover" mode="scaleToFill" style="width: 180rpx;height: 150rpx;border-radius: 10rpx;"></image>
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
		<uni-load-more :status="load"></uni-load-more>
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
				newsList:[],
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
		onLoad() {
			this.getNews()
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			this.newsList = [];
			this.load = 'more';
			this.getNews()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getNews()
			}
		},
		methods: {
			getNews(){
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-news,mdsh-news-cate')
				.where({
					status: true,
					school_id: this.userinfo.school_id
				})
				.field(
					"name,cover,create_date,description,is_hot,is_news,is_top,views,cate_id{name}"
				)
				.orderBy('is_top desc,is_hot desc,is_news desc,sort desc,create_date desc')
				.skip(skip)
				.limit(this.limit)
				.get().then((res) => {
					const data = res.result.data
					if (data.length < this.limit) {
						this.load = "noMore"
					} else {
						this.load = "more"
					}
					this.newsList = this.newsList.concat(data)
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
			newsDetail(id){
				uni.navigateTo({
					url:"/pages/news/news?id="+id
				})
			},
		}
	}
</script>

<style>
page{
	background-color: #FFFFFF;
}
</style>
