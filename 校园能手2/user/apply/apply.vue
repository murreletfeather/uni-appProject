<template>
	<view>
		<template v-if="userinfo.is_assist">
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
		</template>
		<template v-else>
			<view class="grid bg-white margin-sm text-center col-4" style="border-radius: 15rpx;">
				<view class="padding-sm" @click="toform()">
					<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/16df238f-9607-409e-9ff5-bdd6a2a39373.png" mode="scaleToFill" style="width: 70rpx;height: 70rpx;"></image>
					<view class="">
						成为业务员
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				appWhere: "status==" + true+"&&"+"from=="+2+"&&cate=='60d1aad15c448400014fbc3e'",
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			
		},
		onReady() {
			if(this.userinfo.is_assist){
				this.$refs.udbApply.loadData()
			}else{
				
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			if(this.userinfo.is_assist){
				this.$refs.udbApply.loadData({
					clear: true
				}, () => {
					
				})
			}
			uni.hideLoading();
			uni.stopPullDownRefresh()
		},
		methods: {
			toform(){
				// #ifdef MP-QQ
				uni.showToast({
					icon:"none",
					title:"暂不支持"
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url:"/user/form/form?type=1"
				})
				// #endif
				
			},
			detail(e){
				if(e.type==1){//不处理
					
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
