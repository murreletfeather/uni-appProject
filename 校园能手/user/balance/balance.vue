<template>
	<view>
		<view class="padding">
			<view class="padding-sm item-bgr radis-img" style="width: 100%;height: 300rpx;">
				<view class="">
					当前余额（元）
				</view>
				<view class="margin-top text-center" style="font-size: 104rpx;font-weight: 600;">
					{{userinfo.balance ? userinfo.balance : '0.00'}}
				</view>
				<view class="margin-top flex justify-between">
					<view class="">
						总收入：{{info.income.money ? info.income.money-info.income.rate : '0.00'}}
					</view>
					<view class="">
						已提现：{{info.withdrawal.money ? info.withdrawal.money : '0.00'}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="bg-white menu cu-list card-menu " >
			<view class="cu-item arrow" @click="detail(1)">
				<view class="content">
					<text class="text-grey">提现</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-grey">提现记录</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="text-grey">收入明细</text>
				</view>
			</view>
		</view>
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
				info:'',
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			// this.getuserinfo()
			this.getexpenses()
		},
		methods: {
			getuserinfo(){
				var that=this
				uniCloud.callFunction({
					name:"login-by-weixin",
					data:{
						funct:"getuserinfotoken",
						token:uni.getStorageSync('uni_id_token')
					},
					success(res) {console.log(res)
						if(res.result.code==-2){
							uni.showToast({
								icon:"none",
								title:res.result.message
							})
						}else{
							uni.setStorageSync('userinfo',res.result.userInfo)
							this.userinfo=uni.getStorageSync('userinfo')
						}
					}
				}) 
			},
			getexpenses(){
				var that=this
				uniCloud.callFunction({
					name:"login-by-weixin",
					data:{
						funct:"user-expenses",
						token:uni.getStorageSync('uni_id_token')
					},
					success(res) {console.log(res)
						// if(res.result.code==-2){
						// 	uni.showToast({
						// 		icon:"none",
						// 		title:res.result.message
						// 	})
						// }else{
						// 	uni.setStorageSync('userinfo',res.result.userInfo)
						// 	this.userinfo=uni.getStorageSync('userinfo')
						// }
					}
				}) 
			},
			detail(e){
				// switch (e){
				// 	case 1:
				// 	uni.navigateTo({
				// 		url:"./extract"
				// 	})
				// 	break;
				// }
			}
		}
	}
</script>

<style>

</style>
