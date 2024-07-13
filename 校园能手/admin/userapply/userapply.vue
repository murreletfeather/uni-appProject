<template>
	<view>
		<u-tabs-swiper ref="tabs" :list="tablist" :is-scroll="false" :current="current" @change="tabchange" gutter="60"></u-tabs-swiper>
		<view class="padding-sm bg-white margin-top-xs radius" v-for="(res,index) in list" :key="index" @click="detail(res._id)">
			<view class="flex justify-between" style="padding: 15rpx 0;">
				<view class="">
					{{$u.timeFormat(res.create_date, 'yyyy-mm-dd hh:MM:ss')}}
				</view>
				<view class="">
					<view class="cu-tag round bg-orange" v-if="res.status==1">待审核</view>
					<view class="cu-tag round bg-green" v-else-if="res.status==2">通过</view>
					<view class="cu-tag round bg-cyan" v-else-if="res.status==3">拒绝</view>		
				</view>
			</view>
			<view class="flex">
				<view class="">
					<view class="cu-tag round bg-orange" v-if="res.type==1">业务员</view>
					<view class="cu-tag round bg-green" v-else-if="res.type==2">开店</view>
				</view>
				<view class="margin-left-sm">
					<view class="">
						<view class="cu-avatar sm round shadow-warp"
							:style="[{ backgroundImage:'url(' + res.uid[0].avatar+ ')' }]"></view>
						{{res.uid[0].nickName}}
					</view>
				</view>
			</view>
			<view class="">
				申请说明：{{res.des}}
			</view>
		</view>
		
		<uni-load-more  :status="load"></uni-load-more>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		data() {
			return {
				tablist: [{
					name: '待审核',
					status:1
				},{
					name: '通过',
					status:2
				},{
					name: '拒绝',
					status:3
				}],
				page: 1,
				current:0,
				limit: 10,
				list: [],
				load: 'loading',
				scrollTop: 0,
				where:{
					status:1
				}
			};
		},
		onLoad() {
			this.getlist()
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
		methods:{
			getlist() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-user-apply,uni-id-users')
				.where(this.where)
				.field('create_date,status,type,des,uid{avatar,nickName}')
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
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading();
					uni.stopPullDownRefresh()
				})
			},
			tabchange(index){
				this.current=index
				this.where.status=this.tablist[index].status
				this.page = 1;
				this.list = [];
				this.load = "loading";
				this.getlist()
			},
			detail(id){
				uni.navigateTo({
					url:"./info?id="+id
				})
			}
		}
	}
</script>

<style lang="less">

</style>
