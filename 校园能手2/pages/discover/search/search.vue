<template>
	<view>
		<u-navbar :border-bottom="false">
			<view class="slot-wrap" style="width: 100%;">
				<u-search focus clearabled v-model="searchText" @search="confirm" @custom="confirm"></u-search>
			</view>
		</u-navbar>

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
									<view v-if="res.school_id.length" class="cu-avatar sm round shadow-warp"
										:style="[{ backgroundImage:'url(' + res.school_id[0].logo+ ')' }]"></view>
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
					<view class="" @click="postdeta(res._id)">
						<view class="padding-top-sm" style="font-size: 26rpx;">
							{{res.content}}
						</view>
						<view class="grid col-3 padding-top-sm" v-if="res.images.length">
							<view style="padding: 6rpx;" v-for="(item,index) in res.images" :key="index">
								<image :src="item.url || item" mode="aspectFill"
									style="width: 100%;height: 200rpx;border-radius: 12rpx;"></image>
							</view>
						</view>
					</view>
					<view class="margin-top flex align-center">
						<button @click="groupdeta(res.cid[0]._id,res.cid[0].name)" v-if="res.cid[0]"
							class="cu-btn round bg-blue padding sm light">
							#{{res.cid[0].name}}
						</button>
						<view v-if="res.avatar && res.avatar.length" class="cu-avatar-group">
							<view class="cu-avatar round sm" v-for="(item,index) in res.avatar" :key="index"
								:style="[{ backgroundImage:'url(' + item + ')' }]"></view>
						</view>
						<text v-if="res.common_num" class="text-gray"
							style="font-size: 24rpx;">已有{{res.common_num}}+人评论</text>
					</view>
					<view class="padding-top-sm" v-if="res.location">
						<view class="cu-tag sm light bg-cyan" style="border-radius: 29rpx;">
							<text class="cuIcon-location"></text> {{res.location.name}}
						</view>

					</view>
					<view class="flex justify-between text-gray margin-top-sm text-xl">
						<view class="" style="margin-right: 40rpx;">
							<text class="cuIcon-like"></text>
							{{res.collect_num ? res.collect_num : ''}}
						</view>
						<view class="" style="margin-right: 40rpx;">
							<text class="cuIcon-mark"></text>
							{{res.common_num ? res.common_num : ''}}
						</view>
						<view class="">
							<text class="cuIcon-attention"></text>
							{{res.view ? res.view : ''}}
						</view>
					</view>
				</view>
			</uni-list-item>
			<uni-load-more :status="load"></uni-load-more>
		</uni-list>
		<u-empty v-if="nolist" text="暂无相关内容" mode="search"></u-empty>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				searchText: '',
				contList: [],
				page: 1,
				limit: 20,
				load: 'loading',
				orderby: "create_date desc",
				nolist:false
			}
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getContent()
			}
		},
		methods: {
			confirm() {
				this.contList = [];
				this.page = 1;
				this.limit20;
				this.load = "loading";
				if (this.searchText) {
					uni.showLoading({
						title: '搜索中'
					});
					this.getContent()
				} else {
					uni.showToast({
						icon: "none",
						title: "请输入搜索内容"
					})
				}
			},
			getContent() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-discover-content,uni-id-users,mdsh-school,mdsh-discover')
					.where({
						status: true,
						content: new RegExp(this.searchText)
					})
					.field(
						"content,view,common_num,images,avatar,up,down,collect_num,is_top,is_best,create_date,uid{nickName,avatar},cid{name,cover},school_id{logo,college_name},location"
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
						this.contList = this.contList.concat(data)
						if (this.contList.length>0) {
							this.nolist=false
						}else{
							this.nolist=true
						}
						uni.hideLoading();
						uni.stopPullDownRefresh()
					}).catch((err) => {
						uni.hideLoading();
						uni.stopPullDownRefresh()
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
