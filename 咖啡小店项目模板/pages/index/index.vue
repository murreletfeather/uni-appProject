<template>
	<view class="relative h-screen w-screen overflow-hidden pt-16 pb-26">
		<swiper class="h-full w-full" indicator-color="#D1D5DB" indicator-active-color="#047857" :indicator-dots="true" :duration="500">
			<swiper-item v-for="(item, index) in swipers" :key="index">
				<view class="flex justify-center items-center py-6 px-18">
					<image mode="widthFix" :src="item.cover"></image>
				</view>
				<view class="flex flex-col items-center justify-center py-2 px-7 space-y-5">
					<text class="text-2xl font-bold text-center px-2">{{item.title}}</text>
					<text class="text-sm leading-relaxed text-center text-gray-600">{{item.desc}}</text>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="absolute inset-x-0 bottom-0 flex items-center h-26 px-8">
			<button @click="goto" class="flex items-center justify-center w-full h-14 -mt-2 rounded-full text-base uppercase font-bold" type="default">开启浓香之旅</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swipers: [
					{
						title: "Let's meet our summer coffee drinks",
						cover: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/870dec53-8152-4001-8d70-40f01e4161cf.svg",
						desc: "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					},
					{
						title: "Start your morning with great coffee",
						cover: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/012fac6a-95f1-44dc-8dff-87a796c3818b.svg",
						desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
					},
					{
						title: "Best coffee shop in this town",
						cover: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/4ca0e1c6-9948-4fc0-a9e9-4c18aaa7faa6.svg",
						desc: "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			goto(){
				uni.redirectTo({
					url: '/pages/signin/welcome'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep uni-swiper{
		.uni-swiper-dot{
			width: 20rpx;
			height: 20rpx;
			border-radius: 20rpx;
			transition-property: all;
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			transition-duration: 500ms;
			&.uni-swiper-dot-active{
				width: 50rpx;
			}
		}
	}
</style>
