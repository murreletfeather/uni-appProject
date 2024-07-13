<template>
	<view>
		<unicloud-db ref="udbApply" v-slot:default="{data, loading, error, options}" collection="mdsh-apply"
			:where="appWhere" loadtime="manual" orderby="sort desc">
			<view class="padding bg-white radis-img " style="margin: 15rpx;" v-if="data.length">
				<view class=" flex text-center bg-white flex-wrap">
					<view class="padding-sm" style="width: 25%;" v-for="(res,index) in data" :key="index" @click="detail(res)">
						<image :src="res.cover" mode="scaleToFill" style="width: 80upx;height: 80upx;"></image>
						<view class="">
							{{res.name}}
						</view>
					</view>
				</view>
			</view>
		</unicloud-db>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo:'',
				appWhere: "status==" + true+"&&"+"from=="+2+"&&cate=='60dd6de7827eca000178be5c'",
			}
		},
		onLoad() {
			this.userinfo=uni.getStorageSync('userinfo')
		},
		onReady() {
			this.$refs.udbApply.loadData()
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.$refs.udbApply.loadData({
				clear: true
			}, () => {
				uni.hideLoading();
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			detail(e){
				if(e.type==1){//不处理
					// uni.showToast({
					// 	icon:'none',
					// 	title:"开发中..."
					// })
				}else if(e.type==2){//应用内
					uni.navigateTo({
						url:e.url+'&title='+e.name,
						success: res => {},fail: () => {},complete: () => {}
					})
				}else if(e.type==3){//链接
					uni.navigateTo({
						url:"../apply/web?url="+e.url
					})
				}else if(e.type==4){//小程序
					uni.navigateToMiniProgram({
					  appId: e.appid,
					  path: e.url,
					  extraData: e.extraData,
					  success(res) {
					    // 打开成功
					  }
					})
				}
			},
		}
	}
</script>

<style>

</style>
