<template>
	<view>
		<view class="text-center bg-white padding">
			<u-avatar :src="userinfo.avatar" mode="circle" show-level level-icon="edit-pen-fill" @click="editorat"></u-avatar>
			<view class="margin-top">
				<view class='cu-tag round'>{{userinfo._id}}</view>
			</view>
		</view>
		
		<view class="margin-top-sm">
			<view class="cu-list menu sm-border">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">昵称</text>
						<text @click="editor('nickName')" class="margin-left">{{userinfo.nickName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">签名</text>
						<text @click="editor('introduce')" class="margin-left">{{userinfo.introduce || '编辑签名'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">性别</text>
						<text class="margin-left">{{userinfo.gender==1? '男' : '女'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">生日</text>
						<text class="margin-left" @click="show=true">{{$u.timeFormat(userinfo.birthday, 'yyyy年mm月dd日')}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="margin-top-sm">
			<view class="cu-list menu sm-border">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">学校</text>
						<text class="margin-left" @click="editschoole">{{userinfo.school ? userinfo.school : '绑定学校'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">城市</text>
						<text class="margin-left" @click="region=true">{{userinfo.province ? userinfo.province+'-'+userinfo.city+'-'+userinfo.area : '请选择'}}</text>
					</view>
				</view>
			</view>
		</view>
		<u-picker v-model="show" mode="time" @confirm="confirmssr"></u-picker>
		<u-picker mode="region" v-model="region" @confirm="confirmsdq"></u-picker>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database()
	export default {
		data() {
			return {
				show:false,
				region:false,
			}
		},
		onShow() {
			console.log(this.userinfo);
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/setinfo'
			}),
			confirmssr(e){
				this.setupdate({birthday:e.timestamp})
			},
			confirmsdq(e){
				var form={
					country:'中国',
					province:e.province.label,
					area:e.area.label,
					city:e.city.label
				}
				this.setupdate(form)
			},
			editschoole(){
				uni.navigateTo({
					url:"/user/school/school"
				})
			},
			editorat(){
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
											that.setupdate({avatar:resb.result.data[0]})
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
							uni.showToast({
								icon:"none",
								title:res.result.message
							})
							that.login()
						}else{
							that.setUserInfo(res.result.userInfo)
						}
					}
				}) 
			},
			setupdate(value){
				var that=this;
				db.collection('uni-id-users')
				.where('_id==$env.uid')
				.update(value).then((res) => {
					uni.showToast({
						icon:"success",
						title:"修改成功",
						success() {
							that.setUserInfo(value)
						}
					})
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					
				})
			},
			editor(e){
				uni.navigateTo({
					url:"./input"
				})
			}
		}
	}
</script>

<style>

</style>
