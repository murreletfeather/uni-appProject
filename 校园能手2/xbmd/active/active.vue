<template>
	<view>
		<view class="bg-white padding-sm solid-bottom" v-for="(res,index) in list" :key="index" @click="detail(res)">
			<view class="">
				<image :src="res.title_img ? res.title_img : '../../../static/xbmzdx.png'" mode="scaleToFill" style="height: 370rpx;border-radius: 15rpx;width: 100%;"></image>
			</view>
			<view class="">
				<view class="" style="font-weight: 700;">
					{{res.name}}
				</view>
				<view class="">
					主办单位：{{res.undertake ? res.undertake : res.sponsor}}
				</view>
				
				<view class="">
					开始报名：{{res.signup_begin_time}}
				</view>
				<view class="">
					截至报名：{{res.signup_end_time}}
				</view>
				<view class="flex justify-between text-gray">
					<view class="">
						报名：{{res.singup_count}}
					</view>
					<view class="">
						<text class="cuIcon-attention"></text>{{res.read_count}}
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
				page:1
			};
		},
		onLoad(e) {
			this.title=e.title
			this.getnewslist()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			this.list=[]
			this.page=1
			this.getnewslist()
		},
		onReachBottom() {
			if(this.load=='nomore') return ;
			this.load = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getnewslist()
			}, 2000)
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '校园生活-当前活动',
				path: '/xbmd/active/active?id='
			}
		},
		onShareTimeline() {
			return {
				title: '校园生活-当前活动',
				path: '/xbmd/active/active?id='
			}
		},
		methods:{
			getnewslist(){
				this.form.params.pageNum=this.page
				this.$u.api.xbmznewlist(this.form).then(res => {
					this.list=this.list.concat(res)
					if(res.length<10){
						this.load='nomore'
					}
					uni.stopPullDownRefresh()
				})
			},
			getnewslist(){
				uni.showLoading({
				    title: '加载中'
				});
				var that=this
				uniCloud.callFunction({
					name:"news",
					data:{
						funct:"xbmd-active",
						page:that.page
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
			detail(res){
				uni.showToast({
					icon:"success",
					title:"打开民大青年app查看详情"
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
