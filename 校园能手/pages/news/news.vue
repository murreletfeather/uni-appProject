<template>
	<view class="bg-white">
		<view class="padding-sm">
			<u-parse :html="info.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:9,
				info:''
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.info.name+'-校园能手',
				path: '/pages/news/news?id='+this.id
			}
		},
		onShareTimeline() {
			return {
				title: this.info.name+'-校园能手',
				path: '/pages/news/news?id='+this.id
			}
		},
		onLoad(e) {
			this.id=e.id
			if(this.id){
				this.getnewsinfo()
			}
		},
		methods: {
			getnewsinfo(){
				uni.showLoading({
				    title: '加载中'
				});
				var that=this
				uniCloud.callFunction({
					name:"news",
					data:{
						funct:"news-detail",
						id:that.id
					},
					success(res) {
						that.info=res.result[0]
						uni.setNavigationBarTitle({
						    title: that.info.name
						});
						uni.hideLoading();
					}
				})
			},
		}
	}
</script>

<style>

</style>
