<template>
	<view>
		<view class="bg-white">
			<u-dropdown>
				<u-dropdown-item @change="changetaa" v-model="type" title="类型" :options="typelist"></u-dropdown-item>
				<u-dropdown-item @change="changetbb" v-model="status" title="状态" :options="statuslist"></u-dropdown-item>
			</u-dropdown>
		</view>

		<view class="padding bg-white margin-top-xs" v-for="(res,index) in list" :key="index" @click="info(res._id)">
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
				<view class="" v-if="(!res.is_pay && res.status==1) || res.is_refund">
					<text class="cuIcon-deletefill" @click.stop="delt(res._id)"></text>
				</view>
			</view>
			<view class="margin-top-sm">
				<view class='cu-tag radius bg-blue margin-right-sm' v-if="res.type==1">代买</view>
				<view class='cu-tag radius bg-orange margin-right-sm' v-else-if="res.type==2">代取</view>
				<view class='cu-tag radius bg-green margin-right-sm' v-else-if="res.type==3">代排队</view>
				<view class='cu-tag radius bg-yellow margin-right-sm' v-else-if="res.type==4">代课</view>
				{{res.des}}
			</view>
			<view class="">
				订单号：{{res.order_id}}
			</view>
			<view class="">
				预留信息：{{res.uname}} {{res.phone}}
			</view>
			<view class="" v-if="res.status==2 || res.status==3">
				<view class="">
					接单人：{{res.join_user_name}}
				</view>
				<view class="" @click="callPhone(res.join_user_phone)">
					接单手机：{{res.join_user_phone}}
				</view>
				<view class="">
					接单时间：{{$u.timeFormat(res.join_time, 'yyyy-mm-dd hh:MM:ss')}}
				</view>
				<view class="" v-if="res.status==3">
					<view class="">
						确认时间：{{res.confirm_time}}
					</view>
					<view class="">
						完成时间：{{res.finish_time}}
					</view>
				</view>
			</view>
			<view class="flex justify-between">
				<view class="">
					价格：<text class="text-red">￥</text><text class="text-orange"
						style="font-size: 36rpx;font-weight: 600;">{{res.pay_money}}</text>
				</view>
				<view class="" v-if="res.is_refund">
					<button class="cu-btn round sm" disabled>已退款</button>
				</view>
				<view class="" v-else>
					<view class="" v-if="res.is_pay">
						<button class="cu-btn round sm bg-gradual-green" v-if="res.status==1">等待接单</button>
						<button class="cu-btn round sm bg-yellow"  v-else-if="res.status==2">已接单</button>
						<button class="cu-btn round sm" v-else-if="res.status==3">订单完成</button>
					</view>
					<view class="" v-else>
						<button class="cu-btn round sm">未支付</button>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more  :status="load"></uni-load-more>
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
				
				showmodalid: '',
				aswhere: '',
				page: 1,
				limit: 10,
				list: [],
				load: 'loading',
				scrollTop: 0,
				back: false,
				type: 0,
				status: 0,
				form: {
					del: false,
					uid: ''
				},
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
				statuslist: [{
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
				sort: [{
						label: '默认',
						value: 0,
					},
					{
						label: '最新',
						value: 1,
					},
					{
						label: '最热',
						value: 2,
					},
				],
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
		onLoad() {
			this.aswhere = {
				del: false,
				"uid._id": this.userinfo._id
			}
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
		methods: {
			getlist() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-assist,uni-id-users')
					.where(this.aswhere)
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
			
			info(id) {
				uni.navigateTo({
					url: "./detail?id=" + id
				})
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			changetaa(e) {
				this.type = e;
				if (this.status) {
					if (e == 0) {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
							status: this.status
						}
					} else {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
							type: this.type,
							status: this.status
						}
					}
				} else {
					if (e == 0) {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
						}
					} else {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
							type: this.type
						}
					}
				}
				this.page = 1;
				this.list = [];
				this.load = "loading";
				this.getlist()
			},
			changetbb(e) {
				this.status = e
				if (this.type) {
					if (e == 0) {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
							type: this.type
						}
					} else {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
							type: this.type,
							status: this.status
						}
					}
				} else {
					if (e == 0) {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
						}
					} else {
						this.aswhere = {
							del: false,
							"uid._id": this.userinfo._id,
							status: this.status
						}
					}
				}
				this.page = 1;
				this.list = [];
				this.load = "loading";
				this.getlist()
			},
			delt(id) {
				var that = this;
				uni.showModal({
					content: "确认删除吗？",
					success(res) {
						if (res.confirm) {
							db.collection("mdsh-assist").where({
								_id:id,
								uid:db.env.uid
							}).update({
								del:true,
								del_time:db.env.now
							}).then((res) => {
								uni.showToast({
									icon: "success",
									title: "删除成功"
								})
								that.page = 1;
								that.list = [];
								that.load = "loading";
								that.getlist()
							}).catch((err) => {
								uni.showModal({
									content: err.message || '请求服务失败',
									showCancel: false
								})
							}).finally(() => {

							})

						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
