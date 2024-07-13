<template>
	<view>
		<!-- 轮播 -->
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
		<!-- 轮播结束 -->
		
		<view class=" " v-for="(item,ind) in storelist" :key="ind">
			<view class="bg-white shadow radis-img" style="margin: 26rpx 16rpx;padding:45rpx 35rpx;">
				<view class="flex justify-between">
					<view class="">
						<view class="cu-avatar round sm" :style="[{ backgroundImage:'url(' + item.cover+ ')' }]"></view>
						<text class="margin-left-sm">{{item.name}}</text>
					</view>
					<view class="text-gray text-sm">
						<button class="cu-btn round line-red sm" @click="storedet(item._id)">
							<text class="cuIcon-shopfill"></text>
						进店</button>
					</view>
				</view>
				<!-- <unicloud-db v-slot:default="{data, loading, error, options}" :where="`store_id=='${item._id}'&&status==true`" collection="mdsh-store-product" :page-size="3" field="cover,name,price,is_hot,is_best" orderby="sort desc,is_best desc,is_hot desc"> -->
					<!-- <view class="flex radis-img" style="margin: 26rpx 16rpx;padding: 15rpx;" v-for="(res,index) in item.list" :key="index" @click="pdetail(res._id)">
						<view class="">
							<image :src="res.cover" lazy-load webp mode="scaleToFill" style="width: 180rpx;height: 180rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="margin-left-sm" style="height: 180rpx;width: 100%;">
							<view class="" style="height: 130rpx;">
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
					</view> -->
				<!-- </unicloud-db> -->
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
				storelist:[],
				bannerList:[],
				page:1,
				limit:10,
				load: 'loading',
				current:0,
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			this.getbanner()
			this.getstorelist()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '发现校园好物',
				path: '/shop/store/list?id='
			}
		},
		onShareTimeline() {
			return {
				title: '发现校园好物',
				path: '/shop/store/list?id='
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			this.storelist = [];
			this.load = "loading";
			this.getstorelist()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getstorelist()
			}
		},
		methods:{
			getbanner() {
				if (this.hasLogin && this.userinfo.school_id) {
					db.collection('mdsh-advertisement').where(
						dbCmd.and([{
								cate: 3
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
					).orderBy("sort desc").get().then(res => {
							var data = res.result.data;
							this.bannerList = data
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
						.catch(err => {
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
				} else {
					db.collection('mdsh-advertisement').where({
						status: true,
						cate: 3,
						is_currency: true
					}).orderBy("sort desc").get().then(res => {
						var data = res.result.data;
						this.bannerList = data
						uni.hideLoading();
						uni.stopPullDownRefresh()
					})
					.catch(err => {
						uni.hideLoading();
						uni.stopPullDownRefresh()
					})
				}
			},
			getstorelist(){
				if (this.hasLogin && this.userinfo.school_id) {
					let skip = (this.page - 1) * this.limit;
					db.collection('mdsh-store')
					.where(dbCmd.and([
						{
							status: 1
						},
						dbCmd.or([{
								school_id: this.userinfo.school_id
							},
							{
								is_currency: true
							}
						])
					], ))
					.orderBy("sort desc,create_time desc")
					.skip(skip)
					.limit(this.limit)
					.get().then((res) => {
						const data = res.result.data
						// data.forEach((store)=>{
						// 	db.collection("mdsh-store-product").where({
						// 		status:true,
						// 		store_id:store._id
						// 	}).field('cover,name,price,is_hot,is_best').limit(3).orderBy('is_best desc,is_hot desc,sort desc').get().then((resb)=>{
						// 		store.list=resb.result.data
						// 	})
						// })
						if (data.length < this.limit) {
							this.load = "noMore"
						} else {
							this.load = "more"
						}
						this.storelist = this.storelist.concat(data)
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
					db.collection('mdsh-store')
					.where({
						status:1,
						is_currency: true
					})
					.orderBy("sort desc,create_time desc")
					.skip(skip)
					.limit(this.limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.limit) {
							this.load = "noMore"
						} else {
							this.load = "more"
						}
						this.storelist = this.storelist.concat(data)
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
			pdetail(id){
				uni.navigateTo({
					url:"/shop/product/product?id="+id
				})
			},
			storedet(id){
				uni.navigateTo({
					url:"./store?id="+id
				})
			},
			advDetail(e){
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
			}
		}
	}
</script>

<style lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30upx 0 0;
	}
</style>
