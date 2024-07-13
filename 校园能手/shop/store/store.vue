<template>
	<view>
		<unicloud-db ref="udbStore" v-slot:default="{data, loading, error, options}"
			collection="mdsh-store" field="name,cover,notice,score,status,delivery_price,school_id" getone :where="StoreWhere" loadtime="manual" @load="handleLoad">
			<view v-if="data">
				<view class="bg-white padding solid-bottom">
					<view class="flex align-center" @click="storeDetail(1)">
						<view class="">
							<view class="cu-avatar radius" :style="[{ backgroundImage:'url(' + data.cover+ ')' }]"></view>
						</view>
						<view class="margin-left-sm flex justify-between" style="width: 100%;">
							<view class="">
								<view class="">
									{{data.name}}
									<text class="cuIcon-right"></text>
									<text>满{{data.delivery_price || 0}}元起送</text>
								</view>
								<view class="text-gray">
									<u-rate :disabled="true" v-model="data.score/2" size="26"></u-rate>
									<text class="text-red">{{data.score}}</text>
								</view>
							</view>
							<view class="">
								<view class="" v-if="data.status==1">
									<button class="cu-btn round sm bg-green">营业中</button>
								</view>
								<view class="" v-else>
									<button class="cu-btn round sm bg-grey">已打烊</button>
								</view>
							</view>
						</view>
					</view>
					<view class="padding-top-sm" style="font-size: 24rpx;">
						公告：{{data.notice ? data.notice : "无"}}
					</view>
				</view>
			</view>
		</unicloud-db>
		
		
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop"
				style="height:calc(100vh - 90upx)">
				<view class="cu-item" :class="index==tabCur?'text-green bg-white':''" v-for="(item,index) in list"
					:key="index" @tap="TabSelect" :data-id="index">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 90upx);margin-bottom: 120rpx;"
				:scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view class="padding-left-xs padding-right-xs" v-for="(item,index) in list" :key="index"
					:id="'main-'+index">
					<view class="cu-bar bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text>{{item.name}}
						</view>
					</view>
					<view v-for="(res,indexb) in item.prod" :key="indexb" class="  radis-img bg-white flex"
						style="margin: 6rpx;padding: 8rpx;" @click="pdetail(res._id)">
						<view class="">
							<image :src="res.cover" lazy-load webp mode="aspectFill"
								style="width: 180rpx;height: 180rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="flex flex-direction justify-between margin-left-sm" style="width: 100%;">
							<view class="">

								<view class="">
									<text class="lg text-orange cuIcon-hotfill" v-if="res.is_hot"></text>
									<view class='cu-tag radius sm bg-green' v-if="res.is_best">精选</view>
									{{res.name}}
								</view>

							</view>
							<view class="text-gray" style="font-size: 24rpx;">
								库存：{{res.stock}}
							</view>
							<view class="margin-top-sm flex justify-between align-end">
								<view class="text-red" style="font-size: 34rpx;font-weight: 600;">
									￥{{res.price}}
								</view>
								
								<view class="">
									<u-number-box :max="res.stock" @plus="addCart(res,index)" v-model="res.count"  @minus="decreaseCart(res,index)"></u-number-box>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="foot cu-bar tabbar item-bg shadow" style="border-radius: 200rpx;width: 88%;margin: 10rpx 6%;z-index: 10076;">
			<view class="action text-gray add-action">
				<view class="cuIcon-cart item-bgs" @click="showCartbt">
					<view class="cu-tag badge" v-if="list.length>0">{{getAllCount}}</view>
				</view>
			</view>
			<view class="action text-red" style="font-size: 36rpx;font-weight: 600;">
				<view v-if="getAllCount">
					<text style="font-size: 24rpx;">￥</text>{{getAllPrice}}
				</view>
			</view>
			<view class="action text-orange" style="font-size: 36rpx;font-weight: 600;border-radius: 0 100rpx 100rpx 0;">
				<button @click="buyNow" type="" :class="getAllCount ? 'bg-orange' : 'bg-grey'" style="width: 100%;height: 100rpx;border-radius: 0 100rpx 100rpx 0;" :disabled="getAllCount || storeinfo.status==1 ? false : true">{{storeinfo.status==1 ?'结算' : '已打烊'}}</button>
			</view>
		</view>
		
		<u-popup v-model="showCart" mode="bottom" border-radius="15" height="700">
			<view class="padding-sm" style="margin-bottom: 150rpx;">
				<view class="text-right" @click="delAll">
					清空购物车
				</view>
				<scroll-view scroll-y="true" style="height: 520rpx;">
					<view class="flex" v-for="(res,index) in getList" :key="index">
						<view class="">
							<image :src="res.cover" webp mode="aspectFill"
								style="width: 120rpx;height: 120rpx;border-radius: 15rpx;"></image>
						</view>
						<view class="justify-between margin-left-sm" style="display: flex; flex-direction: column;flex: 2;">
							<view class="">
								{{res.name}}
							</view>
							<view class="flex" style="justify-content: space-between;">							
								<view class="">
									<text class="text-orange">￥{{res.price}}</text>
									<text class="margin-left-sm">{{res.stock}}</text>
								</view>
								<view class="">
									<u-number-box :max="res.stock" @plus="addCart(res,index)" v-model="res.count" @minus="decreaseCart(res,index)"></u-number-box>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import auth from "@/components/auth.vue"
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		components: {
			auth
		},
		data() {
			return {
				StoreWhere:"status=="+1,
				prodWhere:"status=="+true,
				
				showCart:false,
				list: [],
				good:[],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true,
				store_id: '',
				value:0,
				storeinfo:''
			};
		},
		onLoad(e) {console.log(this.hasLogin);
			this.store_id=e.id
			if(this.store_id){
				this.StoreWhere=this.StoreWhere+'&&' + "_id=='" + this.store_id + "'"
				this.prodWhere=this.prodWhere+"&&"+ "cate_id.store_id=='" + this.store_id + "'"+"&&cate_id.status==true"
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.storeinfo.name,
				path: '/shop/store/store?id='+this.store_id
			}
		},
		onReady() {
			if(this.store_id){
				uni.showLoading({
					title: '加载中'
				});
				this.$refs.udbStore.loadData()
				//this.getplist()
			}
		},
		onShareTimeline() {
			return {
				title: this.storeinfo.name,
				path: '/shop/store/store?id='+this.store_id
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			}),
			getList() {
				let result = [];
				this.list.forEach((good) => {
					good.prod.forEach((food) => {
						if (food.count>0) {
							result.push(food)
						}
					})
				})
				if(result.length<1){
					this.showCart=false
				}
				return result
			},
			// 获得购物车所有商品数量
			getAllCount() {
				let result = 0;
				this.getList.forEach((food) => {
					result += food.count
				})
				return result
			},
			// 总价
			getAllPrice() {
				let result = 0;
				let result1 = 0;
				this.list.forEach((good) => {
					good.prod.forEach((food) => {
						result1 += this.accMul(food.count, food.price)
						result = result1.toFixed(2);
					})
				})
				return result
			}
		},
		methods: {
			handleLoad(data, ended, pagination){
				this.storeinfo=data
				this.getplist()
				uni.hideLoading();
			},
			buyNow(){
				if(this.hasLogin){
					if(this.storeinfo.school_id!=this.userinfo.school_id){
						return uni.showToast({
							icon:"none",
							title:"无法跨校区下单"
						})
					}
					if(this.storeinfo.status!=1){
						return uni.showToast({
							icon:"none",
							title:"店铺已打烊"
						})
					}
					let arr=this.getList;
					let arrb=[];
					arr.forEach((food) => {
						let aerrc={
							_id:food._id,
							name:food.name,
							price:food.price,
							stock:food.stock,
							count:food.count,
							cover:food.cover,
						}
						arrb.push(aerrc)
					})
					let data = JSON.stringify(arrb)
					uni.navigateTo({
						url:"/shop/order/confirm?data="+data+"&&store_id="+this.storeinfo._id
					})
				}else{
					this.login()
				}
			},
			showCartbt(){
				if(this.getAllCount>0){
					this.showCart=!this.showCart
				}
			},
			// 解决浮点数 运算出现多位小数
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
			getplist() {
				db.action("store-store-product")
				.collection("mdsh-store-product,mdsh-store-product-cate")
				.where(this.prodWhere)
				.field("name,cover,price,is_hot,is_best,stock,cate_id{name,status,store_id}")
				.get()
				.then((res) => {
					let arr=res.result.data
					arr.forEach((good,index) => {
						good.prod.forEach((food) => {
							food.count = 0
						})
					})
					this.list=arr
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			storeDetail(){
				uni.navigateTo({
					url:"./detail?id="+this.store_id
				})
			},
			pdetail(id){
				uni.navigateTo({
					url:"../product/product?id="+id
				})
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			VerticalMain(e) {
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);

						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						return false
					}
				}
			},
			addCart(item) {
				if (item.count >= 0) {
					this.list.forEach((good,index) => {
						good.prod.forEach((food) => {
							if (item._id == food._id)
								food.count = item.count
						})
					})
					
				} else {
					this.list.forEach((good,index) => {
						good.prod.forEach((food) => {
							if (item._id == food._id)
								this.$set(food, 'count', 1)
						})
					})
				}
			},
			decreaseCart(item) {
				if (item.count) {
					this.list.forEach((good) => {
						good.prod.forEach((food) => {
							if (item._id == food._id)
								food.count = item.count
						})
					})
				}
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
			// 清空购物车
			delAll() {
				this.list.forEach((good) => {
					good.prod.forEach((food) => {
						if (food.count) {
							food.count = 0
						}
					})
				})
			}
		}
	}
</script>

<style>
	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		font-size: 24upx;
		width: 150upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		/* background-color: #f1f1f1; */
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #FFFFFF;
		flex: 1;
	}
</style>