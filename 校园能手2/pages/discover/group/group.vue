<template>
	<view class="">
		<u-navbar v-if="navbar" :title="title"></u-navbar>
		<template v-if="Discover">
			<view v-if="Discover.backgroundImage" @click="updateGroup('backgroundImage')"
				style="height: 580rpx;background-repeat: no-repeat;background-size: 100% 100%;"
				:style="[{ backgroundImage:'url(' + Discover.backgroundImage+ ')' }]"></view>
			<view v-else @click="updateGroup('backgroundImage')"
				style="height: 580rpx;background-image: linear-gradient(to left, #00cdac 0%, #8ddad5 100%);">
			</view>
			<view class="" style="position: absolute;width: 100%;" :style="[{top:top+'rpx'}]">
				<view class="flex flex-wrap align-center padding-sm">
					<view class="basis-xl flex">
						<view class="" @click="updateGroup('cover')">
							<view v-if="Discover.cover" class="cu-avatar xl radius"
								:style="[{ backgroundImage:'url(' + Discover.cover+ ')' }]"></view>
							<view v-else class="cu-avatar xl radius bg-green">{{Discover.name.slice(0,1)}}</view>
						</view>
						<view class="text-white" style="line-height: 66rpx;">
							<view class="margin-left-sm" style="font-weight: 700;font-size: 34rpx;">
								#{{Discover.name}}#
							</view>
							<view class="">
								<view class="cu-avatar-group">
									<view class="cu-avatar round sm" v-for="(item,index) in avatar" :key="index"
										:style="[{ backgroundImage:'url(' + avatar[index] + ')' }]"></view>
								</view>
								<text style="font-size: 24rpx;">5.2万人在这里</text>
							</view>
						</view>
					</view>
					<view class="text-center" style="width: 20%;">
						<button class="cu-btn round bg-blue" @click="release(Discover.name)">发布</button>
					</view>
				</view>

				<view class="bg-white padding-sm radis-img" style="margin: 0 15rpx;margin-bottom: 15rpx;">
					<view class="padding-top-sm padding-bottom-sm solid-bottom margin-bottom-sm"
						style="font-weight: 700;font-size: 34rpx;" v-if="userinfo">
						Hi,{{userinfo.nickName}}
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view class="" @click="modalName='bottomModal'">
						<u-read-more ref="uReadMore" font-size='26' :toggle="true" show-height="220" :shadow-style="shadowStyle">
							<u-parse font-size="26" :html="Discover.description" @load="parseLoaded"></u-parse>
						</u-read-more>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-QQ -->
					<view class="" @click="modalName='bottomModal'">
						<u-read-more ref="uReadMore" font-size="26" :toggle="true" show-height="220" :shadow-style="shadowStyle">
							<u-parse font-size="26" :html="Discover.description" @load="parseLoaded"></u-parse>
						</u-read-more>
					</view>
					<!-- #endif -->
				</view>

				<!-- #ifdef MP-WEIXIN -->
				<u-sticky :offset-top="88+SystemInfo.statusBarHeight * 2">
					<view class="">
						<u-tabs :list="sxlist" :is-scroll="false" :current="sxcurrent" @change="sxchange" bar-width="90"
							active-color="#0081ff"></u-tabs>
					</view>
				</u-sticky>
				<!-- #endif -->
				<!-- #ifdef MP-QQ -->
				<view class="">
					<u-tabs :list="sxlist" :is-scroll="false" :current="sxcurrent" @change="sxchange" bar-width="90"
						active-color="#0081ff"></u-tabs>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<u-sticky>
					<view class="">
						<u-tabs :list="sxlist" :is-scroll="false" :current="sxcurrent" @change="sxchange" bar-width="90"
							active-color="#0081ff"></u-tabs>
					</view>
				</u-sticky>
				<!-- #endif -->
				<uni-list>
					<uni-list-item :border="false" v-for="(res,index) in contList[sxcurrent].list" :key="index">
						<view slot="body" class="bg-white padding"
							style="margin: 10rpx 14rpx;width: 100%;border-radius: 18rpx;">
							<view class="flex justify-between align-center ">
								<view class="flex align-center"  @click="getuinfo(res.uid[0]._id)">
									<view class="">
										<view class="cu-avatar  round"
											:style="[{ backgroundImage:'url(' + res.uid[0].avatar+ ')' }]"></view>
									</view>
									<view class="margin-left-sm">
										<view class="" style="font-weight: bold;font-size: 24rpx;">
											{{res.uid[0].nickName}}
											<view v-if="res.school_id.length" class="cu-avatar sm round shadow-warp"
												:style="[{ backgroundImage:'url(' + res.school_id[0].logo+ ')' }]">
											</view>
										</view>
										<view class="" style="font-size: 20rpx;color: #909399;">
											<text
												style="font-size: 24rpx;">{{$u.timeFormat(res.create_date, 'yyyy-mm-dd hh:MM:ss')}}</text>
										</view>
									</view>
								</view>
								<view class="" @click="share(res)">
									<text class="cuIcon-more"></text>
								</view>
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
							<view class="margin-top flex align-center" v-if="res.avatar && res.avatar.length">
								<view class="cu-avatar-group" style="padding: 0 10rpx 0 16rpx;">
									<view class="cu-avatar round sm" v-for="(item,index) in res.avatar" :key="index"
										:style="[{ backgroundImage:'url(' + item + ')' }]"></view>
								</view>
								<text class="text-gray" style="font-size: 24rpx;">已有{{res.common_num}}+人评论</text>
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
				</uni-list>
				<uni-load-more :status="contList[sxcurrent].load"></uni-load-more>
			</view>
		</template>

		<view class="cu-modal" :class="userinfo._id==Discover.uid && modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改简介</view>
				</view>
				<view class="padding-sm">
					<uni-easyinput type="textarea" trim="all" autoHeight v-model="Discover.description" placeholder="请输入内容"></uni-easyinput>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green"  @tap="modalName = null">取消</button>
						<button class="cu-btn bg-green margin-left"  @click="updateDis({'description':Discover.description})">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
		<u-action-sheet safe-area-inset-bottom :list="actionlist" v-model="actionshow" @click="actionclick" @close="actionclose" :mask-close-able="false"></u-action-sheet>
		<auth ref="auth"></auth>
	</view>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import {
		aui
	} from '@/common/aui/js/aui.js';
	import auth from "@/components/auth.vue"
	
	const db = uniCloud.database()
	export default {
		components: {
			auth
		},
		data() {
			return {
				actionlist: [],
				actionshow: false,
				SystemInfo: '',
				modalName:'',
				contList: [{
					page: 1,
					limit: 20,
					list: [],
					load: 'loading',
					orderby: "create_date desc"
				}, {
					page: 1,
					limit: 20,
					list: [],
					load: 'loading',
					orderby: "is_top desc,is_best desc,view desc,create_date desc"
				}],
				back:false,
				top: 320,
				current: 0,
				Discover: '',
				page: 1,
				limit: 20,
				id: '',
				title: '',
				load: 'loading',
				scrollTop: 0,
				navbar: false,
				sharetitle: "校园能手",
				sharepath: "",
				avatar: [],
				shadowStyle: {
					backgroundImage: "none"
				},
				sxlist: [{
					name: '最新发布'
				}, {
					name: '热门动态'
				}],
				sxcurrent: 0
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onShow() {
			if(this.back){
				uni.startPullDownRefresh();
				this.back=false
			}
		},
		onLoad(e) {
			this.SystemInfo = uni.getSystemInfoSync();
			this.id = e.id
			this.title = e.name
			this.sharepath = "/pages/discover/group/group?id=" + this.id
			this.sharetitle = this.title + "-校园能手"
			if (this.id) {
				uni.showLoading({
					title: '加载中'
				});
				this.getDiscover()
			}
			if(this.hasLogin && this.userinfo.is_manage){
				this.actionlist=[
					{
						text: '分享',
						type:'button'
					}, {
						text: '举报' ,
						color: 'red'
					},
					{
						text: '删除' ,
						color: 'red',
						fontSize: 28,
						subText: '管理员操作'
					}
				]
			}else{
				this.actionlist=[
					{
						text: '分享',
						type:'button'
					}, {
						text: '举报' ,
						color: 'red'
					}
				]
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
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			this.contList[this.sxcurrent].page = 1;
			this.contList[this.sxcurrent].list = [];
			this.contList[this.sxcurrent].load = "loading";
			this.getContent()
		},
		onReachBottom() {
			if (this.contList[this.sxcurrent].load != "noMore") {
				this.contList[this.sxcurrent].load = "loading"
				this.contList[this.sxcurrent].page++
				this.getContent()
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.sharetitle,
				path: this.sharepath
			}
		},
		methods: {
			sxchange(index) {
				this.sxcurrent = index;
				if (this.contList[index].list.length == 0) {
					this.getContent()
				}
			},
			parseLoaded() {
				this.$refs.uReadMore.init();
			},
			updateGroup(e) {
				if (this.userinfo && this.userinfo._id == this.Discover.uid) {
					var that=this;
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
											title:"图片检测中"
										})
										var images=[];
										images.push(suc.fileID);
										uniCloud.callFunction({
											name: "discover",
											data: {
												funct: "imgSecCheckRes",
												imgs:images
											}
										}).then((resb) => {
											uni.hideLoading()
											if(resb.result.data.length==1){
												if(e=="cover"){
													that.updateDis({cover:resb.result.data[0]})
												}else{
													that.updateDis({backgroundImage:resb.result.data[0]})
												}
											}else{
												uni.showModal({
													content: resb.result.message || '图片检测到异常',
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
				}
			},
			updateDis(value){
				db.collection('mdsh-discover')
				.where({
					status: true,
					_id: this.id
				})
				.update(value).then((res) => {
					uni.showToast({
						icon:"success",
						title:"修改成功"
					})
					this.getDiscover()
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					this.modalName = null
				})
			},
			getDiscover() {
				db.collection('mdsh-discover')
					.where({
						status: true,
						_id: this.id
					})
					.get({
						getOne: true
					}).then((res) => {
						const data = res.result.data
						if (data) {
							this.Discover = data
							this.getContent()
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {

					})
			},
			getContent() {
				let skip = (this.contList[this.sxcurrent].page - 1) * this.contList[this.sxcurrent].limit;
				db.collection('mdsh-discover-content,uni-id-users,mdsh-school')
					.where({
						status: true,
						cid: this.id
					})
					.field(
						"content,view,common_num,images,avatar,up,down,collect_num,is_top,is_best,create_date,uid{nickName,avatar},cid{name,cover},school_id{logo,college_name},location"
					)
					.orderBy(this.contList[this.sxcurrent].orderby)
					.skip(skip)
					.limit(this.contList[this.sxcurrent].limit)
					.get().then((res) => {
						const data = res.result.data
						if (data.length < this.contList[this.sxcurrent].limit) {
							this.contList[this.sxcurrent].load = "noMore"
						} else {
							this.contList[this.sxcurrent].load = "more"
						}
						uni.hideLoading();
						uni.stopPullDownRefresh()
						this.contList[this.sxcurrent].list = this.contList[this.sxcurrent].list.concat(data)
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
			share(res){
				this.actionshow=true
				this.shareInfo=res
				this.sharetitle=res.content
				this.sharepath='/pages/discover/detail/detail?id='+res._id
			},
			actionclose(){
				this.sharepath = "/pages/discover/group/group?id=" + this.id
				this.sharetitle = this.title + "-校园能手"
			},
			actionclick(e){
				switch(e){
					case 0:
					
					break;
					case 1:
					if(this.hasLogin){
						
					}else{
						this.login()
					}
					break;
					case 2:
					if(this.hasLogin && this.userinfo.is_manage){
						this.admindel()
					}else{
						uni.showToast({
							icon:"none",
							title:"无权操作"
						})
					}
					break;
				}
			},
			admindel(){
				var that=this;
				uni.showModal({
				    title: '',
				    content: '确认要删除吗',
				    success: function (res) {
				        if (res.confirm) { 
				            db.collection("mdsh-discover-content")
				              .where({
				                _id: that.shareInfo._id
				              })
				              .remove()
				                .then((res) => {
				                    uni.showToast({
				                        title: '删除成功'
				                    })
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
			},
			actionmenuCallback(e) {
				var _this = this;
				if (e.index == 0) {
					this.sharepath = "/pages/discover/group/group?id=" + this.id
					this.sharetitle = this.title + "-校园能手"
				}
			},
			getuinfo(uid){
				uni.navigateTo({
					url:"/user/info/info?uid="+uid
				})
			},
			postdeta(id) {
				uni.navigateTo({
					url: "/pages/discover/detail/detail?id=" + id
				})
			},
			release(e){
				if(this.hasLogin){
					uni.navigateTo({
						url:"/pages/discover/release/release?discover="+e
					})
				}else{
					this.login()
				}
			},
			login(){
				//#ifdef MP
				this.$refs.auth.showpop();
				//#endif
				//#ifndef MP
				uni.navigateTo({
					url:"/pages/login/login"
				})
				//#endif
			},
			authSuccess(){
				// this.userinfo=uni.getStorageSync('userinfo')
			},
		}
	}
</script>

<style>

</style>
