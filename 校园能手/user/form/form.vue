<template>
	<view class="bg-white padding">
		<u-form :model="form" ref="uForm">
			<u-form-item label-width="120" label="姓名" prop="real_name">
				<u-input v-model="form.real_name" :disabled="!info || info.status==3 ? false : true" maxlength="11" />
			</u-form-item>
			<u-form-item label-width="120" label="手机号" prop="phone">
				<u-input v-model="form.phone" :disabled="!info || info.status==3 ? false : true" type="number" maxlength="11" />
			</u-form-item>
			<u-form-item label-width="120" label="学院" prop="college">
				<u-input maxlength="20" :disabled="!info || info.status==3 ? false : true" v-model="form.college" />
			</u-form-item>
			<u-form-item label-width="150" label="专业班级" prop="major">
				<u-input maxlength="20" :disabled="!info || info.status==3 ? false : true" v-model="form.major" />
			</u-form-item>
			<u-form-item label-width="120" label="年级">
				<picker @change="PickerChange" :disabled="!info || info.status==3 ? false : true" :value="grade" :range="nianji">
					<view class="picker">
						{{form.grade}}
					</view>
				</picker>
			</u-form-item>
			<view class="" v-if="form.type==2">
				<u-form-item label-width="150" label="店铺名称" prop="store_name">
					<u-input v-model="form.store_name" :disabled="!info || info.status==3 ? false : true" />
				</u-form-item>
				<u-form-item label-width="150" label="店铺地址" prop="address">
					<u-input type="textarea" :disabled="!info || info.status==3 ? false : true" height="140" v-model="form.address" />
				</u-form-item>
			</view>
			<u-form-item label-width="150" label="申请说明" prop="des">
				<u-input type="textarea" :disabled="!info || info.status==3 ? false : true" height="140" v-model="form.des" />
			</u-form-item>
			<u-form-item v-if="form.status==3" label-width="150" label="拒绝原因" prop="des">
				<u-input :disabled="true" type="textarea" height="140" v-model="form.ref_reason" />
			</u-form-item>
		</u-form>
		<view class="text-center margin-top">
			<view class="" v-if="info">
				<button v-if="info.status==1" class="cu-btn round item-bgr" disabled style="width: 80%;">审核中</button>
				<button v-else-if="info.status==2" disabled class="cu-btn round item-bgr"
					style="width: 80%;">已通过</button>
				<button v-else-if="info.status==3" @click="submit" class="cu-btn round item-bgr"
					style="width: 80%;">拒绝通过，重新提交</button>
			</view>
			<view class="" v-else>
				<button @click="submit" class="cu-btn round item-bgr" style="width: 80%;">提交</button>
			</view>

		</view>

		<!-- <u-popup v-model="show" mode="top">
			<view class="text-center">
				<image :src="form.type==1 ? ywy : dp" mode="aspectFit"></image>
				<button class="cu-btn round bg-green margin-sm" @click="saveimg">保存图片</button>
			</view>
		</u-popup> -->
		
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
				grade: 0,
				show: false,
				form: {
					type: 1,
					real_name: '',
					college: '',
					phone: '',
					grade: 2015,
					store_name: '',
					major: '',
					des: '',
					address: '',
					status: 1,
					ref_reason: ''
				},
				info:'',
				dp: 'https://image.redlk.com/system/dp.jpg',
				ywy: 'https://image.redlk.com/system/ywy.jpg',
				nianji: [2015, 2016, 2017, 2018, 2019, 2020, 2021],
				rules: {
					real_name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['change', 'blur'],
					}],
					phone: [{
						required: true,
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号不正确',
						trigger: ['change', 'blur'],
					}],
					college: [{
						required: true,
						min: 4,
						message: '学院名称4个字以上',
						trigger: 'change'
					}],
					major: [{
						required: true,
						min: 6,
						message: '专业班级6个字以上',
						trigger: 'change'
					}],
					grade: [{
						required: true,
						message: '请选择年级',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					store_name: [{
						required: true,
						min: 4,
						message: '请输入店铺名称4字以上',
						trigger: ['change', 'blur'],
					}],
					address: [{
						required: true,
						min: 4,
						message: '请输入店铺地址4字以上',
						trigger: ['change', 'blur'],
					}],
					des: [{
						required: true,
						message: '请输入申请说明',
						trigger: ['change', 'blur'],
					}],
				}

			};
		},
		onLoad(e) {
			this.form.type = e.type
			this.applydet()
		},
		computed:{
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		methods: {
			applydet() {
				uni.showLoading({
					title: '加载中'
				});
				db.collection("mdsh-user-apply")
				.where({
					type: this.form.type,
					uid: db.env.uid
				}).get()
				.then((res) => {
					uni.hideLoading();
					if(res.result.data.length==1){
						this.form = res.result.data[0]
						this.info = res.result.data[0]
					}
				})
				.catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: err.message || '查询失败',
						showCancel: false
					})
				})
			},
			applyAsSalesman() {
				uni.showLoading({
					title: '提交中'
				});
				this.form.school_id=this.userinfo.school_id
				if(this.info){
					db.action("user-apply")
					.collection("mdsh-user-apply").where({
						_id:this.info._id
					}).update(this.form)
					.then((res) => {
						uni.hideLoading();
						this.applydet()
					})
					.catch((err) => {
						uni.hideLoading();
						uni.showModal({
							content: err.message || '提交失败',
							showCancel: false
						})
					})
				}else{
					db.action("user-apply")
					.collection("mdsh-user-apply").add(this.form)
					.then((res) => {
						uni.hideLoading();
						this.applydet()
					})
					.catch((err) => {
						uni.hideLoading();
						uni.showModal({
							content: err.message || '提交失败',
							showCancel: false
						})
					})
				}
			},
			submit() {
				if(this.userinfo.school_id){
					this.$refs.uForm.validate(valid => {
						if (valid) {
							this.settempst()
						} else {
							console.log('验证失败');
						}
					});
				}else{
					uni.showToast({
						icon:"none",
						title:"请先绑定学校"
					})
					setTimeout(() => {
						uni.navigateTo({
							url: "/user/school/school"
						})
					}, 2000)
				}
			},
			settempst() {
				var that = this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
					tmplIds: ['UNF_0URHjtfuDFu-h9ywjoxqs4HAul13My8mvVR4FIU'],
					complete(res) {
						that.applyAsSalesman()
					}
				})
				//#endif	
				//#ifndef MP-WEIXIN
				this.applyAsSalesman()
				//#endif
			},
			saveimg() {
				//#ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.info.wx_code,
					success: function() {
						uni.showToast({
							icon: "success",
							title: "已保存到手机"
						})
					},
					fail: function() {
						uni.showToast({
							icon: "none",
							title: "保存失败"
						})
					}
				});
				//#endif
			},
			PickerChange(e) {
				this.grade = e.detail.value
				this.form.grade = this.nianji[e.detail.value]
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
			authSuccess() {
			
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>
