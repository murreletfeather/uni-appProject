<template>
	<view>
		<unicloud-db ref="udbProduct" v-slot:default="{data, loading, error, options}"
			collection="mdsh-store-product"
			field="name,cover,stock,sales,price,sort,status,is_best,is_top,is_hot"
			orderby="sort desc,create_date desc" page-data="add" :page-size="10" :where="sWhere"
			loadtime="manual" @load="handleLoad">
			<template v-if="data.length">
				<uni-list>
					<uni-list-item :border="false" v-for="(res,index) in data" :key="index" class="bg-white">
						<view slot="body" class="flex radis-img solid-bottom" style="width: 100%;">
							<view class="">
								<image :src="res.cover" lazy-load webp mode="aspectFill" style="width: 180rpx;height: 180rpx;border-radius: 15rpx;"></image>
							</view>
							<view class="margin-left-sm" style="height: 180rpx;width: 100%;">
								<view class="">
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
											库存：{{res.stock}}
										</view>
									</view>
									<view class="flex justify-between">
										<view class="">
											<button class="cu-btn round sm bg-orange" v-if="res.status">在售</button>
											<button class="cu-btn round sm" v-else>已下架</button>
											<text class="margin-left">已售{{res.sales}}</text>
										</view>
										<view class="">
											<button class="cu-btn round sm bg-blue" @click="edit(res._id)">编辑</button>
										</view>
									</view>
								</view>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
			</template>
			<template v-else>
				<view class="margin-top-xl">
					<u-empty text="暂无商品数据" mode="list"></u-empty>
				</view>
			</template>
		</unicloud-db>
		<uni-fab :pattern="pattern" @fabClick="add" horizontal="right"></uni-fab>
		<uni-load-more :status="load"></uni-load-more>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
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
				sWhere: "status==" + true,
				scrollTop: 0,
				load: 'more',
				pattern:{
					buttonColor:"#00bc8e"
				},
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			this.sWhere = this.sWhere + '&&' + "store_id=='" + this.userinfo.store_id + "'"
		},
		onReady() {
			this.$refs.udbProduct.loadData()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.$refs.udbProduct.loadData({
				clear: true
			}, () => {
				uni.hideLoading();
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if(this.load!="noMore"){
				this.load="loading"
			}
			this.$refs.udbProduct.loadMore()
		},
		methods:{
			handleLoad(data, ended, pagination){
				if(ended){
					this.load="noMore"
				}else{
					this.load="more"
				}
			},
			edit(id){
				uni.navigateTo({
					url:"./info?id="+id
				})
			},
			add(){
				uni.navigateTo({
					url:"./info"
				})
			}
		}
	}
</script>

<style lang="less">

</style>
