<template>
	<view class="relative flex flex-col h-screen overflow-hidden">
		<map class="w-full flex-grow" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		<scroll-view class="h-96 pt-6 bg-green-600 rounded-t-2xl" scroll-y="true" >
			<view class="px-6 pb-20" style="border-radius: 40rpx 40rpx 0 0;">
				<view>
					<text class="text-sm leading-none font-semibold text-white">
						全城共有
						<text class="text-lg leading-none text-green-200">{{stores.length}}</text>
						家店期待为您提供服务
					</text>
				</view>
			
				<view class="space-y-6 mt-5">
					<template v-for="(item, index) in stores" :key="index">
						<view @click="toStore(item, index)" class="bg-white rounded-xl overflow-hidden shadow-md" >
							<image class="w-full" :src="item.cover" mode="widthFix"></image>
							<view class="flex flex-col items-start py-4 px-5 space-y-2">
								<text class="text-base font-semibold capitalize">{{item.name}}</text>
								<view class="flex items-end justify-between w-full">
									<view class="flex flex-col items-start space-y-2">
										<text class="text-sm leading-none text-gray-500">{{item.business_hours}}</text>
										<text class="text-sm leading-none text-gray-500">{{item.call}}</text>
									</view>
									<text class="text-xl leading-none font-bold text-green-700">{{item.score}}</text>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				latitude: 34.270,
				longitude: 108.947,
				covers: [{
					id: 1,
					latitude: 34.909,
					longitude: 108.39742,
					iconPath: '../../static/map.png'
				}, {
					id: 2,
					latitude: 34.90,
					longitude: 108.39,
					iconPath: '../../static/map.png'
				}]
			};
		},
		computed: {
			...mapState({
				stores: state => state.stores
			})
		},
		methods: {
			toStore(item, index){
				uni.setStorage({
					key: 'store',
					data: item,
					success () {
						uni.switchTab({
							url: '/pages/home/home'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
