<template>
	<view>
		<view v-if="form.ids.length">
			<view class="" style="margin-bottom: 120rpx;">
				<view class="bg-white radis-img" style="margin: 15rpx;"  >
					<view class="padding-sm" v-for="(res,index) in form.ids" :key="index">
						
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
										库存：{{res.stock}}
									</view>
								</view>
							</view>
						</view>
						<view class="flex justify-between ">
							<view class="">
								购买数量
							</view>
							<view class="">
								<u-number-box :min="0" :max="res.stock" v-model="res.count" @plus="addCart(res,index)" @minus="decreaseCart(res,index)"></u-number-box>
							</view>
						</view>
					</view>
				</view>
				
				<view class="padding bg-white radis-img" style="margin: 15rpx;" >
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">收货人：</view>
						<input type="text" v-model="form.take_user" maxlength="10" placeholder="请输入收货人姓名" />
					</view>
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">手机号：</view>
						<input type="number" v-model="form.take_phone" maxlength="11" placeholder="请输入手机号" />
					</view>
					<view class="cu-form-group" style="padding: 0;">
						<view class="title">送达地址：</view>
						<textarea maxlength="100" v-model="form.take_address" placeholder="请输入收货地址"></textarea>
					</view>
				</view>
				
				<view class="padding bg-white radis-img " style="margin: 15rpx;">
					<view class="">
						备注
					</view>
					<view class="margin-top-sm">
						<textarea style="width: 100%;background-color: #F8F8F8;border-radius: 15rpx;" v-model="form.remarks" placeholder="请输入备注信息"></textarea>
					</view>
				</view>
				
				<view class="padding bg-white radis-img " style="margin: 15rpx;">
					<view class="">
						支付方式
					</view>
					<view class="">
						<radio-group class="block">
							<view class="cu-form-group margin-top">
								<view class="title">
									<text class="cuIcon-weixin" style="font-size: 36rpx;color: #18B566;"></text>
									微信支付</view>
								<radio class='radio' color="#00bc8e" checked></radio>
							</view>
						</radio-group>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white tabbar  shop foot" style="padding: 0 26rpx;">
				<view class=""> 
					<text>共{{getAllCount}}件，合计:</text>
					<text class="text-red">￥</text>
					<text class="text-red" style="font-weight: 600;font-size: 36rpx;">{{getAllPrice}}</text>
				</view>
				<view class="">
					<button class="cu-btn bg-grey round shadow-blur" disabled v-if="getAllPrice<store.delivery_price">起送价{{store.delivery_price}}</button>
					<button class="cu-btn bg-orange round shadow-blur" v-else @click="subm">提交订单</button>
				</view>
			</view>
		</view>
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;
	import auth from "@/components/auth.vue"
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			auth
		},
		data() {
			return {
				info:'',
				store:'',
				form:{
					ids:[],
					take_user:'',
					take_phone:'',
					take_address:'',
					store_id:'',
					remarks:'',
					order_id:""
				}
			}
		},
		computed:{
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			}),
			// 获得购物车所有商品数量
			getAllCount() {
				let result = 0;
				this.form.ids.forEach((food) => {
					result += food.count
				})
				return result
			},
			// 总价
			getAllPrice() {
				let result = 0;
				let result1 = 0;
				this.form.ids.forEach((food) => {
					result1 += this.accMul(food.count, food.price)
					result = result1.toFixed(2);
				})
				return result
			}
		},
		onLoad(e) {
			if(e.data){
				let datas=JSON.parse(e.data)
				this.form.store_id=e.store_id
				this.getStoreDetail(this.form.store_id)
				this.form.ids=datas
			}
		},
		methods: {
			subm(){
				if(this.hasLogin){
					// #ifdef MP-WEIXIN
					if(this.form.ids.length<1) return this.showtotal('商品信息有误')
					if(this.getAllCount<1) return this.showtotal('数量不能小于1')
					if(this.form.take_user=='') return this.showtotal('请输入收货人姓名')
					if(this.form.take_phone=='') return this.showtotal('请输入收货人手机号')
					if(!this.$u.test.mobile(this.form.take_phone)) return this.showtotal('手机号码有误')
					if(this.form.take_address=='') return this.showtotal('请输入收货地址')
					this.settempst()
					// #endif
					// #ifdef MP-QQ
					uni.showToast({
						icon:"none",
						title:"暂不支持"
					})
					// #endif
				}else{
					this.login()
				}
			},
			getStoreDetail(id) {
				db.collection("mdsh-store").doc(id).field(
					'delivery_price'
					).get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.store = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					
				})
			},
			orderrefer() {
				uni.showLoading({
				    title: '订单提交中'
				});
				this.form.num=this.getAllCount
				this.form.pay_money=parseFloat(this.getAllPrice)
				this.form.order_id=this.$u.date(new Date(), 'yyyymmdd')+this.$u.random(1111111111, 9999999999)
				db.collection("mdsh-order").add(this.form).then((res) => {
					this.pay(res.result.id)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			
			pay(id){
				var that=this
				new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: 'pay',
						data: {
							token:uni.getStorageSync('uni_id_token'),
							provider:'wxpay_mp-weixin',
							funct:'pay',
							type:1,
							id:id
						},
						success(res) {
							if (res.result.order) {
								return new Promise((resolve, reject) => {
									uni.requestPayment({
										// #ifdef APP-PLUS
										provider: selectedProvider,
										// #endif
										// #ifdef MP-WEIXIN
										...res.result.order,
										// #endif
										// #ifdef APP-PLUS || MP-ALIPAY
										orderInfo: res.result.order,
										// #endif
										success: function (res) {
											uni.showToast({
												icon:"success",
												title:"支付成功"
											})
											setTimeout(() => {
												uni.navigateTo({
													url:"./order?id="+id
												})
											}, 2000)
										},
										fail: function (err) {
											uni.showToast({
												icon:"none",
												title:"支付失败"
											})
											setTimeout(() => {
												uni.navigateTo({
													url:"./order?id="+id
												})
											}, 2000)
										}
									})
								})
							} else {
								uni.showModal({
									content: '支付失败',
									showCancel: false
								})
							}
						},
						fail() {
							uni.showToast({
								icon:"none",
								title:"支付失败"
							})
							setTimeout(() => {
								uni.navigateTo({
									url:"./order?id="+id
								})
							}, 2000)
						}
					})
				}).catch((err) => {
					uni.showModal({
						content: err.message || '支付失败',
						showCancel: false
					})
				})
			},
			showtotal(title){
				uni.showToast({
					icon:"none",
					title:title
				})
			},
			settempst(){
				var that=this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
				  tmplIds: ['LmeczVAWZm_n0hzrseuzwSBDMDhOFzqbpVZBbYsFStY','xPQILFhAa-7rrz4dNYfEkMz3Py7GNBiQR9UvJjQFwZk','WyPKnL0yL1wry_7IVpWG6Wd72TdEWLgW5tNUS7M8oYg'],
				  complete (res) {
					  that.orderrefer()
				  }
				})
				//#endif	
			},
			accMul(arg1, arg2) {
				let m = 0,
					s1 = '',
					s2 = '';
				if (arg1 && arg1 != null)
					s1 = arg1.toString();
				if (arg2 && arg2 != null)
					s2 = arg2.toString();
				try {
					m += s1.split('.')[1].length
				} catch (e) {}
				try {
					m += s2.split('.')[1].length
				} catch (e) {}
			
				return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
			},
			addCart(item) {
				if (item.count >= 0) {
					this.form.ids.forEach((food) => {
						if (item._id == food._id)
							food.count = item.count
					})
				} else {
					this.form.ids.forEach((food) => {
						if (item._id == food._id)
							this.$set(food, 'count', 1)
					})
				}
			},
			decreaseCart(item,index) {
				if (item.count) {
					this.form.ids.forEach((food) => {
						if (item._id == food._id)
							food.count = item.count
					})
				}else{
					this.form.ids.splice(index,1)
				}
			},
			login() {
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url: "/pages/login/login"
				})
				//#endif
			},
			authSuccess() {
				// this.userinfo=uni.getStorageSync('userinfo')
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>