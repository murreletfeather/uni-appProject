<template>
	<view class="bg-white padding-sm">
		<uni-forms ref="form" :modelValue="formData" :rules="rules">
			<uni-forms-item label="店名" name="name">
				<uni-easyinput type="text" v-model="formData.name" placeholder="请输入店名" />
			</uni-forms-item>
			<uni-forms-item label="起送价" name="delivery_price">
				<uni-easyinput type="digit" v-model="formData.delivery_price"  placeholder="请输入起送价" />
			</uni-forms-item>
			<uni-forms-item label="简介" name="dis">
				<uni-easyinput type="textarea" autoHeight  v-model="formData.dis"  placeholder="请输入简介" />
			</uni-forms-item>
			<uni-forms-item label="公告" name="notice">
				<uni-easyinput type="textarea" autoHeight  v-model="formData.notice"  placeholder="请输入公告" />
			</uni-forms-item>
			<uni-forms-item label="店主" name="shopkeeper">
				<uni-easyinput type="text" v-model="formData.shopkeeper"  placeholder="请输入店主名字" />
			</uni-forms-item>
			<uni-forms-item label="店主微信" name="wx">
				<uni-easyinput type="text" v-model="formData.wx"  placeholder="请输入店主微信" />
			</uni-forms-item>	
			<uni-forms-item label="手机号" name="phone">
				<uni-easyinput type="number" v-model="formData.phone"  placeholder="请输入手机号" />
			</uni-forms-item>
			<uni-forms-item label="地址" name="address">
				<uni-easyinput type="textarea" autoHeight  v-model="formData.address"  placeholder="请输入地址" />
			</uni-forms-item>
			<uni-forms-item label="状态" name="status">
				<radio-group @change="radioChange" class="flex">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="item.value === formData.status" />{{item.name}}
						</view>
					</label>
				</radio-group>
			</uni-forms-item>
			<view class="text-center">
				<button class="cu-btn bg-green round shadow-blur" @click="submit" style="width: 80%;">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'mdsh-store';
	export default {
		data() {
			return {
				id:'',
				formData: {
					name: '',
					delivery_price: 0,
					dis:'',
					notice:'',
					shopkeeper:'',
					wx:'',
					phone:'',
					address:'',
					status:1
				},
				items:[
					{
						value:1,
						name:"在营业"
					},{
						value:2,
						name:"打烊"
					}
				],
				current: 0,
				wx_code:[],
				cover:[],
				rules: {
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入店铺名称',
							},
							{
								minLength: 4,
								maxLength: 10,
								errorMessage: '长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					notice: {
						rules: [{
							required: true,
							errorMessage: '请输入公告',
						}]
					},
					dis: {
						rules: [{
							required: true,
							errorMessage: '请输入店铺简介',
						}]
					},
					shopkeeper: {
						rules: [{
							required: true,
							errorMessage: '请输入店主姓名',
						}]
					},
					wx: {
						rules: [{
							required: true,
							errorMessage: '请输入店主微信号',
						}]
					},
					phone: {
						rules:[
							{
								required: true, 
								errorMessage: '手机号错误'
							}
						]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '请输入店铺地址',
						}]
					}
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
			if(e.id){
				this.id=e.id
				this.getDetail()
			}
		},
		methods: {
			radioChange: function(evt) {
				this.formData.status=parseFloat(evt.detail.value)
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.detail.value) {
						this.current = i;
						break;
					}
				}
			},
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(this.id).field(
					'name,delivery_price,dis,notice,shopkeeper,wx,phone,address,status'
					).get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			submit() {
				this.$refs.form.validate().then(res => {
					db.collection(dbCollectionName).where({_id:this.id}).update(res).then((res) => {
						uni.showToast({
							title: '修改成功'
						})
						this.getOpenerEventChannel().emit('refreshData')
						setTimeout(() => uni.navigateBack(), 500)
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			}
		}
	}
</script>
