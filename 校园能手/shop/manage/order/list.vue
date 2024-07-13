<template>
	<view>
		<u-tabs-swiper ref="tabs" active-color="#f37b1d" :list="tablist" :is-scroll="true" :current="current" @change="tabchange" gutter="60"></u-tabs-swiper>
		
		<view class="padding-sm bg-white margin-top-xs radius" v-for="(res,index) in list" :key="index" @click="detail(res._id)">
			<view class="flex justify-between" style="padding: 15rpx 0;">
				<view class="">
					{{$u.timeFormat(res.create_date, 'yyyy-mm-dd hh:MM:ss')}}
				</view>
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
			<view class="padding-sm" v-for="(item,index) in res.ids" :key="index">
				<view class="flex " >
					<view class="">
						<image :src="item.cover" mode=" aspectFill" style="width: 140rpx;height: 140rpx;border-radius: 15rpx;"></image>
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
			<view class="flex justify-between">
				<view class="">
					{{res.order_id}}
				</view>
				<view class="">
					总计{{res.num}}件，总价￥<text class="text-orange" style="font-weight: 600;font-size: 34rpx;">{{res.pay_money}}</text>
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
				page: 1,
				limit: 10,
				list:[],
				tablist: [{
					name: '全部',
					where:{
						del: false
					}
				},{
					name: '待支付',
					where:{
						del: false,
						status:1,
						is_pay:false
					}
				},{
					name: '待配送',
					where:{
						del: false,
						status:1,
						is_pay:true
					}
				},{
					name: '待收货',
					where:{
						del: false,
						status:2,
						is_pay:true
					}
				}, {
					name: '已完成',
					where:{
						del: false,
						status:3,
						is_pay:true
					}
				},{
					name: '退款中',
					where:{
						del: false,
						status:4,
						is_pay:true
					}
				},{
					name: '已退款',
					where:{
						del: false,
						status:5,
						is_pay:true
					}
				}],
				scrollTop: 0,
				current:0
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			if(this.hasLogin && this.userinfo.store_id){
				this.getorder()
			}else{
				uni.showToast({
					icon:"none",
					title:"请先开通店铺"
				})
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
			this.load = 'more';
			this.getorder()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getorder()
			}
		},
		methods:{
			getorder(){
				var where=this.tablist[this.current].where;
				where.store_id=this.userinfo.store_id
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-order')
				.where(where)
				.field("status,is_pay,ids,num,pay_money,create_date,pay_time,order_id")
				.orderBy('pay_time desc,create_date desc')
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
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading();
					uni.stopPullDownRefresh()
				})
			},
			tabchange(e){
				this.current=e
				uni.showLoading({
					title: '加载中'
				});
				this.page = 1;
				this.list = [];
				this.load = 'more';
				this.getorder()
			},
			detail(id){
				uni.navigateTo({
					url:"./order?id="+id
				})
			}
		}
	}
</script>

<style lang="less">

</style>
