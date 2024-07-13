<template>
	<view class="bg-white padding">
		<view class="">
			<u-parse :html="info.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:'',
				method:'detail',
				service:'articleService',
				id:''
			};
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.info.title+'-民大生活',
				path: '/xbmd/news/detail?id='+this.id+'&service='+this.service
			}
		},
		onShareTimeline() {
			return {
				title: this.info.title+'-民大生活',
				path: '/xbmd/news/detail?id='+this.id+'&service='+this.service
			}
		},
		onLoad(e) {
			this.id=e.id
			this.service=e.service
			this.getnewsdet()
		},
		methods:{
			getnewsdet(){
				uni.showLoading({
				    title: '加载中'
				});
				var that=this
				uniCloud.callFunction({
					name:"news",
					data:{
						funct:"xbmd-news-detail",
						method:that.method,
						service:that.service,
						id:that.id
					},
					success(res) {
						that.info=res.result.data
						uni.hideLoading();
					}
				}) 
			},
		}
	}
</script>

<style lang="scss">

</style>
