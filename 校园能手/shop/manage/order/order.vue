<template>
	<view>
		<view  v-if="info" class="" style="margin-bottom: 120rpx;">
			<view class="bg-white radis-img" style="margin: 15rpx;"  >
				<view class="padding-sm" v-for="(res,index) in info.ids" :key="index">
					
					<view class="flex " >
						<view class="">
							<image :src="res.cover" mode=" aspectFill" style="width: 140rpx;height: 140rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="margin-left-sm" style="height: 140rpx;width: 100%;">
							<view class="" style="height: 100rpx;">
								{{res.name}}
							</view>
							<view class="flex justify-between">
								<view class="text-red" style="font-size: 34rpx;font-weight: 600;">
									￥{{res.price}}
								</view>
								<view class="">
									x {{res.count}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="padding bg-white radis-img" style="margin: 15rpx;" >
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">收货人：{{info.take_user}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;" @click="callphone">
					<view class="title">手机号：{{info.take_phone}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">送达地址：{{info.take_address}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					备注：{{info.remarks}}
				</view>
			</view>
			
			<view class="padding bg-white radis-img" style="margin: 15rpx;" >
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">订单号：{{info.order_id}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">订单金额：<text class="text-orange" style="font-size: 34rpx;font-weight: 600;">￥{{info.pay_money}}</text></view>
				</view>
				<view class="cu-form-group" style="padding: 0;">
					<view class="title">下单时间：{{$u.timeFormat(info.create_date, 'yyyy-mm-dd hh:MM:ss')}}</view>
				</view>
				<template v-if="info.is_pay">
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">订单状态：
							<view class="cu-tag radius bg-orange" v-if="info.status==1">待配送</view>
							<view class="cu-tag radius bg-green" v-else-if="info.status==2">待收货</view>
							<view class="cu-tag radius bg-green'>" v-else-if="info.status==3">订单完成</view>
							<view class="cu-tag radius bg-blue" v-else-if="info.status==4">退款中</view>
							<view class="cu-tag radius bg-yellow" v-else-if="info.status==5">已退款</view>
						</view>
					</view>
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">支付时间：{{$u.timeFormat(info.pay_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
					</view>
					<view class="cu-form-group"  v-if="info.status==2" style="padding: 0;">
						<view class="title">配送时间：{{$u.timeFormat(info.delivery_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
					</view>
				</template>
				<template v-else>
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">订单状态：
							<view class="cu-tag radius bg-orange">待支付</view>
						</view>
					</view>
				</template>
				<view class="cu-form-group" style="padding: 0;" v-if="info.status==5 || info.status==4">
					<view class="title">退款原因：{{info.refund_res}}</view>
				</view>
				<view class="cu-form-group" style="padding: 0;" v-if="info.status==5">
					<view class="title">退款时间：{{$u.timeFormat(info.refund_time, 'yyyy-mm-dd hh:MM:ss')}}</view>
				</view>
			</view>
			
		</view>
		<view class="cu-bar bg-white tabbar shop foot justify-end" style="padding: 0 26rpx;" v-if="info && info.is_pay && info.status!=3">
			<view class="">
				<button class="cu-btn bg-green round shadow-blur" v-if="info.status==2">派送中</button>
				<button class="cu-btn bg-green round shadow-blur" @click="Delivery(1)" v-if="info.status==1">去送货</button>
				<button class="cu-btn bg-orange round shadow-blur margin-left-sm" @click="refundOrder" v-if="info.status==1">退款</button>
				<button class="cu-btn bg-blue round shadow-blur margin-left-sm" @click="refundOrder" v-if="info.status==4">处理退款</button>
			</view>
		</view>
		
		<u-modal v-model="show" title='退款处理' show-cancel-button	@confirm="confirm">
			<view class="slot-content padding">
				<view class="">
					<u-radio-group v-model="status">
						<u-radio shape="circle" name="1">通过</u-radio>
						<u-radio shape="circle" name="2">拒绝</u-radio>
					</u-radio-group>
				</view>
				<view class="margin-top-sm" v-if="status==2">
					<u-input v-model="no_refund_res" placeholder="请输入原因" type="textarea" />
				</view>
			</view>
		</u-modal>
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
				status:'1',
				no_refund_res:'',
				show:false,
				id:'',
				info:'',
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad(e) {
			this.id=e.id
			if(this.id && this.hasLogin){
				this.orderinfo()
			}
		},
		methods: {
			orderinfo(){
				uni.showLoading({
				    title: '加载中'
				});
				db.collection('mdsh-order')
				.where({
					del: false,
					_id: this.id
				})
				.get().then((res) => {
					uni.hideLoading();
					const data = res.result.data
					if (data.length ==1) {
						this.info=data[0]
					} else {
						uni.showToast({
							icon:"none",
							title:'订单不存在'
						})
					}
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},
			Delivery(e){
				if(this.info.is_pay){
					if (this.info.status == 2) {
						uni.showToast({
							icon:"none",
							title:'订单正在派送中'
						})
					}else if (this.info.status == 3) {
						uni.showToast({
							icon:"none",
							title:'订单已完成'
						})
					}else if (this.info.status == 4) {
						uni.showToast({
							icon:"none",
							title:'订单退款中'
						})
					}else if (this.info.status == 5) {
						uni.showToast({
							icon:"none",
							title:'订单已退款'
						})
					}else if(this.info.status == 1){
						var that=this;
						uni.showModal({
						    title: '',
						    content: '确定开始配送？',
						    success: function (res) {
						        if (res.confirm) {
									db.action('order-delivery')
									.collection('mdsh-order')
									.where({
										del: false,
										_id: that.id
									})
									.update({
										status:2,
										delivery_time:db.env.now
									}).then((res) => {
										uni.showToast({
											icon:"success",
											title:"请尽快配送订单"
										})
										that.orderinfo()
									}).catch((err) => {
										uni.hideLoading();
										uni.showModal({
											content: err.message || '请求服务失败',
											showCancel: false
										})
									})
									
						        }
						    }
						});
					}
				}else{
					uni.showToast({
						icon:"none",
						title:'订单未支付'
					})
				}
			},
			refundOrder(){
				this.show=true
			},
			callPhone(){
				uni.makePhoneCall({
				    phoneNumber: this.info.take_phone
				});
			},
			confirm(){
				if(this.status==2 && this.no_refund_res==''){
					uni.showToast({
						icon:"none",
						title:'请输入原因'
					})
				}else{
					var that=this;
					uniCloud.callFunction({
						name: 'pay',
						data: {
							token:uni.getStorageSync('uni_id_token'),
							funct:'refund',
							id:that.id,
							status:that.status,
							type:1,
							no_refund_res:that.no_refund_res
						},
						success(res) {
							if(res.result.code==0){
								uni.showToast({
									icon:"success",
									title:res.result.message
								})
								that.orderinfo()
							}else{
								uni.showToast({
									icon:"none",
									title:res.result.message
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>