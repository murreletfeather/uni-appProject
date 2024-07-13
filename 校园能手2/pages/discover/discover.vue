<template>
	<view>
		<u-navbar :is-back="false" :border-bottom="false">
			<view class="slot-wrap" @click="search" style="width: 100%;">
				<u-search disabled placeholder="请输入搜索内容" v-model="keyword" :show-action="false" style="width: 100%;"></u-search>
			</view>
		</u-navbar>
		<view v-if="sgloading" class="u-skeleton padding-sm">
			<view class="bg-white margin-top-sm" v-for="(res,index) in 4" :key="index">
				<view class="flex align-center">
					<view class="u-skeleton-circle cu-avatar round"></view>
					<view class="u-skeleton-fillet margin-left-sm" style="width: 100%;height: 50rpx;"></view>
				</view>
				<view class="grid col-1 margin-top-sm">
					<view class="u-skeleton-fillet" style="width: 100%;height: 200rpx;">
						
					</view>
				</view>
				<view class="u-skeleton-fillet margin-top-sm" style="width: 100%;height: 50rpx;"></view>
			</view>
		</view>
		<view v-else>
			<!-- 广告 -->
				<view class="padding bg-white" v-if="bannerList.length">
					<uni-swiper-dot :info="bannerList" :current="current" field="content" mode="default">
					    <swiper @change="change" autoplay interval="3000" circular>
					        <swiper-item v-for="(item ,index) in bannerList" :key="index">
					            <view @click="advDetail(item)">
					                <image :src="item.cover" mode="scaleToFill" style="width: 100%;height: 350rpx;"></image>
					            </view>
					        </swiper-item>
					    </swiper>
					</uni-swiper-dot>
				</view>
			<!-- 广告结束 -->
			<!-- <unicloud-db ref="udbDiscover" v-slot:default="{data, loading, error, options}"
				collection="mdsh-discover" orderby="topic_num desc,sort desc" :where="disvoverWhere" loadtime="manual" :page-size="4" field="name,cover,description">
				<view class="bg-white" v-if="data.length">
					<view class="padding flex justify-between">
						<view class="">
							<text class="cuIcon-hotfill text-red"></text>
							<text class="item-title">热门圈子</text>
						</view>
						<view class="text-gray text-sm" @click="moredis">
							更多<text class="cuIcon-right"></text>
						</view>
					</view>
					
					<view class="flex flex-wrap bg-white align-center" style="margin: 0 6rpx;">
						<view class="flex shadow-warp" style="width: 46%;margin: 15rpx;padding: 8rpx;border-radius: 10rpx;" v-for="(res,index) in data" :key="index" @click="groupdeta(res._id,res.name)">
							<view class="">
								<image :src="res.cover" mode="scaleToFill" style="width: 120rpx;height: 120rpx;" class="radis-img"></image>
							</view>
							<view class="margin-left-sm" style="width: 100%;">
								<view class="" style="font-weight: 600;">
									{{res.name}}
								</view>
								<view class="u-line-2" style="font-size: 24rpx;">
									{{res.description}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</unicloud-db> -->
			
			<!-- #ifdef MP-WEIXIN -->
			<u-sticky :offset-top="88+SystemInfo.statusBarHeight * 2">
				<view class="">
					<u-tabs :list="sxlist" :is-scroll="false" :current="sxcurrent" @change="sxchange" bar-width="90" active-color="#0081ff"></u-tabs>
				</view>
			</u-sticky>
			<!-- #endif -->
			<!-- #ifdef MP-QQ -->
			<view class="">
				<u-tabs :list="sxlist" :is-scroll="false" :current="sxcurrent" @change="sxchange" bar-width="90" active-color="#0081ff"></u-tabs>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<u-sticky>
				<view class="">
					<u-tabs :list="sxlist" :is-scroll="false" :current="sxcurrent" @change="sxchange" bar-width="90" active-color="#0081ff"></u-tabs>
				</view>
			</u-sticky>
			<!-- #endif -->
			<uni-list>
				<uni-list-item :border="false" v-for="(res,index) in contList[sxcurrent].list" :key="index">
					<view slot="body" class="bg-white padding" style="margin: 10rpx 14rpx;width: 100%;border-radius: 18rpx;">
						<view class="flex justify-between align-center ">
							<view class="flex align-center" @click="getuinfo(res.uid[0]._id)">
								<view class="">
									<view class="cu-avatar  round"
										:style="[{ backgroundImage:'url(' + res.uid[0].avatar+ ')' }]"></view>
								</view>
								<view class="margin-left-sm">
									<view class="" style="font-weight: bold;font-size: 24rpx;">
										{{res.uid[0].nickName}}
										<view v-if="res.school_id.length" class="cu-avatar sm round shadow-warp" :style="[{ backgroundImage:'url(' + res.school_id[0].logo+ ')' }]"></view>
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
									<image :src="item.url || item" mode="aspectFill" style="width: 100%;height: 200rpx;border-radius: 12rpx;"></image>
								</view>
							</view>
						</view>
						<view class="margin-top flex align-center">
							<button @click="groupdeta(res.cid[0]._id,res.cid[0].name)" v-if="res.cid[0]" class="cu-btn round bg-blue padding sm light">
								#{{res.cid[0].name}}
							</button>
							<view v-if="res.avatar && res.avatar.length" class="cu-avatar-group">
								<view class="cu-avatar round sm" v-for="(item,index) in res.avatar" :key="index"
									:style="[{ backgroundImage:'url(' + item + ')' }]"></view>
							</view>
							<text v-if="res.common_num" class="text-gray" style="font-size: 24rpx;">已有{{res.common_num}}+人评论</text>
						</view>
						<view class="padding-top-sm" v-if="res.location">
							<view class="cu-tag sm light bg-cyan" style="border-radius: 29rpx;">
							<text class="cuIcon-location"></text>	{{res.location.name}}
							</view>
							
						</view>
						<view class="flex justify-between text-gray margin-top-sm text-xl">
							<view class="" style="margin-right: 40rpx;">
								<text class="cuIcon-like" ></text>
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
		
		<auth ref="auth"></auth>
		<schoolPopup :show="showschool" @cschool="cschool"></schoolPopup>
		<!-- <u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top> -->
		<u-action-sheet :list="sheetlist" v-model="sheetshow" @click="sheetclick"></u-action-sheet>
		<uni-fab :pattern="pattern" @fabClick="release" horizontal="right"></uni-fab>
			<u-skeleton :loading="sgloading" :animation="true" bgColor="#FFF"></u-skeleton>
			<u-action-sheet safe-area-inset-bottom :list="actionlist" v-model="actionshow" @click="actionclick" @close="actionclose" :mask-close-able="false"></u-action-sheet>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import auth from "@/components/auth.vue"
	import schoolPopup from "@/components/school-popup.vue"
	import {aui} from '@/common/aui/js/aui.js';
	const db = uniCloud.database()
	const dbCmd = db.command;
	export default {
		components: {
			auth,schoolPopup
		},
		data() {
			return {
				actionlist: [],
				actionshow: false,
				pattern: {
					buttonColor: "#00bc8e"
				},
				SystemInfo:'',
				contList: [
					{
						page:1,
						limit: 20,
						list:[],
						load: 'loading',
						orderby:"create_date desc"
					},{
						page:1,
						limit: 20,
						list:[],
						load: 'loading',
						orderby:"is_top desc,is_best desc,view desc,create_date desc"
					}
				],
				page: 1,
				limit: 20,
				sgloading:true,
				bannerList:[],
				contentWhere:"",
				ty_contentWhere:"status==" + true,
				current: 0,
				load: 'loading',
				showschool:false,
				subindex:0,
				sublist:['最新','热门'],
				orderby:"create_date desc",
				chaschool:{
					college_name:"全部",
					logo:""
				},
				shareInfo:'',
				deleteid:'',
				sheetshow:false,
				sheetlist: [{
					text: '隐藏'
				}, {
					color: 'red',
					text: '删除' 
				}],
				scrollTop: 0,
				
				keyword:'',
				back:false,
				shareMode:['qq', 'qzone', 'quickToDialog','wechatFriends','wechatMoment','recentContacts'],
				sharetitle:'校园圈子，交友，闲置，爱好，拼车...',
				sharepath:'/pages/discover/discover?id=',
				id:0,
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
			this.SystemInfo=uni.getSystemInfoSync();
			this.getbanner()
			this.getContent()
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
		onReady() {
			
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.sharetitle,
				path: this.sharepath
			}
		},
		onShareTimeline() {
			return {
				title: this.sharetitle,
				path: this.path
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.getbanner()
			this.contList[this.sxcurrent].page=1;
			this.contList[this.sxcurrent].list=[];
			this.contList[this.sxcurrent].load="loading";
			this.getContent()
		},
		onReachBottom() {
			if (this.contList[this.sxcurrent].load != "noMore") {
				this.contList[this.sxcurrent].load = "loading"
				this.contList[this.sxcurrent].page++
				this.getContent()
			}
		},
		methods:{
			sxchange(index) {
				this.sxcurrent = index;
				if(this.contList[index].list.length==0){
					this.getContent()
				}
			},
			getbanner(){
				if(this.hasLogin && this.userinfo.school_id){
					db.collection('mdsh-advertisement').where(
						dbCmd.and([{
								cate: 4
							},
							{
								status: true
							},
							dbCmd.or([{
									school_id: this.userinfo.school_id
								},
								{
									is_currency: true
								}
							])
						], )
					).orderBy("sort desc").get().then((res) => {
						var data = res.result.data
						this.bannerList=data
						this.sgloading=false
					}).catch((err) => {
						this.sgloading=false
					})
				}else{
					db.collection('mdsh-advertisement').where({
						status: true,
						cate: 1,
						is_currency: true
					}).orderBy("sort desc").get().then((res) => {
						var data = res.result.data
						this.bannerList=data
						this.sgloading=false
					}).catch((err) => {
						this.sgloading=false
					})
				}
			},
			getContent() {
				let skip = (this.contList[this.sxcurrent].page - 1) * this.contList[this.sxcurrent].limit;
				db.collection('mdsh-discover-content,uni-id-users,mdsh-school,mdsh-discover')
					.where({
						status: true
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
						if (data) {
							this.contList[this.sxcurrent].list = this.contList[this.sxcurrent].list.concat(data)
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
			actionmenuCallback(e) {
				var _this = this;
				if(e.index==0){
					this.sharepath="/pages/discover/discover?id="
					this.sharetitle="校园圈子，交友，闲置，爱好，拼车..."
				}
			},
			change(e) {
				this.current = e.detail.current;
			},
			share(res){
				this.actionshow=true
				this.shareInfo=res
				this.sharetitle=res.content
				this.sharepath='/pages/discover/detail/detail?id='+res._id
			},
			actionclose(){
				this.sharepath="/pages/discover/discover?id="
				this.sharetitle="校园圈子，交友，闲置，爱好，拼车..."
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
			search(){
				uni.navigateTo({
					url:"/pages/discover/search/search"
				})
			},
			release(){
				if(this.hasLogin){
					uni.navigateTo({
						url:"/pages/discover/release/release"
					})
				}else{
					this.login()
				}
			},
			postdeta(id){
				uni.navigateTo({
					url:"/pages/discover/detail/detail?id="+id
				})
			},
			groupdeta(id,name){
				uni.navigateTo({
					url:"/pages/discover/group/group?id="+id+'&name='+name
				})
			},
			getuinfo(uid){
				uni.navigateTo({
					url:"/user/info/info?uid="+uid
				})
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
			delt(id){
				this.sheetshow=true;
				this.deleteid=id
			},
			moredis(){
				uni.navigateTo({
					url:"/pages/discover/list/list"
				})
			},
			sheetclick(e){
				
			},
			subcheck(index){
				this.subindex=index
				switch(index){
					case 0:
						this.orderby="create_date desc"
					break;
					case 1:
						this.orderby="is_top desc,is_best desc,view desc,create_date desc"
					break;
				}
				this.load="loading"
				uni.showLoading({
					title: '加载中'
				});
				this.page=1;
				this.contList=[];
				this.getContent()
			},
			cschool(res){
				this.contentWhere=""
				this.showschool=false
				this.contentWhere=this.ty_contentWhere+"&&school_id=='" + res._id + "'"
				this.chaschool=res
				uni.startPullDownRefresh();
			},
			clearschool(){
				this.chaschool.logo=""
				this.chaschool.college_name="全部"
				this.contentWhere=""
				this.contentWhere="status==" + true,
				uni.startPullDownRefresh();
			},
			advDetail(e){
				if(e.type==1){//不处理
					
				}else if(e.type==2){//应用内
					uni.navigateTo({
						url:e.url+'&title='+e.name,
						success: res => {},fail: () => {},complete: () => {}
					})
				}else if(e.type==3){//链接
					uni.navigateTo({
						url:"/pages/apply/web?url="+e.url
					})
				}else if(e.type==4){//小程序
					
				}
			},
		}
	}
</script>

<style lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30upx;
	}
</style>
