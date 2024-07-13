<template>
	<view class="bg-white padding">
			<view class="flex margin-top" v-for="(res,index) in list" :key="index" @click="prodDetail(res._id)">
				<view class="">
					<image :src="res.cover" mode="scaleToFill" style="width: 170rpx;height: 170rpx;border-radius: 15rpx;"></image>
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
							<view class="">
								<text class="cuIcon-cartfill item-color" style="font-size: 38rpx;"></text>
							</view>
						</view>
					</view>
					<view class="" @click.stop="storeDetail(res.store_id[0]._id)">
						<view class="cu-avatar round sm" :style="[{ backgroundImage:'url(' + res.store_id[0].cover+ ')' }]"></view>
						<text class="margin-left-sm">{{res.store_id[0].name}}</text>
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
				limit:10,
				load: 'loading',
				page:1,
				list:[]
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			this.getprodlist()
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			this.list = [];
			this.load = "loading";
			this.getprodlist()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getprodlist()
			}
		},
		methods: {
			getprodlist(){
				if (this.hasLogin && this.userinfo.school_id) {
					let skip = (this.page - 1) * this.limit;
					db.collection('mdsh-store-product,mdsh-store')
					.where(dbCmd.and([
						{
							status: true
						},
						{
							'store_id.status': 1
						},
						dbCmd.or([{
								'store_id.school_id': this.userinfo.school_id
							},
							{
								'store_id.is_currency': true
							}
						])
					], ))
					.field('name,cover,stock,sales,price,sort,status,is_best,is_top,is_hot,store_id{name,cover,is_currency,school_id,status}')
					.orderBy("is_top desc,is_best desc,sort desc,create_time desc")
					.skip(skip)
					.limit(this.limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.limit) {
							this.load = "noMore"
						} else {
							this.load = "more"
						}
						this.list = this.list.concat(data)
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
				}else{
					let skip = (this.page - 1) * this.limit;
					db.collection('mdsh-store-product,mdsh-store')
					.where({
						status:true,
						'store_id.status': 1,
						'store_id.is_currency': true
					})
					.field('name,cover,stock,sales,price,sort,status,is_best,is_top,is_hot,store_id{name,cover,is_currency,school_id,status}')
					.orderBy("is_top desc,is_best desc,sort desc,create_time desc")
					.skip(skip)
					.limit(this.limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.limit) {
							this.load = "noMore"
						} else {
							this.load = "more"
						}
						this.list = this.list.concat(data)
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
				}
			},
			prodDetail(id){
				uni.navigateTo({
					url:"/shop/product/product?id="+id
				})
			},
			storeDetail(id){
				uni.navigateTo({
					url:"/shop/store/store?id="+id
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
