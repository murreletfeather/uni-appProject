<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-green':''" v-for="(item,index) in tab"
					:key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</view>
		</scroll-view>
		<view class="text-center margin-top" v-if="TabCur==0">
			<image :src="info.img_url" mode="aspectFit"></image>

			<button class="cu-btn round bg-green margin-top-xl" @click="saveimg">保存图片</button>
		</view>

		<view class="text-center margin-top" v-if="TabCur==1">
			<video :src="info.video_url" controls style="width: 100%;height: 500rpx;"></video>

			<button class="cu-btn round bg-green margin-top-xl" @click="savevideo">保存视频</button>
			<button class="cu-btn round bg-grey margin-top-xl margin-left"
				@click="setclip(info.video_url)">复制视频链接</button>
		</view>

		<view class="text-center margin-top" v-if="TabCur==2">
			<view class="padding bg-white radius">
				{{info.desc}}
			</view>
			<button class="cu-btn round bg-green margin-top-xl" @click="setclip(info.desc)">复制文案</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:"",
				tab: ['图片', '视频', '文案'],
				TabCur: 1,
				scrollLeft: 0,
				info: {
					"md5": "",
					"message": "",
					"user_name": "",
					"user_head_img": "",
					"desc": "",
					"img_url": "",
					"video_url": "",
					"type": "video"
				},
			}
		},
		onLoad(e) {
			this.url=e.url
			if(this.url){
				this.getres()
			}
		},
		methods: {
			getres(){
				var that=this
				uniCloud.callFunction({
					name:"system-config",
					data:{
						funct:"jiexi",
						token:uni.getStorageSync('uni_id_token'),
						url:that.url
					},
					success(res) {
						if(res.result.status){
							that.info=res.result.data
						}else{
							uni.showToast({
								icon: "none",
								title: "解析失败"
							})
						}
					}
				})
			},
			savevideo() {
				var that = this;
				uni.downloadFile({
					url: that.info.video_url, //文件路径
					success: (res) => {
						const {
							statusCode,
							tempFilePath
						} = res
						if (res.statusCode === 200) {
							uni.saveVideoToPhotosAlbum({
								filePath: tempFilePath,
								success: function() {
									uni.showToast({
										icon: "success",
										title: "保存成功"
									})
								},
								fail() {
									uni.showToast({
										icon: "none",
										title: "保存失败"
									})
								},
								complete: (errMsg) => {
									console.log(errMsg)
								}
							});
						}
					}
				});
			},
			saveimg() {
				var that = this;
				uni.downloadFile({
					url: that.info.img_url, //文件路径
					success: (res) => {
						const {
							statusCode,
							tempFilePath
						} = res
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: tempFilePath,
								success: function() {
									uni.showToast({
										icon: "success",
										title: "保存成功"
									})
								},
								fail() {
									uni.showToast({
										icon: "none",
										title: "保存失败"
									})
								},
								complete: (errMsg) => {
									console.log(errMsg)
								}
							});
						}
					}
				});
			},
			setclip(data) {
				var that = this;
				uni.setClipboardData({
					data: data,
					success: function() {
						uni.showToast({
							icon: "success",
							title: "已复制到剪切板"
						})
					},
					fail() {
						uni.showToast({
							icon: "none",
							title: "复制失败"
						})
					}
				});
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}
		}
	}
</script>

<style>

</style>
