<template>
	<view>
		<view class="padding">
			<uni-easyinput trim maxlength="10" v-model="form.nickName" placeholder="请输入昵称"></uni-easyinput>
			<view class="margin-top text-gray" style="font-size: 26rpx;">
				昵称最多10个汉字/20个字母
			</view>
		</view>
		
		<view class="padding">
			<uni-easyinput type="textarea" v-model="form.introduce" autoHeight trim maxlength="50" placeholder="请输入签名"></uni-easyinput>
			<view class="margin-top text-gray" style="font-size: 26rpx;">
				个人签名最长可以输入50个汉字/100个字母
			</view>
		</view>
		
		<view class="text-center margin-top-xl">
			<button class="cu-btn bg-blue round" style="width: 80%;" @click="updateinfo">保存</button>
		</view>
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
				form:{
					nickName:'',
					introduce:''
				}
			}
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad(e) {
			this.form.nickName=this.userinfo.nickName
			this.form.introduce=this.userinfo.introduce
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/setinfo'
			}),
			updateinfo(){
				if(!this.form.nickName){
					uni.showToast({
						icon:"none",
						title:'昵称不能为空'
					})
				}else if(!this.form.introduce){
					uni.showToast({
						icon:"none",
						title:'签名不能为空'
					})
				}else{
					var that=this;
					uniCloud.callFunction({
						name: "discover",
						data: {
							funct: "textSecCheckRes",
							content: that.form.nickName
						}
					}).then((res) => {
						if(res.result.code==-2){
							return uni.showModal({
								content: "昵称有违规内容，请修改",
								showCancel: false
							})
						}else{
							uniCloud.callFunction({
								name: "discover",
								data: {
									funct: "textSecCheckRes",
									content: that.form.introduce
								}
							}).then((resb) => {
								if(resb.result.code==-2){
									return uni.showModal({
										content: "签名有违规内容请修改",
										showCancel: false
									})
								}else{
									db.collection('uni-id-users')
									.where({
										_id:that.userinfo._id
									})
									.update(that.form).then((res) => {
										uni.showToast({
											icon:"success",
											title:"修改成功",
											success() {
												that.setUserInfo(that.form)
											}
										})
									}).catch((err) => {
										uni.showModal({
											content: err.message || '请求服务失败',
											showCancel: false
										})
									}).finally(() => {
										
									})
								}
							}).catch((err) => {
								uni.showModal({
									content: err.message || '请求服务失败',
									showCancel: false
								})
							}).finally(() => {
								
							})
						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					})
				}
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
							uni.setStorageSync('userinfo',res.result.userInfo)
							that.userinfo=res.result.userInfo
							that.form.nickName=that.userinfo.nickName
							that.form.introduce=that.userinfo.introduce
						}
					}
				}) 
			},
		}
	}
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
</style>
