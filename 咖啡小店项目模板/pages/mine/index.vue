<template>
	<view class="relative pb-10">
		<view class="flex flex-col items-center pb-10 bg-green-700">
			<view class="flex items-center w-full h-16 px-6 space-x-3 text-white">
				<text class="text-base font-semibold">个人中心</text>
			</view>
			<view class="user-avatar mt-14">
				<image class="avatar" :src="userInfo.avatar" mode="aspectFit"></image>
			</view>
			<text class="text-xl font-semibold text-white leading-none mt-14">{{userInfo.username}}</text>
			<view class="grid grid-cols-4 gap-4 w-full px-10 mt-10">
				<button @click="toOrderPage" class="flex items-center justify-center w-14 h-14 bg-white rounded-full">
					<uni-icons type="calendar" color="#047857" size="56"></uni-icons>
				</button>
				<button class="flex items-center justify-center w-14 h-14 bg-white rounded-full">
					<uni-icons type="location" color="#047857" size="56"></uni-icons>
				</button>
				<button class="flex items-center justify-center w-14 h-14 bg-white rounded-full">
					<uni-icons type="email" color="#047857" size="56"></uni-icons>
				</button>
				<button class="flex items-center justify-center w-14 h-14 bg-white rounded-full">
					<uni-icons type="gear" color="#047857" size="56"></uni-icons>
				</button>
			</view>
		</view>
		
		<view class="mt-8">
			<view class="flex items-center justify-between px-6 ">
				<text class="text-lg font-bold">猜你喜欢</text>
			</view>
			
			<view class="px-6 space-y-5 mt-3">
				<template v-for="(item, index) in products" :key="item.id">
					<view @click="toProductShow(item, index)" class="flex items-start p-2 rounded-xl overflow-hidden bg-gray-100 border-l2-green" >
						<view class="relative flex-shrink-0">
							<image class="w-28 rounded-xl" :src="item.cover" mode="widthFix"></image>
						</view>
						<view class="flex flex-col flex-grow items-start px-4 py-2">
							<text class="text-base font-semibold">{{item.title}}</text>
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
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters({
				products: 'productShowInHome'
			}),
			...mapState({
				userInfo: state => state.user.info,
			})
		},
		methods: {
			toOrderPage(){
				uni.navigateTo({
					url: '/pages/mine/orders'
				})
			},
			toProductShow(item, index){
				uni.navigateTo({
					url: `/pages/product/show?id=${item.id}`
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.user-avatar{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		.avatar{
			width: 240rpx;
			height: 240rpx;
			border-radius: 200rpx;
		}
		&::before{
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 400rpx;
			height: 400rpx;
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 400rpx;
		}
		&::after{
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 320rpx;
			height: 320rpx;
			border: 6px solid #FFCFA7;
			border-radius: 300rpx;
		}
	}
</style>
