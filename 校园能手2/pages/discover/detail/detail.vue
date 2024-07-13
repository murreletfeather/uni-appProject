<template>
	<view>
		<view class="" v-if="coninfo">
			<view class="padding bg-white solid-top">
				<view class="">
					<view class="flex justify-between">
						<view class="flex align-center" @click="getuinfo(coninfo.uid[0]._id)">
							<view class="">
								<view class="cu-avatar round shadow-warp"
									:style="[{ backgroundImage:'url(' + coninfo.uid[0].avatar+ ')' }]"></view>
							</view>
							<view class="margin-left-sm" style="line-height: 40rpx;">
								<view class="" style="font-size: 34rpx;font-weight: 600;">
									{{coninfo.uid[0].nickName}}
									<view v-if="coninfo.school_id.length" class="cu-avatar sm round shadow-warp"
										:style="[{ backgroundImage:'url(' + coninfo.school_id[0].logo+ ')' }]"></view>
									<!-- #ifdef MP-WEIXIN -->
									<view class="cu-avatar sm bg-white margin-left"
										:class="res.user_type==1 ? 'weixin' : 'qq'"></view>
									<!-- #endif -->
								</view>
								<view class="text-gray">
									<text
										style="font-size: 24rpx;">{{$u.timeFormat(coninfo.create_date, 'yyyy-mm-dd hh:MM:ss')}}</text>
									<text class="cuIcon-attention margin-left"></text>{{coninfo.view}}
								</view>
							</view>
						</view>
						<view class="text-gray" v-if="coninfo.uid[0].type==2 && SystemInfo=='qq'">
							<button class="cu-btn round cuIcon-add sm" @addfriend="addfriend" open-type="addFriend"
								:open-id="coninfo.uid[0]['qq_openid']['mp-qq']">加好友</button>
						</view>
					</view>
					<view class="">
						<view class="" style="font-size: 26rpx;margin: 10rpx 0;">
							{{coninfo.content}}
						</view>
						<view class="grid col-3 padding-top-sm" v-if="coninfo.images.length">
							<view style="padding: 6rpx;" v-for="(item,index) in getimgli" :key="index">
								<image :src="item" mode="aspectFill"
									style="width: 100%;height: 200rpx;border-radius: 12rpx;" @click="lookimg"></image>
							</view>
						</view>
					</view>
					<view class="flex justify-between text-gray margin-top-sm">
						<view class="flex">
							<!-- <view class="" style="margin-right: 40rpx;">
								<text class="cuIcon-like" style="font-size: 38rpx;"></text>
								{{coninfo.collect_num}}
							</view> -->
							<view class="" style="margin-right: 40rpx;">
								<text class="cuIcon-mark" style="font-size: 38rpx;"></text>
								{{coninfo.common_num}}
							</view>
							<view class="" v-if="hasLogin && userinfo._id!=coninfo.uid[0]._id">
								<text @click="Collection"
									:class="iscoll ? 'cuIcon-favorfill text-green' : 'cuIcon-favor'"
									style="font-size: 38rpx;"></text>
							</view>
						</view>
						<view class="">
							<button class="cu-btn round bg-white" :share-mode="shareMode" open-type="share">
								<text class="cuIcon-forward" style="font-size: 38rpx;"></text>
							</button>
						</view>
					</view>
					<view class="" v-if="coninfo.location">
						<view class="cu-tag sm light bg-grey" style="border-radius: 29rpx;">
							<text class="cuIcon-location"></text> {{coninfo.location.name}}
						</view>

					</view>
				</view>
			</view>

			<view class="bg-white padding margin-top-sm" v-if="coninfo.cid[0]">
				<view class="flex justify-between align-center">
					<view class="flex align-center">
						<view class="">
							<view v-if="coninfo.cid[0].cover" class="cu-avatar lg radius shadow-warp"
								:style="[{ backgroundImage:'url(' + coninfo.cid[0].cover+ ')' }]"></view>
							<view v-else class="cu-avatar lg radius shadow-warp bg-green">
								{{coninfo.cid[0].name.slice(0,1)}}</view>
						</view>
						<view class="margin-left-sm" style="line-height: 40rpx;">
							<view class="" style="font-size: 32rpx;font-weight: 600;">
								#{{coninfo.cid[0].name}}
							</view>
							<view class="text-gray">
								{{coninfo.cid[0].topic_num}}人参与
							</view>
						</view>
					</view>
					<view class="text-gray">
						<button class="cu-btn round line-blue" @click="group(coninfo.cid[0]._id,coninfo.cid[0].name)">
							进入
						</button>
					</view>
				</view>
			</view>


			<template v-if="!coninfo.cid[0] || coninfo.cid[0].is_comment">
				<view class="flex justify-between padding bg-white margin-top-sm">
					<view class="">
						评论
					</view>
					<view class="flex">
						<view class="">
							<button class="cu-btn round sm" @click="shanxuan('create_date')"
								:class="clidgi == 'create_date' ? 'bg-blue' : ''">最新</button>
						</view>
						<view class="margin-left-sm">
							<button class="cu-btn round sm" @click="shanxuan('up')"
								:class="clidgi == 'up' ? 'bg-blue' : ''">最热</button>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar comment solids-top bg-white" style="margin-bottom: 100rpx;"
					v-if="comlist.length">
					<view class="cu-item" v-for="(res,index) in comlist" :key="index">
						<view class="cu-avatar round" :style="[{ backgroundImage:'url(' + res.avatar+ ')' }]" @click="getuinfo(res.uid)">
						</view>

						<view class="content">
							<view class="flex justify-between">
								<view class="text-gray" style="font-size: 26rpx;" @click="getuinfo(res.uid)">{{res.nickName}}</view>
								<view class="">
										<text class="cuIcon-appreciate text-blue" @click="comup(res,index)">{{res.up}}</text>
									</view>
							</view>
							<view class="text-content text-df">
								{{res.content}}
							</view>
							<view class="box-bg padding-sm radius margin-top-sm  text-sm" v-if="res.children.length>0">
								<view class="flex" v-for="(resb,indexb) in res.children" :key=indexb>
									<view class="text-blue" @click="getuinfo(resb.uid)">{{resb.nickName}}：</view>
									<view class="flex-sub">{{resb.content}}</view>
								</view>
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">
									{{$u.timeFormat(coninfo.create_date, 'yyyy-mm-dd hh:MM:ss')}}
								</view>
								<view>
									<text class="cu-tag radius" style="font-size: 24rpx;" @click="reply(res)">回复</text>
								</view>
							</view>
						</view>
					</view>
					<uni-load-more :status="load" :iconSize="20"></uni-load-more>

				</view>
				<view class="bg-white" v-else>
					<u-empty text="暂无评论" mode="message"></u-empty>
				</view>

				<view class="cu-bar foot input">
					<input class="item-bg" adjust-position :focus="focus" maxlength="100" cursor-spacing="10"
						type="text" style="border-radius: 60rpx;" :placeholder="placeholder" :disabled="disabled"
						v-model="common" @focus="InputFocus" @blur="InputBlur"></input>
					<button class="cu-btn item-bgr" style="border-radius: 30rpx;" @click="savecommon">
						评论
					</button>
				</view>
			</template>
		</view>

		<auth ref="auth"></auth>

	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database()
	const dbCmd = db.command;
	import auth from "@/components/auth.vue"
	export default {
		components: {
			auth
		},
		data() {
			return {
				iscoll: false,
				clidgi: "create_date",
				commonWhere: "status==" + true,
				load: 'more',
				InputBottom: 0,
				placeholder: '留下你的评论',
				disabled: true,
				focus: false,
				coninfo: '',
				id: '',
				common: '',
				comlist: [],
				page: 1,
				orderby: 'create_date desc',
				limit: 10,
				pid: '',
				SystemInfo: '',
				shareMode: ['qq', 'qzone', 'quickToDialog', 'wechatFriends', 'wechatMoment', 'recentContacts'],
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			}),
			getimgli(){
				var arr=[];
				this.coninfo.images.forEach((img, index) => {
					arr.push(img.url)
				})
				return arr;
			}
		},
		onShow() {
			this.SystemInfo = uni.getStorageSync("mpinfo")
			if (this.userinfo) {
				this.disabled = false
			}
		},
		onLoad(e) {
			this.id = e.id
			if (this.id) {
				this.commonWhere = this.commonWhere + "&&cid=='" + this.id + "'"
				uni.showLoading({
					title: '加载中'
				});
				this.getcontent()
			}
			//#ifdef MP-QQ
			uni.getSetting({
				success(res) {
					if (!res.authSetting['setting.addFriend']) {
						uni.authorize({
							scope: "setting.addFriend",
							success(e) {
								console.log(e)
							},
							fail(e) {
								console.log(e)
							}
						})
					}
				},
				complete(e) {
					console.log(e)
				}
			})
			//#endif
			// uni.getSavedFileList({
			// 	success: function(res) {
			// 		console.log(res.fileList);
			// 	}
			// });
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.coninfo.content,
				path: '/pages/discover/detail/detail?id=' + this.id
			}
		},
		onShareTimeline() {
			return {
				title: this.coninfo.content,
				path: '/pages/discover/detail/detail?id=' + this.id
			}
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getCommon()
			}
		},
		methods: {
			handleLoad(data, ended, pagination) {
				if (ended) {
					this.load = "noMore"
				} else {
					this.load = "more"
				}
			},
			InputFocus(e) {
				if (!this.hasLogin) {
					this.login()
				} else {
					this.InputBottom = e.detail.height
				}
			},
			InputBlur(e) {
				this.InputBottom = 0
				this.placeholder = '留下你的评论'
				// this.pid = ''
				this.focus = false
			},
			savecommon() {
				if (!this.hasLogin) {
					this.login()
					return
				}
				if (this.common.length < 2) {
					uni.showToast({
						icon: "none",
						title: "评论内容不能少于2个字符"
					})
				} else {
					this.settempst()
				}
			},
			shanxuan(e) {
				this.orderby = '' + e + ' desc'
				this.page = 1;
				this.load = "loading"
				this.clidgi = e;
				this.comlist = [];
				this.getCommon()
			},
			Collection() {
				if (this.hasLogin) {
					if (this.iscoll == true) {
						db.collection("mdsh-user-collect-discover")
							.where({
								cid: this.coninfo._id,
								uid: db.env.uid
							}).remove()
							.then((res) => {
								this.iscoll = false
							})
							.catch((err) => {
								uni.showModal({
									content: err.message || '操作失败',
									showCancel: false
								})
							})
							.finally(() => {

							})
					} else {
						db.action("user-collect-discover-add")
							.collection("mdsh-user-collect-discover")
							.add({
								cid: this.coninfo._id,
								uid: db.env.uid
							})
							.then((res) => {
								this.iscoll = true
							})
							.catch((err) => {
								uni.showModal({
									content: err.message || '操作失败',
									showCancel: false
								})
							})
							.finally(() => {

							})
					}
				} else {
					this.login()
				}
			},
			addfriend(e) {
				uni.authorize({
					scope: "setting.addFriend",
					success(res) {
						console.log(res)
					}
				})
			},
			reply(res) {
				this.placeholder = '回复：' + res.nickName
				this.pid = res._id
				this.focus = true
			},
			getcontent() {
				db.action("discover-content-detail")
					.collection('mdsh-discover-content,uni-id-users,mdsh-discover,mdsh-school')
					.where({
						_id: this.id,
						status: true
					})
					.field(
						"collect_num,content,create_date,down,images,is_best,is_report,is_top,up,view,uid{nickName,avatar,type,qq_openid},common_num,cid{name,cover,is_comment,is_anonymous,topic_num},school_id{logo,college_name},location"
					)
					.get({
						getOne: true
					})
					.then(res => {
						this.coninfo = res.result.data
						if(this.hasLogin && this.coninfo.uid[0]._id!=this.userinfo._id){
							this.getUserCollection()
						}
						this.getCommon()
					}).catch(err => {
						console.log(err)
						uni.showToast({
							icon: "none",
							title: "内容不存在"
						})
					})
				uni.hideLoading()
			},
			getCommon() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-discover-comment')
					.where({
						status: true,
						cid: this.coninfo._id
					})
					.orderBy(this.orderby)
					.skip(skip)
					.limit(this.limit)
					.get({
						getTree: {
							limitLevel: 10
						}
					}).then((res) => {
						const data = res.result.data
						if (data.length < this.limit) {
							this.load = "noMore"
						} else {
							this.load = "more"
						}
						if (data) {
							this.comlist = this.comlist.concat(data)
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
			getUserCollection() {
				db.collection("mdsh-user-collect-discover")
					.where({
						cid: this.coninfo._id,
						uid: db.env.uid,
					}).get()
					.then((res) => {
						if (res.result.data.length) {
							this.iscoll = true
						} else {
							this.iscoll = false
						}
					})
					.catch((err) => {

					})
					.finally(() => {

					})
			},
			addcom() {
				uni.showLoading({
					title: "内容检测中"
				})
				db.action("discover-common-add")
					.collection("mdsh-discover-comment")
					.add({
						cid: this.id,
						content: this.common,
						pid: this.pid,
						nickName: this.userinfo.nickName,
						avatar: this.userinfo.avatar
					})
					.then((res) => {
						uni.hideLoading()
						this.common = ''
						this.pid = ''
						this.focus = false
						this.placeholder = '留下你的评论'
						this.load = "loading"
						this.page = 1;
						this.comlist = []
						this.coninfo.common_num++
						this.getCommon()
						uni.showToast({
							title: '评论成功'
						})
					})
					.catch((err) => {
						uni.showModal({
							content: err.message || '评论失败',
							showCancel: false
						})
					})
					.finally(() => {
						uni.hideLoading()
					})
			},
			group(id, name) {
				uni.navigateTo({
					url: "/pages/discover/group/group?id=" + id + '&name=' + name
				})
			},
			lookimg() {
				uni.previewImage({
					urls: this.getimgli,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							// console.log(err.errMsg);
						}
					}
				});
			},
			comup(res,index){
				if(this.hasLogin){
					this.comlist[index].up++
					uniCloud.callFunction({
						name:"discover",
						data:{
							funct:'comup',
							id:res._id
						}
					})
				}else{
					this.login()
				}
			},
			settempst() {
				//#ifdef MP-WEIXIN
				var that = this;
				uni.requestSubscribeMessage({
					tmplIds: ['vsH964PBVRMKjIA5YaWen8O3t7ti4-N7rSP6kKrt4hI'],
					complete(res) {
						that.addcom()()
					}
				})
				//#endif	
				//#ifndef MP-WEIXIN
				this.addcom()
				//#endif
			},
			login() {
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url: "/pages/login/login"
				})
				//#endif
			},
			getuinfo(uid) {
				uni.navigateTo({
					url: "/user/info/info?uid=" + uid
				})
			},
			authSuccess() {

			}
		}
	}
</script>

<style lang="scss">

</style>
