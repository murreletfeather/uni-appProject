<template>
	<view class="pb-10 pt-4">
		<view class="fixed top-0 left-0 z-30 flex items-center w-full h-14 px-6 space-x-3 bg-white">
			<uni-icons @click="toBack" type="arrow-left" color="#15151b" size="56"></uni-icons>
			<text class="text-base font-semibold">{{category.name}}</text>
		</view>
		<view class="mt-16">
			<view class="px-6 space-y-5 mt-5">
				<template v-for="(item, index) in products" >
					<view @click="toProductShow(item, index)" class="flex items-start p-2 rounded-xl overflow-hidden bg-gray-100 border-l2-green" :key="item.id">
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
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				products: [],
				category: false,
			};
		},
		computed: {
			
		},
		onLoad(params) {
			let id = parseInt(params.id)
			this.category = this.$store.getters.getCategoryById(id);
			this.products = this.$store.getters.getProductsByCategoryId(id);
		},
		methods: {
			toProductShow(item, index){
				uni.navigateTo({
					url: `/pages/product/show?id=${item.id}`
				})
			},
			toBack(){
				uni.navigateBack()
			}
		}
		
	}
</script>

<style lang="scss">

</style>
