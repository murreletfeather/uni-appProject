<template>
	<view class="">
		<view class="" v-if="info">
			<view class="bg-white margin-sm radis-img">
				<view class="solid-bottom padding-sm">
					类型：
					<view class='cu-tag radius bg-blue margin-right-sm' v-if="info.type==1">代买</view>
					<view class='cu-tag radius bg-orange margin-right-sm' v-else-if="info.type==2">代取</view>
					<view class='cu-tag radius bg-green margin-right-sm' v-else-if="info.type==3">代排队</view>
					<view class='cu-tag radius bg-yellow margin-right-sm' v-else-if="info.type==4">代课</view>
				</view>
				<view class="solid-bottom padding-sm">
					描述：{{info.des}}
				</view>
				<view class="solid-bottom padding-sm">
					费用：<text class="text-red" style="font-weight: 600;">{{info.pay_money}}</text>
				</view>
				<view class="solid-bottom padding-sm" v-if="info.type==1 || info.type==2">
					送达时间：{{info.arrive_time}}
				</view>
				<view class="solid-bottom padding-sm">
					用户：
					<view class="cu-avatar sm round shadow-warp margin-right-sm" :style="[{ backgroundImage:'url(' + info.uid[0].avatar+ ')' }]"></view>
					{{info.uid[0].nickName}}
				</view>
			</view>
			<view class="bg-white margin-sm radis-img" v-if="(userinfo.is_assist && info.status==1) || (info.join_uid==userinfo._id) || info.uid[0]._id==userinfo._id">
				<view class="solid-bottom padding-sm">
					联系人：{{info.uname}}
				</view>
				<view class="solid-bottom padding-sm" @click="callPhone(info.phone)">
					联系电话：{{info.phone}}
				</view>
				<view class="solid-bottom padding-sm" v-if="info.type==1 || info.type==2">
					送货地址：{{info.address}}
				</view>
				<view class="solid-bottom padding-sm">
					隐私信息：{{info.hide_content}}
				</view>
				<view class="" v-if="info.status!=1">
					<view class="solid-bottom padding-sm">
						接单用户：{{info.join_user_name}}
					</view>
					<view class="solid-bottom padding-sm" @click="callPhone(info.join_user_phone)">
						接单用户手机：{{info.join_user_phone}}
					</view>
					<view class="solid-bottom padding-sm">
						接单时间：{{$u.timeFormat(res.join_time, 'yyyy-mm-dd hh:MM:ss')}}
					</view>
				</view>
			</view>
			<view class="bg-white margin-sm radis-img" v-else style="height: 160rpx;">
				<view class="solid-bottom padding-sm text-center" >
					{{info.status==1 ? '详细信息仅业务员可见' : '接单者可见'}}
				</view>
			</view>
			<view class="text-center margin-top-xl">
				<view class="" v-if="info.is_pay">
					<template v-if="info.uid[0]._id==userinfo._id">
						<button class="cu-btn round sm item-bgr" style="width: 80%;height: 66rpx;" v-if="info.status==1">等待接单</button>
						<button class="cu-btn round sm bg-orange" disabled style="width: 80%;height: 66rpx;" v-else-if="info.status==2">已接单</button>
						<button class="cu-btn round sm bg-grey" disabled style="width: 80%;height: 66rpx;" v-else-if="info.status==3">已完成</button>
					</template>
					<template  v-else>
						<button class="cu-btn round sm bg-orange" style="width: 80%;height: 66rpx;" v-if="info.status==1 && userinfo.is_assist" @click="orderTaking">接单</button>
						<button class="cu-btn round sm bg-orange" disabled style="width: 80%;height: 66rpx;" v-if="info.status==2">已接单</button>
						<button class="cu-btn round sm bg-grey" disabled style="width: 80%;height: 66rpx;" v-else-if="info.status==3">已完成</button>
					</template>
				</view>
				<view class="" v-else>
					<button class="cu-btn round sm bg-orange" disabled style="width: 80%;height: 66rpx;">订单未支付</button>
				</view>
			</view>
		</view>
		
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	import auth from "@/components/auth.vue"
	export default {
		components: {
			auth
		},
		data() {
			return {
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
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.info.des,
				path: '/assist/detail/detail?id='+this.id
			}
		},
		onShareTimeline() {
			return {
				title: this.info.des,
				path: '/assist/detail/detail?id='+this.id
			}
		},
		onShow() {
			if(this.id){
				this.getinfo()
			}
		},
		methods: {
			getinfo(){
				uni.showLoading({
				    title: '加载中'
				});
				db.action("assist-det")
				.collection("mdsh-assist,uni-id-users").where({
					_id:this.id,
					del:false
				}).get()
					.then(res => {
						this.info = res.result.data[0]
					}).catch((err) => {
					uni.showModal({
						content: err.message || '查询失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			callPhone(phone){
				uni.makePhoneCall({
				    phoneNumber: phone
				});
			},
			orderTaking(){
				if(this.hasLogin){
					if(this.userinfo.school_id==this.info.school_id){
						if(this.userinfo.is_assist){
							this.settempst()
						}else{
							uni.showToast({
								icon:"none",
								title:'请先成为业务员'
							})
							setTimeout(() => {
								uni.navigateTo({
									url: "/user/apply/apply?type=1"
								})
							}, 2000)
						}
					}else{
						uni.showToast({
							icon:"none",
							title:'无法跨校区接单'
						})
					}
				}else{
					this.login()
				}
			},
			assisttaking(){
				db.action('assist-order-taking')
				.collection("mdsh-assist").where({
					_id:this.id
				}).update({
					status:2,
					join_time:db.env.now,
					join_uid:db.env.uid
				})
					.then(res => {
						uni.showToast({
							title:"请尽快配送"
						})
						this.getinfo()
					}).catch((err) => {
					uni.showModal({
						content: err.message || '接单失败',
						showCancel: false
					})
				}).finally(() => {
					
				})
			},
			settempst(){
				var that=this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
				  tmplIds: ['mPVgV3IvEXPDlOSn2ZAWX8JT3DAeskaiYH_I8sY-GUI'],
				  complete (res) {
				  	that.assisttaking()
				  }
				})
				//#endif	
			},
			login(){
				//#ifdef MP-WEIXIN
				this.$refs.auth.showpop();
				//#endif
			},
			authSuccess(){
				
			}
		}
	}
</script>

<style>

</style>
