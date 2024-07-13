<template>
	<view>
		<u-navbar v-if="navbar" :title="uinfo.nickName || userinfo.nickName"></u-navbar>
		<view class="grid col-1" v-if="userinfo._id!=uid">
			<view class="bg-img padding-top-xl flex align-end" style="height: 540upx;background-repeat: no-repeat;"
				:style="[{ backgroundImage:'url(' + uinfo.backgroundImage + ')' }]">
				<view class="bg-shadeBottomb padding padding-top flex-sub">
					<view class="flex justify-between align-center">
						<view class="cu-avatar xl round" style="border: 4rpx solid #FFFFFF;"
							:style="[{ backgroundImage:'url(' + uinfo.avatar+ ')' }]">
							<view class="cu-tag badge"
								:class="uinfo.gender==1?'cuIcon-female bg-pink':'cuIcon-male bg-blue'"></view>
						</view>
						<view class="">
							<button @click="editfriend" class="cu-btn round" :class="friend ? 'bg-blue light' : 'bg-blue'">{{friend ? '已关注' :'关注'}}</button>
						</view>
					</view>
					<view class="margin-top" style="font-size: 34rpx;font-weight: 500;">
						{{uinfo.nickName}}
					</view>
					<view class="margin-top-sm" style="font-size: 24rpx;">
						{{uinfo.introduce ? uinfo.introduce : '暂无个人简介'}}
					</view>
					<view class="margin-top-sm" style="font-size: 24rpx;">
						<!-- <view class="cu-avatar xl round" style="border: 4rpx solid #FFFFFF;" :style="[{ backgroundImage:'url(' + userinfo.avatar+ ')' }]">
						</view> -->
						{{uinfo.school ? uinfo.school : '未绑定学校'}}
					</view>
					<!-- <view class="flex justify-between margin-top">
						<view class="flex flex-sub justify-between">
							<view class="">
								1获赞
							</view>
							<view class="">
								1关注
							</view>
							<view class="">
								1粉丝
							</view>
						</view>
						<view class="flex-sub"></view>
					</view> -->
				</view>
			</view>
		</view>
		<view class="grid col-1" v-else>
			<view class="bg-img padding-top-xl flex align-end" style="height: 540upx;background-repeat: no-repeat;"
				:style="[{ backgroundImage:'url(' + userinfo.backgroundImage + ')' }]">
				<view class="bg-shadeBottomb padding padding-top flex-sub">
					<view class="flex justify-between align-center">
						<view class="cu-avatar xl round" style="border: 4rpx solid #FFFFFF;"
							:style="[{ backgroundImage:'url(' + userinfo.avatar+ ')' }]">
							<view class="cu-tag badge"
								:class="userinfo.gender==1?'cuIcon-female bg-pink':'cuIcon-male bg-blue'"></view>
						</view>
						<view class="" v-if="userinfo._id==uid">
							<button class="cu-btn round" @click="show=true">编辑资料</button>
						</view>
						<view class="" v-else>
							<button class="cu-btn round bg-blue">关 注</button>
						</view>
					</view>
					<view class="margin-top" style="font-size: 34rpx;font-weight: 500;">
						{{userinfo.nickName}}
					</view>
					<view class="margin-top-sm" style="font-size: 24rpx;">
						{{userinfo.introduce ? userinfo.introduce : '暂无个人简介'}}
						<text class="cuIcon-edit margin-left-sm"></text>
					</view>
					<view class="margin-top-sm" style="font-size: 24rpx;">
						<!-- <view class="cu-avatar xl round" style="border: 4rpx solid #FFFFFF;" :style="[{ backgroundImage:'url(' + userinfo.avatar+ ')' }]">
						</view> -->
						{{userinfo.school ? userinfo.school : '请绑定学校'}}
					</view>
					<!-- <view class="flex justify-between margin-top">
						<view class="flex flex-sub justify-between">
							<view class="">
								1获赞
							</view>
							<view class="">
								1关注
							</view>
							<view class="">
								1粉丝
							</view>
						</view>
						<view class="flex-sub"></view>
					</view> -->
				</view>
			</view>
		</view>
		<view class="">
			<!-- #ifdef MP-WEIXIN -->
			<u-sticky :offset-top="88+SystemInfo.statusBarHeight * 2">
				<view class="">
					<u-tabs :list="sxlist" :show-bar="false" :is-scroll="false" :current="sxcurrent" @change="sxchange"
						bar-width="90" active-color="#0081ff"></u-tabs>
				</view>
			</u-sticky>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<u-sticky>
				<view class="">
					<u-tabs :list="sxlist" :show-bar="false" :is-scroll="false" :current="sxcurrent" @change="sxchange"
						bar-width="90" active-color="#0081ff"></u-tabs>
				</view>
			</u-sticky>
			<!-- #endif -->
		</view>
		<view class="">
			<uni-list v-if="sxcurrent==0">
				<uni-list-item :border="false" v-for="(res,index) in contList.list" :key="index">
					<view slot="body" class="bg-white padding"
						style="margin: 10rpx 14rpx;width: 100%;border-radius: 18rpx;">
						<view class="flex justify-between align-center ">
							<view class="flex align-center">
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
							<view v-if="hasLogin && uid==userinfo._id" class="" @click="share(res)">
								<text class="cuIcon-more"></text>
							</view>
						</view>
						<view class="" @click="postdeta(res._id)">
							<view class="padding-top-sm" style="font-size: 26rpx;">
								{{res.content}}
							</view>
							<view class="grid col-3 padding-top-sm" v-if="res.images.length">
								<view style="padding: 6rpx;" v-for="(item,index) in res.images" :key="index">
									<image :src="item.url || item" mode="aspectFill" lazy-load
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
							<view class="cu-tag sm light bg-grey" style="border-radius: 29rpx;">
								<text class="cuIcon-location"></text> {{res.location.name}}
							</view>

						</view>
						<view class="flex justify-between text-gray margin-top-sm">
							<view class="" style="margin-right: 40rpx;">
								<text class="cuIcon-like" style="font-size: 38rpx;"></text>
								{{res.collect_num ? res.collect_num : ''}}
							</view>
							<view class="" style="margin-right: 40rpx;">
								<text class="cuIcon-mark" style="font-size: 38rpx;"></text>
								{{res.common_num ? res.common_num : ''}}
							</view>
							<view class="">
								<text class="cuIcon-attention" style="font-size: 38rpx;"></text>
								{{res.view ? res.view : ''}}
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>

			<uni-list v-if="sxcurrent==1" class="bg-white">
				<uni-list-item :border="false" v-for="(res,index) in disList.list" :key="index">
					<view slot="body" style="width: 100%;" class="padding-sm solid-bottom bg-white">
						<view class="flex justify-between align-center" @click="groupdeta(res._id,res.name)">
							<view class="">
								<view v-if="res.cover" class="cu-avatar radius"
									:style="[{ backgroundImage:'url(' + res.cover+ ')' }]"></view>
								<view v-else class="cu-avatar radius bg-green">{{res.name.slice(0,1)}}</view>
								<text class="margin-left-sm" style="font-size: 26rpx;">#{{res.name}}</text>
							</view>
							<view class="text-gray" style="font-size: 24rpx;">
								<view class="">
									{{res.topic_num}}话题
								</view>
								<view class="">
									{{res.common_num}}评论
								</view>
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<uni-load-more :status="sxcurrent==0 ? contList.load : disList.load"></uni-load-more>
		</view>

		<template v-if="uinfo==''">
			<u-action-sheet :list="list" v-model="show" @click="click"></u-action-sheet>
		</template>

		<u-action-sheet safe-area-inset-bottom :list="actionlist" v-model="actionshow" @click="actionclick"></u-action-sheet>
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database()
	import auth from "@/components/auth.vue"
	export default {
		components: {
			auth
		},
		data() {
			return {
				actionlist: [
				{
					text: '删除' ,
					color: 'red',
					fontSize: 28
				}],
				actionshow: false,
				actioninfoi:'',
				friend: '',
				uid: '',
				SystemInfo: '',
				navbar: false,
				top: 320,
				uinfo: '',
				show: false,
				list: [{
					text: '修改背景'
				}, {
					text: '编辑资料'
				}],
				sxlist: [{
					name: '帖子'
				}, {
					name: '话题'
				}],
				sxcurrent: 0,
				contList: {
					page: 1,
					limit: 10,
					list: [],
					load: 'loading',
				},
				disList: {
					page: 1,
					limit: 10,
					list: [],
					load: 'loading',
				}
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onShow() {
			
		},
		onLoad(e) {
			this.SystemInfo = uni.getSystemInfoSync();
			
			if (e.uid) {
				this.uid = e.uid
				this.getuserinfouid()
				if (this.userinfo && this.uid!=this.userinfo._id) {
					this.getfriendinfo()
				}
			} else {
				this.uid = this.userinfo._id
			}
			if (this.uid) {
				this.getContent()
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 95) {
				this.navbar = true
				this.top = 320 + 88 + (this.SystemInfo.statusBarHeight * 2)
			} else {
				this.top = 320
				this.navbar = false
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			if (this.sxcurrent == 0) {
				this.contList.list = [];
				this.contList.page = 1;
				this.contList.load = "loading";
				this.getContent()
			} else {
				this.disList.list = [];
				this.disList.page = 1;
				this.disList.load = "loading";
				this.getDiscover()()
			}
		},
		onReachBottom() {
			if (this.sxcurrent == 0) {
				if (this.contList.load != "noMore") {
					this.contList.load = "loading";
					this.contList.page++
					this.getContent()
				}
			} else {
				if (this.disList.load != "noMore") {
					this.disList.load = "loading";
					this.disList.page++
					this.getDiscover()
				}
			}
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/setinfo'
			}),
			sxchange(index) {
				this.sxcurrent = index;
				if (this.uid) {
					if (index == 0) {
						if (this.contList.list.length < 1) {
							this.getContent()
						}
					} else {
						if (this.disList.list.length < 1) {
							this.getDiscover()
						}
					}
				}
			},
			getContent() {
				let skip = (this.contList.page - 1) * this.contList.limit;
				db.collection('mdsh-discover-content,uni-id-users,mdsh-school,mdsh-discover')
					.where({
						status: true,
						'uid._id': this.uid
					})
					.field(
						"content,view,common_num,images,avatar,up,down,collect_num,is_top,is_best,create_date,uid{nickName,avatar},cid{name,cover},school_id{logo,college_name},location"
					)
					.orderBy('create_date desc')
					.skip(skip)
					.limit(this.contList.limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.contList.limit) {
							this.contList.load = "noMore"
						} else {
							this.contList.load = "more"
						}
						if (data) {
							this.contList.list = this.contList.list.concat(data)
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.stopPullDownRefresh()
					})
			},
			getDiscover() {
				let skip = (this.disList.page - 1) * this.disList.limit;
				db.collection('mdsh-discover')
					.where({
						status: true,
						uid: this.uid
					})
					.field(
						"cover,name,topic_num,common_num"
					)
					.orderBy('common_num desc,topic_num desc')
					.skip(skip)
					.limit(this.disList.limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.disList.limit) {
							this.disList.load = "noMore"
						} else {
							this.disList.load = "more"
						}
						if (data) {
							this.disList.list = this.disList.list.concat(data)
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.stopPullDownRefresh()
					})
			},
			click(index) {
				if (index == 0) {
					var that = this;
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
									success(suc) {
										uni.showLoading({
											title: "图片检测中"
										})
										var images = [];
										images.push(suc.fileID);
										uniCloud.callFunction({
											name: "discover",
											data: {
												funct: "imgSecCheckRes",
												imgs: images
											}
										}).then((resb) => {
											uni.hideLoading()
											if (resb.result.data.length == 1) {
												db.collection('uni-id-users')
													.where('_id==$env.uid')
													.update({
														backgroundImage: resb.result.data[0]
													}).then((res) => {
														uni.showToast({
															icon: "success",
															title: "修改成功",
															success() {
																that.setUserInfo({
																	backgroundImage: resb.result.data[0]
																});
															}
														})
													}).catch((err) => {
														uni.showModal({
															content: err.message ||
																'请求服务失败',
															showCancel: false
														})
													}).finally(() => {

													})
											} else {
												uni.showModal({
													content: resb.result.message ||
														'图片检测到异常',
													showCancel: false
												})
											}
										}).catch((err) => {
											uni.showModal({
												content: err.message || '请求服务失败',
												showCancel: false
											})
										})
									},
									fail(err) {
										uni.showModal({
											content: err.message || '上传失败',
											showCancel: false
										})
									},
									complete() {}
								})
							}
						}
					})
				} else {
					uni.navigateTo({
						url: "../editor/editor"
					})
				}
			},
			getuserinfo() {
				var that = this
				uniCloud.callFunction({
					name: "login-by-weixin",
					data: {
						funct: "getuserinfotoken",
						token: uni.getStorageSync('uni_id_token')
					},
					success(res) {
						if (res.result.code == -2) {
							uni.showToast({
								icon: "none",
								title: res.result.message
							})
							that.login()
						} else {
							uni.setStorageSync('userinfo', res.result.userInfo)
							that.userinfo = res.result.userInfo
						}
					}
				})
			},
			editfriend() {
				if (this.userinfo) {
					if (this.friend) {
						db.action("add-friend")
						.collection('mdsh-friend')
						.where({
							uid: this.userinfo._id,
							friend_id: this.uinfo._id
						})
						.remove()
						this.getfriendinfo()
					} else {
						db.action("add-friend")
						.collection('mdsh-friend')
						.add({
							friend_id: this.uinfo._id
						})
						this.getfriendinfo()
					}
				} else {
					this.login()
				}
			},
			getuserinfouid() {
				var that = this
				uniCloud.callFunction({
					name: "login-by-weixin",
					data: {
						funct: "getuserinfouid",
						uid: that.uid
					},
					success(res) {
						if (res.result.code == -2) {
							uni.showToast({
								icon: "none",
								title: res.result.message
							})
						} else {
							that.uinfo = res.result.userInfo
						}
					}
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
			getfriendinfo() {
				db.collection('mdsh-friend')
				.where({
					uid: this.userinfo._id,
					friend_id: this.uinfo._id
				})
				.get({
					getOne: true
				}).then((res) => {
					const data = res.result.data
					if(data){
						this.friend = data
					}else{
						this.friend = ''
					}
				}).catch((err) => {
					// uni.showModal({
					// 	content: err.message || '请求服务失败',
					// 	showCancel: false
					// })
				}).finally(() => {

				})
			},
			login() {
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
			},
			actionclick(e){
				var that=this;
				if(that.hasLogin && that.userinfo._id==that.uid){
					uni.showModal({
					    title: '',
					    content: '确认要删除吗',
					    success: function (res) {
					        if (res.confirm) { 
					            db.collection("mdsh-discover-content")
					              .where({
					                _id: that.actioninfoi._id,
									uid:db.env.uid
					              })
					              .remove()
					                .then((res) => {
					                    uni.showToast({
					                        title: '删除成功'
					                    })
										that.contList.load = "loading";
										that.contList.page=1
										that.contList.list=[]
										that.getContent()
					                }).catch((err) => {
					                    uni.showModal({
					                        content: err.message || '删除失败',
					                        showCancel: false
					                    })
					                }).finally(() => {
					            
					                })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					uni.showToast({
						icon:"none",
						title:"无权操作"
					})
				}
			},
			share(e){
				this.actioninfoi=e
				this.actionshow=true
			}
		}
	}
</script>

<style>

</style>
