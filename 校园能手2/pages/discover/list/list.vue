<template>
	<view>
		<view class="" style="margin: 0 6rpx;">
			<unicloud-db ref="udbDiscover" v-slot:default="{data, loading, error, options}"
				collection="mdsh-discover" orderby="sort desc" :where="disvoverWhere" loadtime="manual" :page-size="10" page-data="add" field="name,cover,description,topic_num,common_num" @load="handleLoad">
				<uni-list>
				    <uni-list-item :border="false" v-for="(res,index) in data" :key="index" class="margin-top-xs bg-white radis-img padding-sm">
						<view slot="body" class="flex" @click="circledet(res._id,res.name)">
							<view v-if="res.cover" class="cu-avatar lg radius shadow-warp"
								:style="[{ backgroundImage:'url(' + res.cover+ ')' }]"></view>
							<view v-else class="cu-avatar lg radius shadow-warp bg-green">{{res.name.slice(0,1)}}</view>
							<view class="margin-left-sm" style="">
								<view class="" style="font-weight: 600;">
									{{res.name}}
								</view>
								<view class="u-line-2" style="font-size: 24rpx;">
									{{res.description}}
								</view>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<uni-load-more :status="load"></uni-load-more>
			</unicloud-db>
		</view>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill" ></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				disvoverWhere:"status==" + true,
				scrollTop: 0,
				load: 'more'
			}
		},
		onReady() {
			uni.showLoading({
				title: '加载中'
			});
			this.$refs.udbDiscover.loadData()
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.$refs.udbDiscover.loadData({clear: true})
		},
		onReachBottom() {
			if(this.load!="noMore"){
				this.load="loading"
			}
			this.$refs.udbDiscover.loadMore()
		},
		methods: {
			handleLoad(data, ended, pagination){
				if(ended){
					this.load="noMore"
				}else{
					this.load="more"
				}
				uni.hideLoading();
				uni.stopPullDownRefresh()
			},
			circledet(id,name){console.log(id);
				uni.navigateTo({
					url:"/pages/discover/group/group?id="+id+'&name='+name
				})
			},
		}
	}
</script>

<style>

</style>
