<template>
	<view>
		<view v-if="info">
			<u-swiper :list="info.images" name='img' height="650" img-mode="scaleToFill" mode="number" indicator-pos="bottomRight"></u-swiper>
			<view class="padding bg-white radis-img" style="margin: 15rpx;">
				<view class="flex justify-between">
					<view class="text-red" >
						￥<text class="" style="font-size: 36rpx;font-weight: 600;">{{info.price}}</text>
					</view>
					<view class="">
						库存：{{info.stock}}
					</view>
					<view class="">
						销量：{{info.sales}}
					</view>
				</view>
				<view class="margin-top-sm" style="font-weight: 600;">
					{{info.name}}
				</view>
			</view>
			
			<view class="padding bg-white radis-img" style="margin: 15rpx 15rpx 120rpx 15rpx;">
				<u-parse :html="info.content"></u-parse>
			</view>
			
			<view class="cu-bar bg-white tabbar  shop foot">
				<button class="action" @click="kefu">
					<view class="cuIcon-service text-green"></view>
					客服
				</button>
				<view class="action" @click="storeDetail">
					<view class="cuIcon-shop"></view> 店铺
				</view>
				<view class="btn-group">
					<button class="cu-btn bg-green round shadow-blur" open-type="share">分享</button>
					<button @click="suborder()" class="cu-btn bg-orange round shadow-blur" v-if="info.store_id[0].status==1">立即订购</button>
					<button class="cu-btn bg-grey round shadow-blur" disabled v-else >店铺已打烊</button>
				</view>
			</view>
		</view>
		<!-- <u-action-sheet :list="sheetlist" v-model="sheetshow" @click="sheetclick"></u-action-sheet> -->
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
				sheetshow:false,
				sheetlist: [{
					text: '隐藏'
				}, {
					color: 'red',
					text: '删除' 
				}],
				id:'',
				info:''
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onShow() {
			
		},
		onLoad(e) {
			this.id=e.id
			if(this.id){
				uni.showLoading({
					title: '加载中'
				});
				this.getDetail()
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.info.name,
				path: '/shop/product/product?id='+this.id,
				imageUrl:this.info.cover
			}
		},
		onShareTimeline() {
			return {
				title: this.info.name,
				path: '/shop/product/product?id='+this.id,
				imageUrl:this.info.cover
			}
		},
		methods:{
			getDetail() {
				db.collection('mdsh-store-product,mdsh-store')
					.where({
						status: true,
						_id:this.id
					})
					.get({
						getOne:true
					}).then((res) => {
						const data = res.result.data;
						if (data) {
							this.info=data
						} else {
							uni.showToast({
								icon:"none",
								title:"商品不存在或已下架"
							})
							setTimeout(() => uni.navigateBack(), 500)
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading();
					})
			},
			kefu(){
				uni.navigateTo({
					url:"/shop/store/detail?id="+this.info.store_id[0]._id
				})
			},
			storeDetail(){
				uni.navigateTo({
					url:"/shop/store/store?id="+this.info.store_id[0]._id
				})
			},
			suborder(){
				this.info.count=1;
				//#ifdef MP-QQ
				uni.showToast({
					icon:"none",
					title:"QQ端暂不支持，请搜索微信小程序“民大生活”"
				})
				//#endif
				//#ifdef MP-WEIXIN
				if(this.userinfo){
					if(this.userinfo.school_id != this.info.store_id[0].school_id){
						uni.showToast({
							icon:"none",
							title:"不能跨校区下单"
						})
					}else{
						let aaa={
							_id:this.info._id,
							name:this.info.name,
							price:this.info.price,
							cover:this.info.cover,
							stock:this.info.stock,
							count:1
						}
						
						let arr = [];
						arr.push(aaa)
						arr=JSON.stringify(arr)
						uni.navigateTo({
							url:"/shop/order/confirm?data="+arr+"&&store_id="+this.info.store_id[0]._id
						})
					}
				}else{
					this.login()
				}
				//#endif
			},
			delt(id){
				this.sheetshow=true;
			},
			sheetclick(e){
				this.$u.api.delpro({
					id:this.id,
					type:e
				}).then(res => {
					uni.showToast({
						icon:"success",
						title:res.msg
					})
				})
			},
			login(){
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url:"/pages/login/login"
				})
				//#endif
			},
			authSuccess(){
				this.userinfo=uni.getStorageSync('userinfo')
			}
		}
	}
</script>

<style lang="scss">

</style>
