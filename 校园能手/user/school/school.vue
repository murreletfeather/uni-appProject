<template>
	<view>
		<view class="cu-bar bg-white search fixed">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入学校名称" v-model="schoolName" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round" @click="search">搜索</button>
			</view>
		</view>
		<view class="" style="margin-top: 84rpx;">
			<unicloud-db ref="udbSchool" v-slot:default="{data,pagination, loading, error, options}" field="tag,college_name,location,logo,school_type"
				collection="mdsh-school" :where="sWhere"
				orderby="sort desc,create_date desc" page-data="add" :page-size="20" loadtime="manual" @load="handleLoad">
				<uni-list >
				    <uni-list-item :border="true" v-for="(res,index) in data" :key="index" class="bg-white padding-sm">
						<view slot="body" class="flex bg-white" style="width: 100%;" @click="save(res)">
							<view class="">
								<image :src="res.logo" mode="aspectFit" style="width: 100rpx;height: 100rpx;"></image>
							</view>
							<view class="margin-left-sm">
								<view class="" style="font-size: 32rpx;">
									{{res.college_name}}
								</view>
								<view class="" v-if="res.tag.length">
									<view class='cu-tag round text-blue line-blue sm' v-for="(tag,indext) in res.tag">{{tag}}</view>
								</view>
								<view class="" style="font-size: 26rpx;color: #C0C0C0;">
									{{res.location}}
									<text>{{res.school_type}}</text>
								</view>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				
			</unicloud-db>
		</view>
		 <uni-load-more :status="load"></uni-load-more>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
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
				back:false,
				scrollTop: 0,
				load: 'more',
				schoolName:"",
				sWhere:"status=="+true,
				form:{
					school_id:'',
					school:''
				}
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onReady() {
			uni.showLoading({
				title: '加载中'
			});
			this.$refs.udbSchool.loadData()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.$refs.udbSchool.loadData({
				clear: true
			}, () => {
				uni.hideLoading();
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if(this.load!="noMore"){
				this.load="loading"
			}
			this.$refs.udbSchool.loadMore()
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/setinfo'
			}),
			handleLoad(data, ended, pagination){
				if(ended){
					this.load="noMore"
				}else{
					this.load="more"
				}
				uni.hideLoading();
			},
			search(){
				if(this.schoolName){
					this.sWhere="status=="+true+"&&"+`${new RegExp(this.schoolName, 'i')}.test(college_name)`
				}else{
					this.sWhere="status=="+true
				}
				uni.startPullDownRefresh();
			},
			getuserinfo(){
				var that=this
				uniCloud.callFunction({
					name:"login-by-weixin",
					data:{
						funct:"getuserinfotoken",
						token:uni.getStorageSync('uni_id_token')
					},
					success(res) {
						if(res.result.code==-2){
							
						}else{
							uni.setStorageSync('userinfo',res.result.userInfo)
						}
					}
				}) 
			},
			save(e){
				var that=this
				that.form.school_id=e._id
				that.form.school=e.college_name
				uniCloud.callFunction({
					name:"login-by-weixin",
					data:{
						funct:"user-update",
						form:that.form,
						token:uni.getStorageSync('uni_id_token')
					},
					success(res) {
						if(res.result.code==-2){
							uni.showToast({
								icon:"none",
								title:res.result.message
							})
						}else{
							that.setUserInfo(that.form)
							uni.showToast({
								icon:"success",
								title:res.result.message
							})
							setTimeout(() => {
								uni.navigateBack({
									delta:1
								})
							}, 2000)
						}
					}
				}) 
			}
		}
	}
</script>

<style>
.uni-list-item__container{
	padding: 12rpx 30rpx;
}
</style>
