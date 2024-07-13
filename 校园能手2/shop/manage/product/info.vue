<template>
	<view class="bg-white padding-sm">
		<uni-forms ref="form" :modelValue="formData" :rules="rules">
			<uni-forms-item label="名称" name="name" required>
				<uni-easyinput type="textarea" autoHeight v-model="formData.name" placeholder="请输入名称" />
			</uni-forms-item>
			<uni-forms-item label="价格" name="price" required>
				<uni-easyinput type="digit" v-model="formData.price"  placeholder="请输入价格" />
			</uni-forms-item>
			<uni-forms-item label="库存" name="stock"  required>
				<uni-easyinput type="number"  v-model="formData.stock"  placeholder="请输入库存" />
			</uni-forms-item>
			<uni-forms-item label="是否在售" name="status">
				<switch class="orange radius" :class="formData.status ? 'checked' : '' " :checked="formData.status ? true : false" @change="switch1Change"></switch>
			</uni-forms-item>
			<uni-forms-item label="是否热门" name="is_hot">
				<switch class="orange radius" :class="formData.is_hot ? 'checked' : '' " :checked="formData.is_hot ? true : false" @change="switch2Change"></switch>
			</uni-forms-item>
			<uni-forms-item label="是否置顶" name="is_top">
				<switch class="orange radius" :class="formData.is_top ? 'checked' : '' " :checked="formData.is_top ? true : false" @change="switch3Change"></switch>
			</uni-forms-item>	
			<uni-forms-item label="分类" name="cate_id" required>
				<uni-data-picker v-model="formData.cate_id" placeholder="请选择分类" popup-title="请选择分类" :localdata="cateList" />
			</uni-forms-item>
			<uni-forms-item label="封面" name="cover" required>
				<uni-file-picker file-mediatype="image" :limit="1" file-extname="jpg,png" return-type="array"
					v-model="formData.cover" />
			</uni-forms-item>
			<uni-forms-item label="轮播" name="images" required>
				<uni-file-picker file-mediatype="image"  file-extname="jpg,png" return-type="array"
					v-model="formData.images"/>
			</uni-forms-item>
			<view class="text-center flex">
				<button class="cu-btn bg-green round shadow-blur" @click="submit" style="width: 80%;">提交</button>
				<button class="cu-btn bg-blue round shadow-blur" v-if="id" @click="editcontent" style="width: 80%;">编辑详情</button>
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
	const dbCollectionName = 'mdsh-store-product';
	export default {
		data() {
			return {
				id:'',
				cateList:[],
				formData: {
					name: '',
					price: 0,
					stock:0,
					status:true,
					is_hot:false,
					is_top:false,
					cate_id:"",
					images:[],
					cover:[],
					store_id:'',
					content:''
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
				rules: {
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入名称',
							},
							{
								minLength: 4,
								errorMessage: '长度在 {minLength}个字符以上',
							}
						]
					},
					price: {
						rules: [
							{
								required: true,
								errorMessage: '请输入价格',
							},
							{
								minimum: 0.1,
								errorMessage: '价格不能小于1',
							}
						]
					},
					stock: {
						rules: [
							{
								required: true,
								errorMessage: '请输入库存',
							},
							{
								minimum: 1,
								errorMessage: '库存不能小于1',
							}
						]
					},
					cate_id: {
						rules: [{
							required: true,
							errorMessage: '请选择分类',
						}]
					},
					status: {
						rules: [{
							format: 'boolean',
							errorMessage: '类型错误',
						}]
					},
					is_top: {
						rules: [{
							format: 'boolean',
							errorMessage: '类型错误',
						}]
					},
					is_hot: {
						rules: [{
							format: 'boolean',
							errorMessage: '类型错误',
						}]
					},
					cover: {
						rules: [{
							format: 'array',
							errorMessage: '类型错误',
						}]
					},
					images: {
						rules: [{
							format: 'array',
							errorMessage: '类型错误',
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
			this.getCate()
			if(e.id){
				this.id=e.id
				this.getDetail()
			}
		},
		methods: {
			editcontent(){
				uni.navigateTo({
					url:"./editor?id="+this.id
				})
			},
			switch1Change: function (e) {
				this.form.status=e.target.value
			},
			switch2Change: function (e) {
				this.form.is_hot=e.target.value
			},
			switch3Change: function (e) {
				this.form.is_top=e.target.value
			},
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.action("product-det")
				.collection(dbCollectionName).doc(this.id).field(
					'name,cate_id,is_top,is_hot,price,stock,status,images,cover'
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
			getCate() {
				db.collection("mdsh-store-product-cate").where({
					status:true,
					store_id:this.userinfo.store_id
				}).field(
					'name as text,_id as value'
					).get().then((res) => {
					const data = res.result.data
					if (data) {
						this.cateList = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					
				})
			},
			submit() {
				if(this.formData.cover.length<1){
					return uni.showToast({
							icon:"none",
								title: '请上传封面'
							})
				}
				if(this.formData.images.length<1){
					return uni.showToast({
							icon:"none",
								title: '请上传轮播图'
							})
				}
				this.formData.price=parseFloat(this.formData.price)
				this.formData.stock=parseFloat(this.formData.stock)
				this.formData.store_id=this.userinfo.store_id
				this.$refs.form.validate().then(res => {
					res.price=parseFloat(res.price)
					res.stock=parseFloat(res.stock)
					res.store_id=this.userinfo.store_id
					let arr=[]
					let cover=''
					let images=this.formData.images
					let cov=this.formData.cover
					images.forEach((img) => {
						arr.push(img.url)
					})
					cov.forEach((img) => {
						cover=img.url
					})
					res.images=arr
					res.cover=cover
					
					if(this.id){
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
					}else{
						res.content=res.name
						db.collection(dbCollectionName).add(res).then((res) => {
							uni.showToast({
								title: '添加成功'
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
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			}
		}
	}
</script>
