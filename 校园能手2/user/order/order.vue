<template>
	<view>
		<u-tabs-swiper ref="tabs" active-color="#f37b1d" :list="tablist" :is-scroll="true" :current="current"
			@change="tabchange" gutter="60"></u-tabs-swiper>

		<view class="padding-sm bg-white margin-top-sm radis-img" v-for="(res,index) in list" :key="index"
			@click="detail(res._id)">
			<view class="flex justify-between">
				<view class="">
					<view class="" @click.stop="storeDetail(res.store_id[0]._id)">
						<view class="cu-avatar round sm"
							:style="[{ backgroundImage:'url(' + res.store_id[0].cover+ ')' }]"></view>
						<text class="margin-left-sm"
							style="font-size: 34rpx;font-weight: 600;">{{res.store_id[0].name}}</text>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="">
					<view class="">
						<view class="" v-if="res.is_pay">
							<view class="cu-tag round bg-orange" v-if="res.status==1">待配送</view>
							<view class="cu-tag round bg-green" v-else-if="res.status==2">待收货</view>
							<view class="flex align-center" v-else-if="res.status==3">
								<view class="cu-tag round bg-cyan">订单完成</view>
							</view>
							<view class="cu-tag round bg-brown" v-else-if="res.status==4">退款中</view>
							<view class="flex align-center" v-else-if="res.status==5">
								<view class="cu-tag round bg-mauve">已退款</view>
							</view>
						</view>
						<view class="flex align-center" v-else>
							<view class="cu-tag round bg-grey">未支付</view>
						</view>

					</view>
				</view>
			</view>
			<view>
				<view class="padding-sm" v-for="(item,indexb) in res.ids" :key="indexb">
					<view class="flex ">
						<view class="">
							<image :src="item.cover" mode=" aspectFill"
								style="width: 140rpx;height: 140rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="margin-left-sm" style="height: 140rpx;width: 100%;">
							<view class="" style="height: 100rpx;">
								{{item.name}}
							</view>
							<view class="flex justify-between">
								<view class="text-red" style="font-size: 34rpx;font-weight: 600;">
									￥{{item.price}}
								</view>
								<view class="">
									x {{item.count}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex justify-between">
				<view class="">
					<text class="text-gray" v-if="!res.is_pay" @click.stop="delt(res._id)">删除</text>
				</view>
				<view class="">
					总计{{res.num}}件，总价￥<text class="text-orange"
						style="font-weight: 600;font-size: 34rpx;">{{res.pay_money}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="load"></uni-load-more>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
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
				orderwhere: "",
				page: 1,
				limit: 10,
				list: [],
				load: 'loading',
				tablist: [{
					name: '全部',
					count: '',
					where: {
						del: false,
						uid: db.env.uid
					}
				}, {
					name: '待支付',
					count: '',
					where: {
						del: false,
						status: 1,
						is_pay: false,
						uid: db.env.uid
					}
				}, {
					name: '待配送',
					count: '',
					where: {
						del: false,
						status: 1,
						is_pay: true,
						uid: db.env.uid
					}
				}, {
					name: '待收货',
					count: '',
					where: {
						del: false,
						status: 2,
						is_pay: true,
						uid:db.env.uid
					}
				}, {
					name: '已完成',
					count: '',
					where: {
						del: false,
						status: 3,
						is_pay: true,
						uid: db.env.uid
					}
				}, {
					name: '退款中',
					count: '',
					where: {
						del: false,
						status: 4,
						is_pay: true,
						uid: db.env.uid
					}
				}, {
					name: '已退款',
					count: '',
					where: {
						del: false,
						status: 5,
						is_pay: true,
						uid: db.env.uid
					}
				}],
				totl: [],
				scrollTop: 0,
				current: 0
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			if(this.hasLogin){
				this.getlist()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			this.list = [];
			this.load = "loading";
			this.getlist()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getlist()
			}
		},
		methods: {
			getlist() {
				var that=this;
				let skip = (that.page - 1) * that.limit;
				db.collection('mdsh-order,mdsh-store')
				.where(that.tablist[that.current].where)
				.field("is_pay,status,cover,num,create_date,ids,store_id{cover,name}")
				.orderBy("create_date desc")
				.skip(skip)
				.limit(that.limit)
				.get().then((res) => {
					const data = res.result.data
					if (data.length < that.limit) {
						that.load = "noMore"
					} else {
						that.load = "more"
					}
					that.list = that.list.concat(data)
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
			tabchange(index) {
				this.current = index
				this.page = 1;
				this.list = [];
				this.load = "loading";
				this.getlist()
			},
			detail(id) {
				uni.navigateTo({
					url: "/user/order/info?id=" + id
				})
			},
			storeDetail(id) {
				uni.navigateTo({
					url: "/shop/store/store?id=" + id
				})
			},
			delt(id) {
				var that = this;
				uni.showModal({
					content: "确认删除吗？",
					success(res) {
						if (res.confirm) {
							db.collection('mdsh-order')
							.where({
								del: false,
								_id: id,
								uid:db.env.uid
							})
							.update({
								del_time:db.env.now,
								del:true,
							}).then((res) => {
								uni.showToast({
									icon:"success",
									title:"删除成功"
								})
								that.page = 1;
								that.list = [];
								that.load = "loading";
								that.getlist()
							}).catch((err) => {
								uni.hideLoading();
								uni.showModal({
									content: err.message || '请求服务失败',
									showCancel: false
								})
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="less">

</style>
