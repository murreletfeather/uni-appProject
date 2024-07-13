<template>
	<view>
		<u-tabs-swiper ref="tabs" active-color="#f37b1d" :list="tablist" :is-scroll="false" :current="current" 
			@change="tabchange" gutter="60"></u-tabs-swiper>
			
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
						</view>
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
				<view class="text-gray">
					接单时间：{{$u.timeFormat(res.join_time, 'yyyy-mm-dd hh:MM:ss')}}
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
				tablist: [{
					name: '全部',
					count: '',
					where: {
						del: false,
						join_uid: db.env.uid
					}
				}, {
					name: '待完成',
					count: '',
					where: {
						del: false,
						status: 2,
						join_uid: db.env.uid
					}
				}, {
					name: '已完成',
					count: '',
					where: {
						del: false,
						status: 3,
						join_uid: db.env.uid
					}
				}],
				current: 0,
				limit:10,
				load: 'loading',
				page:1,
				list:[],
				scrollTop:0
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			if(this.hasLogin){
				this.getlist()
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.page = 1;
			this.list = [];
			this.load = "loading";
			if(this.hasLogin){
				this.getlist()
			}
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getlist()
			}
		},
		methods:{
			getlist() {
				var that=this;
				let skip = (that.page - 1) * that.limit;
				db.collection('mdsh-assist,uni-id-users')
				.where(that.tablist[that.current].where)
				.field("type,status,join_uid,join_time,des,pay_money,uid{avatar,nickName}")
				.orderBy("join_time desc")
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
			detail(){
				
			}
		}
	}
</script>

<style lang="less">

</style>
