<template>
	<view class="min-h-screen px-2 bg-gray-100">
		<view class="fixed top-0 left-0 z-30 flex items-center w-full h-14 px-3 space-x-3 text-white">
			<uni-icons @click="toBack" type="arrow-left" color="#FFFFFF" size="56"></uni-icons>
			<text class="text-base font-semibold">{{product.title}}</text>
		</view>
		
		<view class="fixed top-0 left-0 z-10 w-full">
			<view class="relative">
				<image class="w-full" :src="product.picture" mode="widthFix"></image>
				<view class="absolute top-0 left-0 w-full h-full bg-green-600 bg-opacity-10 backdrop-filter  backdrop-blur-sm"></view>
			</view>
		</view>
		
		<view class="relative z-20" style="padding-top: 360rpx;">
			<view class="bg-white rounded-t-2xl">
				<view class="py-8 px-6">
					<view class="flex flex-col items-center">
						<image class="w-24 -mt-16 rounded-xl border-2" :src="product.cover" mode="widthFix"></image>
						<text class="text-lg font-semibold mt-5">{{product.title}}</text>
						<text class="text-gray-500 text-center text-sm mt-5 leading-relaxed">在咖啡豆中产生超过600种的挥发性香气化合物。先是产生清新的花香、果香到调性更为低沉的花果香气，接着产生香草、奶油以及焦糖的调性。</text>
					</view>
					
					<view class="grid grid-cols-4 gap-4 mt-10">
						<template v-for="(item, index) in sizes">
							<view :key="index"
							@click="switchSize(item, index)"
							:class="['flex items-center justify-center w-14 h-14 rounded-2xl text-xl leading-none', item.active?'bg-yellow-200 text-gray-700':'border-2 border-yellow-200 bg-yellow-100 text-gray-400']">
								{{item.name}}
							</view>
						</template>
					</view>
					
					<view class="flex items-center justify-between mt-10">
						<view class="flex items-center space-x-1 text-green-700">
							<uni-icons type="shop-filled" color="#047857" size="64"></uni-icons>
							<text class="text-2xl leading-none font-semibold">￥{{product.isDiscount?product.discount_price:product.price}}</text>
						</view>
						
						<view class="flex items-center justify-between h-12 px-2 border-2 rounded-full">
							<view @click="setCount(false)">
								<uni-icons type="minus" color="#047857" size="64"></uni-icons>
							</view>
							<view class="flex items-center justify-center w-12 text-xl font-medium leading-none">{{count}}</view>
							<view @click="setCount(true)">
								<uni-icons type="plus" color="#047857" size="64"></uni-icons>
							</view>
						</view>
					</view>
					
					<view class="mt-10">
						<button @click="toCartList" class="flex items-center justify-center w-full h-14 space-x-1 rounded-full bg-yellow-500 text-base leading-none">
							<uni-icons type="wallet" color="#1F2937" size="52"></uni-icons>
							<text class="font-semibold">去购物车结算</text>
						</button>
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
				product: false,
				category: false,
				count: 0,
				sizes: [
					{name: 'SM', active: false},
					{name: 'MD', active: true},
					{name: 'LG', active: false},
					{name: 'XL', active: false},
				]
			};
		},
		onLoad(params) {
			let id = parseInt(params.id)
			this.product = this.$store.getters.getProductById(id);
			this.category = this.$store.getters.getCategoryById(this.product.category_id);
			
			let carts = uni.getStorageSync('carts');
			if(carts){
				let add_product = carts.find(item=>item.id == this.product.id);
				if(add_product){
					this.count = add_product.count;
				}
			}
			
		},
		methods: {
			toBack(){
				uni.navigateBack()
			},
			switchSize(item, index){
				let sizes = this.sizes.map(size=>{
					size.active = false;
					return size;
				})
				sizes[index]['active'] = true;
				this.sizes = sizes
			},
			setCount(flag){
				if(flag){
					if(this.count <= 23){
						this.count = this.count + 1;
					}
				}else{
					if(this.count>=1){
						this.count = this.count - 1;
					}
				}
				this.addToCart(this.count)
			},
			toCartList(){
				uni.switchTab({
					url: '/pages/shop/cart'
				})
			},
			addToCart(count){
				let product = this.product;
				
				let carts = uni.getStorageSync('carts');
				if(!carts){carts=[]}
				let index;
				
				let add_product =  carts.find((item, idx)=>{
					if(item.id == product.id){
						index = idx;
						return true
					}else{
						return false;
					}
				});
				
				if(count<=0 && add_product){
					carts.splice(index, 1);
					uni.setStorageSync('carts', carts);
					return false;
				}
				
				let price = product.isDiscount?product.discount_price:product.price;
				if(add_product){
					add_product.count = count;
					add_product.amount = count* parseInt(price);
					carts[index] = add_product;
				}else{
					add_product = {...product, count: count, amount: count* parseInt(price)}
					carts.push(add_product);
				}
				uni.setStorageSync('carts', carts);
			}
		}
		
	}
</script>

<style scoped lang="scss">
</style>
