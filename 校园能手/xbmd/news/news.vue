<template>
	<view>
		<view class="flex bg-white padding-sm solid-bottom" v-for="(res,index) in list" :key="index" @click="detail(res.id)">
			<view class="">
				<image :src="res.title_img ? res.title_img : '../../static/xbmzdx.png'" mode="scaleToFill" style="width: 250rpx;height: 180rpx;border-radius: 15rpx;"></image>
			</view>
			<view class="flex flex-direction justify-between margin-left-sm">
				<view class="" style="font-weight: 700;">
					{{res.title}}
				</view>
				<view class="flex justify-between text-gray">
					<view class="">
						<text class="cuIcon-attention"></text>{{res.read_count}}
					</view>
					<view class="">
						{{res.create_date}}
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="load" />
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				scrollTop: 0,
				load: 'loadmore',
				list:[],
				form:{
					method:'search',
					service:'articleService',
					params:{
						"channelCode":"010107",
						"fields":"id,title_img,url,title,author,read_count,comment_count,release_time",
						"pageNum":1,
						"pageSize":10,
					}
				}
			};
		},
		onLoad(e) {
			this.title=e.title
			this.form.params.channelCode=e.id
			uni.setNavigationBarTitle({
			    title: this.title
			});
			this.getnewslist()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '校园生活-'+this.title,
				path: '/xbmd/news/news?id='+this.form.params.channelCode
			}
		},
		onShareTimeline() {
			return {
				title: '校园生活-'+this.title,
				path: '/xbmd/news/news?id='+this.form.params.channelCode
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			this.list=[]
			this.form.params.pageNum=1
			this.getnewslist()
		},
		onReachBottom() {
			if(this.load=='nomore') return ;
			this.load = 'loading';
			this.form.params.pageNum = ++ this.form.params.pageNum;
			setTimeout(() => {
				this.getnewslist()
			}, 2000)
		},
		methods:{
			getnewslist(){
				uni.showLoading({
				    title: '加载中'
				});
				var that=this
				uniCloud.callFunction({
					name:"news",
					data:{
						funct:"xbmd-news",
						data:that.form
					},
					success(res) {
						that.list=that.list.concat(res.result.datas)
						if(res.result.datas.length<10){
							that.load='nomore'
						}
						uni.stopPullDownRefresh()
						uni.hideLoading();
					}
				}) 
			},
			detail(id){
				uni.navigateTo({
					url:"/xbmd/news/detail?id="+id+"&service="+"articleService"
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
