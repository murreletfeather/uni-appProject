<template>
	<view class="pb-10 text-gray-800">
		<view class="flex items-end justify-between px-6 mt-4">
			<view class="flex flex-col items-start space-y-2">
				<text class="text-sm text-gray-700">Good Morning</text>
				<text class="leading-none text-2xl font-bold">{{userInfo.username}}</text>
			</view>
			<view class="relative">
				<image class="w-12 rounded-xl border" :src="userInfo.avatar" mode="widthFix"></image>
			</view>
		</view>
		
		<view class="px-6 mt-8">
			<swiper class="h-14" :duration="500">
				<template v-for="(item, index) in banners" :key="index">
					<swiper-item class="rounded-lg overflow-hidden" >
						<image class="h-full" :src="item.cover" mode="heightFix"></image>
					</swiper-item>
				</template>
			</swiper>
		</view>
		
		<view class="px-6 mt-8">
			<view class="relative">
				<input placeholder-class="text-gray-400 font-light" class="w-full h-14 px-4 bg-gray-50 border rounded-full text-sm" placeholder="想吃点什么" type="text" />
				<view class="absolute top-1v2 right-4 transform -translate-y-1v2 text-gray-400">
					<uni-icons type="search" color="#9CA3AF" size="48"></uni-icons>
				</view>
			</view>
		</view>
		
		
	
		<view class="mt-8">
			<view class="flex items-center justify-between px-6 ">
				<text class="text-lg font-bold">今日特惠</text>
			</view>
			<swiper class="h-40 mt-3" :duration="500" previous-margin="48rpx" next-margin="80rpx">
				<template v-for="(item, index) in discounts" :key="index">
					<swiper-item class="pr-6" >
						<view @click="toProductShow(item, index)" class="relative flex w-full h-full px-5 py-6 bg-center bg-cover rounded-xl overflow-hidden" :style="{backgroundImage: `url(${item.bg_cover})`, backgroundColor: `${item.bg_color}`}">
							<view class="flex flex-col items-start w-48 text-white">
								<text class="text-lg font-semibold">{{item.title}}</text>
								<view class="flex items-end space-x-2 mt-4">
									<text class="text-xl leading-none font-bold">￥{{item.discount_price}}</text>
									<text class="text-base leading-none text-yellow-200 line-through">￥{{item.price}}</text>
								</view>
							</view>
							<image class="absolute top-1v2 right-4 w-28" :src="item.thumb" mode="widthFix"></image>
						</view>
					</swiper-item>
				</template>
			</swiper>
		</view>
		
		<view class="mt-8">
			<view class="flex items-center justify-between px-6 ">
				<text class="text-lg leading-none font-bold">食谱菜单</text>
			</view>
			<swiper class="h-24 mt-2" :duration="500" previous-margin="48rpx" next-margin="240rpx">
				<template v-for="(item, index) in categories" :key="index">
					<swiper-item class="py-2 pr-6" >
						<view @click="toProductCategory(item, index)" class="flex items-start h-full space-x-3 px-5 py-6 rounded-xl bg-green-700 text-white">
							<image class="w-8 h-8" :src="item.icon" mode="widthFix"></image>
							<view class="flex flex-col items-start space-y-2">
								<text class="leading-none text-base font-bold capitalize">{{item.name}}</text>
								<text class="text-sm text-yellow-200 capitalize">{{item.total}} menus</text>
							</view>
						</view>
					</swiper-item>
				</template>
			</swiper>
		</view>
		
		<view class="mt-8">
			<view class="flex items-center justify-between px-6 ">
				<text class="text-lg leading-none font-bold">今日推荐</text>
			</view>
			
			<view class="px-6 space-y-5 mt-4">
				<template v-for="(item, index) in products" :key="item.id">
					<view @click="toProductShow(item, index)" class="flex items-start p-2 rounded-xl overflow-hidden bg-gray-100 border-l2-green" >
						<view class="relative flex-shrink-0">
							<image class="w-28 rounded-xl" :src="item.cover" mode="widthFix"></image>
						</view>
						<view class="flex flex-col flex-grow items-start px-4 py-2">
							<text class="text-base font-bold">{{item.title}}</text>
							<view class="flex items-end justify-between w-full mt-4">
								<view class="flex flex-col items-start space-y-2">
									<view class="flex items-end space-x-1 w-full">
										<text class="text-lg text-yellow-600 leading-none font-bold">￥{{item.discount_price}}</text>
										<text class="text-sm leading-none line-through text-gray-400">￥{{item.price}}</text>
									</view>
									<text class="text-sm leading-none text-gray-400">今日已售{{Math.floor(Math.random()*100)}}份</text>
								</view>
								
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		
		<view class="mt-10 px-6">
			<view class="relative rounded-xl overflow-hidden bg-green-700">
				<image class="w-full" :src="store.cover" mode="widthFix"></image>
				<view class="flex flex-col px-4 py-5 space-y-2 text-white">
					<text class="text-base">{{store.name}}</text>
					<view class="flex items-end justify-between">
						<view class="flex flex-col items-start space-y-2 text-sm leading-none text-gray-300">
							<text>{{store.business_hours}}</text>
							<text>{{store.call}}</text>
						</view>
						<view class="">
							<view class="grid place-content-center w-10 h-10 rounded-full bg-white bg-opacity-20">
								<uni-icons type="phone" color="#FFFFFF" size="48" ></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	
	export default {
		data() {
			return {
				store: false,
			};
		},
		computed: {
			...mapGetters({
				products: 'productShowInHome'
			}),
			...mapState({
				banners: state => state.home.banners,
				discounts: state => state.home.discounts,
				stores: state => state.stores,
				categories: state => state.categories.categories,
				userInfo: state => state.user.info,
			})
		},
		onShow() {
			let store = uni.getStorageSync('store');
			if(store){
				this.store = store;
			}else{
				this.store = this.stores[Math.floor(Math.random()*this.stores.length)];
				uni.setStorageSync('store', this.store);
			}
		},
		
		methods: {
			toProductShow(item, index){
				uni.navigateTo({
					url: `/pages/product/show?id=${item.id}`
				})
			},
			toProductCategory(item){
				uni.navigateTo({
					url: `/pages/product/category?id=${item.id}`
				})
			}
			
		}
	}
</script>

<style scoped lang="scss">
</style>
