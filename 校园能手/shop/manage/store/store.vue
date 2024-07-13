<template>
	<view class="bg-white padding-sm">
		<view v-if="info">
			<view class="flex  p-xs margin-bottom-sm mb-sm">
				<view class="flex-sub">店名</view>
				<view class="flex-twice">{{info.name}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">起送价</view>
				<view class="flex-twice">{{info.delivery_price}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">简介</view>
				<view class="flex-twice">{{info.dis}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">公告</view>
				<view class="flex-twice">{{info.notice}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">店主</view>
				<view class="flex-twice">{{info.shopkeeper}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">微信</view>
				<view class="flex-twice">{{info.wx}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">手机号</view>
				<view class="flex-twice">{{info.phone}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">地址</view>
				<view class="flex-twice">{{info.address}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">微信二维码</view>
				<view class="flex-twice" @click="chang(1)">
					<image :src="info.wx_code" mode="scaleToFill" style="width: 80rpx;height: 80rpx;"></image>
				</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">店铺logo</view>
				<view class="flex-twice" @click="chang(2)">
					<image :src="info.cover" mode="scaleToFill" style="width: 80rpx;height: 80rpx;"></image>
				</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm margin-top">
				<view class="flex-sub">状态</view>
				<view class="flex-twice">
					<view class='cu-tag radius bg-grey' v-if="info.status==0">关闭</view>
					<view class='cu-tag radius bg-green' v-else-if="info.status==1">营业中</view>
					<view class='cu-tag radius bg-cyan' v-else-if="info.status==2">已打烊</view>
				</view>
			</view>
			<view class="margin-top-xl text-center">
				<button class="cu-btn bg-green round shadow-blur" @click="edit" style="width: 80%;">修改</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'mdsh-store';
	export default {
		data() {
			return {
				info:"",
				id:"",
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad(e) {
			if(this.userinfo.store_id){
				this.id=this.userinfo.store_id
				this.getDetail()
			}else{
				uni.showToast({
					icon:"none",
					title:"未查询到店铺信息"
				})
			}
		},
		onPullDownRefresh() {
			this.getDetail()
		},
		methods: {
			chang(e) {
				var that=this
				uni.chooseImage({
					count: 1,
					success(res) {
						if (res.tempFilePaths.length > 0) {
							 let filePath = res.tempFilePaths[0]
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: 'a.jpg',
								onUploadProgress: function(progressEvent) {
									var percentCompleted = Math.round(
										(progressEvent.loaded * 100) / progressEvent.total
									);
								},
								success(sc) {
									var form
									if(e==1){
										form={
											wx_code:sc.fileID
										}
									}else{
										form={
											cover:sc.fileID
										}
									}
									db.collection(dbCollectionName).where({_id:that.id}).update(form).then((res) => {
										uni.showToast({
											title: '修改成功'
										})
										that.getDetail()
									}).catch((err) => {
										uni.showModal({
											content: err.message || '请求服务失败',
											showCancel: false
										})
									}).finally(() => {
										uni.hideLoading()
									})
								},
								fail() {
									uni.showToast({
										icon:"none",
										title:"上传失败"
									})
								},
								complete() {}
							});
						}
					}
				});
			},
			getDetail() {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(this.id).get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.info = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
					uni.stopPullDownRefresh()
				})
			},
			edit(){
				uni.navigateTo({
					url:"./editor?id="+this.id
				})
			}
		}
	}
</script>
