<template>
	<view class="">
		<u-form :model="form" ref="uForm">
			<view class="bg-white padding-sm">
				<u-form-item label="类型" prop="typename">
					<u-input v-model="form.typename" type="select" @click="show = true" placeholder="请选择服务类型" />
				</u-form-item>
				<u-form-item label="描述" prop="des">
					<u-input placeholder="请输入服务内容" v-model="form.des" type="textarea" height="150" />
				</u-form-item>
				<u-form-item label="出价" prop="pay_money">
					<u-input placeholder="请输入价格" v-model="form.pay_money" type="digit" />
				</u-form-item>
				<u-form-item label="服务时间" label-width="130" prop="arrive_time">
					<u-input placeholder="请选择服务时间" v-model="form.arrive_time" type="select" @click="showtime = true" />
				</u-form-item>
			</view>
			<view class="margin-top-sm bg-white padding-sm">
				<view class="text-center">
					以下信息仅接单员可见
				</view>
				<view class="">
					<u-form-item label="联系人" label-width="120" prop="uname">
						<u-input placeholder="请输入姓名" v-model="form.uname" maxlength="20" />
					</u-form-item>
					<u-form-item label="联系电话" label-width="130" prop="phone">
						<u-input placeholder="请输入联系电话" v-model="form.phone" type="number" maxlength="11" />
					</u-form-item>
					<u-form-item v-if="form.type===1 || form.type===2" label="送达地址" label-width="130" prop="address">
						<u-input v-model="form.address" />
					</u-form-item>
					<u-form-item label="保密内容" label-width="130" prop="hide_content">
						<u-input placeholder="涉及到隐私内容或者安全信息的请在此输入" v-model="form.hide_content" type="textarea"
							height="150" />
					</u-form-item>
				</view>
			</view>
		</u-form>
		<view class="text-center" style="margin: 60rpx;">
			<button class="cu-btn round item-bgr margin-top-xl" style="width: 80%;" @click="submit">发布</button>
		</view>

		<u-select :list="typelist" v-model="show" @confirm="actionSheetCallback"></u-select>
		<u-picker v-model="showtime" mode="time" :params="params" @confirm="confirmtime"></u-picker>
		<auth ref="auth"></auth>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	import auth from "@/components/auth.vue"
	export default {
		components: {
			auth
		},
		data() {
			return {
				value: '',
				type: 'select',
				show: false,
				showtime: false,
				border: true,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				typelist: [{
						label: '帮我买',
						value: 1,
					},
					{
						label: '帮我取',
						value: 2,
					},
					{
						label: '帮我排队',
						value: 3,
					},
					{
						label: '帮我代课',
						value: 4,
					},
				],
				form: {
					type: '',
					typename: '',
					des: '',
					pay_money: 3,
					phone: '',
					address: '',
					uname: '',
					hide_content: '',
					arrive_time: '',
					order_id:'',
					school_id:''
				},
				rules: {
					typename: [{
						required: true,
						message: '请选择类型',
						trigger: ['change', 'blur'],
					}],
					des: [{
						required: true,
						min: 5,
						message: '描述信息不能少于5个字',
						trigger: ['change', 'blur'],
					}],
					arrive_time: [{
						required: true,
						message: '请选择服务时间',
						trigger: ['change', 'blur'],
					}],
					pay_money: [{
						required: true,
						type: 'number',
						min: 1,
						message: '价格不能小于1',
						trigger: ['change', 'blur'],
					}],
					uname: [{
						required: true,
						message: '请输入联系人姓名',
						trigger: ['change', 'blur'],
					}],
					address: [{
						required: true,
						message: '请输入送达地址',
						trigger: ['change', 'blur'],
					}],
					phone: [{
							required: true,
							message: '请输入联系电话',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
				}
			};
		},
		computed:{
			orderId(){
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var timer = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
				var outTradeNo = timer + Math.round(Math.random() * (999999 - 111111) + 111111);
				return outTradeNo;
			},
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		methods: {
			confirmtime(e) {
				this.form.arrive_time = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e
					.second
			},
			actionSheetCallback(e) {
				this.form.type = e[0].value
				this.form.typename = e[0].label
			},
			submit() {
				if(this.hasLogin){
					if(this.userinfo.school_id){
						this.$refs.uForm.validate(valid => {
							if (valid) {
								this.settempst()
							} else {
						
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
				}else{
					this.login()
				}
				
			},
			release() {
				uni.showLoading({
					title: '订单提交中'
				});
				this.form.order_id=this.orderId
				this.form.school_id=this.userinfo.school_id
				db.collection("mdsh-assist").add(this.form).then((res) => {
						this.pay(res.result.id)
					}).catch((err) => {
						uni.showModal({
							content: err.message || '提交失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
			},
			pay(id) {
				var that = this
				new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: 'pay',
						data: {
							token: uni.getStorageSync('uni_id_token'),
							provider: 'wxpay_mp-weixin',
							funct: 'pay',
							type: 2,
							id: id
						},
						success(res) {
							if (res.result.order) {
								return new Promise((resolve, reject) => {
									uni.requestPayment({
										// #ifdef APP-PLUS
										provider: selectedProvider,
										// #endif
										// #ifdef MP-WEIXIN
										...res.result.order,
										// #endif
										// #ifdef APP-PLUS || MP-ALIPAY
										orderInfo: res.result.order,
										// #endif
										success: function(res) {
											uni.showToast({
												icon: "success",
												title: "支付成功"
											})
											setTimeout(() => {
												uni.navigateTo({
													url: "/user/assist/detail?id=" +
														id
												})
											}, 2000)
										},
										fail: function(err) {
											uni.showToast({
												icon: "none",
												title: "支付失败"
											})
											setTimeout(() => {
												uni.navigateTo({
													url: "/user/assist/detail?id=" +
														id
												})
											}, 2000)
										}
									})
								})
							} else {
								uni.showModal({
									content: '支付失败',
									showCancel: false
								})
							}
						},
						fail() {
							uni.showToast({
								icon: "none",
								title: "支付失败"
							})
							setTimeout(() => {
								uni.navigateTo({
									url: "/user/assist/detail?id=" + id
								})
							}, 2000)
						}
					})
				}).catch((err) => {
					console.log("结果" + err)
					uni.showModal({
						content: err.message || '支付失败',
						showCancel: false
					})
				})
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
			settempst(id) {
				var that = this;
				//#ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
					tmplIds: ['O6JJHqEZrsYNLfEhxmvRwCAh2_k8Q8jgWAOV_NG7Gec',
						'xPQILFhAa-7rrz4dNYfEkMqH_ookXcX5TJMouBIb2xk'
					],
					complete(res) {
						that.release()
					}
				})
				//#endif	
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>
