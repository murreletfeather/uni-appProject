<template>
	<view>
		<uni-list v-if="contList.length">
			<uni-list-item :border="false" v-for="(res,index) in contList" :key="index">
				<view slot="body" class="bg-white padding"
					style="margin: 10rpx 14rpx;width: 100%;border-radius: 18rpx;">
					<view class="flex justify-between align-center ">
						<view class="flex align-center" @click="getuinfo(res.uid[0]._id)">
							<view class="">
								<view class="cu-avatar  round"
									:style="[{ backgroundImage:'url(' + res.uid[0].avatar+ ')' }]"></view>
							</view>
							<view class="margin-left-sm">
								<view class="" style="font-weight: bold;font-size: 24rpx;">
									{{res.uid[0].nickName}}
								</view>
								<view class="" style="font-size: 20rpx;color: #909399;">
									<text
										style="font-size: 24rpx;">{{$u.timeFormat(res.create_date, 'yyyy-mm-dd hh:MM:ss')}}</text>
								</view>
							</view>
						</view>
						<!-- <view class="" @click="share(res)">
							<text class="cuIcon-more"></text>
						</view> -->
					</view>
					<view class="" @click="postdeta(res.cid[0]._id)">
						<view class="padding-top-sm" style="font-size: 26rpx;">
							{{res.cid[0].content}}
						</view>
						<view class="grid col-3 padding-top-sm" v-if="res.cid[0].images.length">
							<view style="padding: 6rpx;" v-for="(item,index) in res.cid[0].images" :key="index">
								<image :src="item.url || item" mode="aspectFill"
									style="width: 100%;height: 200rpx;border-radius: 12rpx;"></image>
							</view>
						</view>
					</view>
					<view class="margin-top flex align-center">
						<view v-if="res.cid[0].avatar && res.cid[0].avatar.length" class="cu-avatar-group">
							<view class="cu-avatar round sm" v-for="(item,index) in res.cid[0].avatar" :key="index"
								:style="[{ backgroundImage:'url(' + item + ')' }]"></view>
						</view>
						<text v-if="res.cid[0].common_num" class="text-gray"
							style="font-size: 24rpx;">已有{{res.cid[0].common_num}}+人评论</text>
					</view>
					<view class="padding-top-sm" v-if="res.cid[0].location">
						<view class="cu-tag sm light bg-grey" style="border-radius: 29rpx;">
							<text class="cuIcon-location"></text> {{res.cid[0].location.name}}
						</view>

					</view>
					<view class="flex justify-between text-gray margin-top-sm">
						<view class="" style="margin-right: 40rpx;">
							<text class="cuIcon-like" style="font-size: 38rpx;"></text>
							{{res.cid[0].collect_num ? res.cid[0].collect_num : ''}}
						</view>
						<view class="" style="margin-right: 40rpx;">
							<text class="cuIcon-mark" style="font-size: 38rpx;"></text>
							{{res.cid[0].common_num ? res.cid[0].common_num : ''}}
						</view>
						<view class="">
							<text class="cuIcon-attention" style="font-size: 38rpx;"></text>
							{{res.cid[0].view ? res.cid[0].view : ''}}
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<uni-load-more :status="load"></uni-load-more>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				contList: [],
				page: 1,
				limit: 20,
				load: 'loading',
				orderby: "create_date desc"
			}
		},
		onLoad() {
			this.getContent()
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.load = "loading";
			this.page=1;
			this.contList=[];
			this.getContent();
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getContent()
			}
		},
		methods: { 
			getContent() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-user-collect-discover,mdsh-discover-content,uni-id-users')
					.where({
						user:db.env.uid
					})
					.field(
						"cid{content,view,common_num,images,avatar,up,down,collect_num,is_top,is_best,create_date,location},uid{nickName,avatar},create_date"
					)
					.orderBy(this.orderby)
					.skip(skip)
					.limit(this.limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.limit) {
							this.load = "noMore"
						} else {
							this.load = "more"
						}
						if (data) {
							this.contList = this.contList.concat(data)
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh()
					})
			},
			postdeta(id) {
				uni.navigateTo({
					url: "/pages/discover/detail/detail?id=" + id
				})
			},
			groupdeta(id, name) {
				uni.navigateTo({
					url: "/pages/discover/group/group?id=" + id + '&name=' + name
				})
			},
		},
	}
</script>

<style>

</style>
