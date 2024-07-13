<template>
	<view class="bg-white padding">
		<u-form :model="form" ref="uForm">
			<u-form-item label-width="120" label="姓名" prop="real_name">
				<u-input v-model="form.real_name" disabled maxlength="11"/>
			</u-form-item>
			<u-form-item label-width="120" label="手机号" prop="phone">
				<u-input v-model="form.phone" disabled type="number" maxlength="11"/>
			</u-form-item>
			<u-form-item label-width="120" label="学院" prop="college">
				<u-input maxlength="20" disabled v-model="form.college" />
			</u-form-item>
			<u-form-item label-width="150" label="专业班级" prop="major">
				<u-input maxlength="20" disabled v-model="form.major" />
			</u-form-item>
			<u-form-item label-width="120" label="年级">
				<picker  disabled :value="grade" :range="nianji">
					<view class="picker">
						{{form.grade}}
					</view>
				</picker>
			</u-form-item>
			<view class="" v-if="form.type==2">
				<u-form-item label-width="150" label="店铺名称" prop="store_name">
					<u-input v-model="form.store_name" disabled/>
				</u-form-item>
				<u-form-item label-width="150" label="店铺地址" prop="address">
					<u-input type="textarea" height="140" disabled v-model="form.address" />
				</u-form-item>
			</view>
			<u-form-item label-width="150" label="申请说明" prop="des">
				<u-input type="textarea" height="140" disabled v-model="form.des" />
			</u-form-item>
			<u-form-item v-if="form.status==3" label-width="150" label="拒绝原因" prop="des">
				<u-input :disabled="true" type="textarea" height="140" v-model="form.ref_reason" />
			</u-form-item>
		</u-form>
		<view class="text-center margin-top">
			<button v-if="form.status==1" class="cu-btn round item-bgr" style="width: 80%;" @click="submit">审核</button>
			<button v-else-if="form.status==2" disabled class="cu-btn round item-bgr" style="width: 80%;">已通过</button>
			<button v-else-if="form.status==3" disabled class="cu-btn round item-bgr" style="width: 80%;">拒绝通过</button>
		</view>
		<u-modal v-model="show" title='审核' show-cancel-button	@confirm="confirm">
			<view class="slot-content padding">
				<view class="">
					<u-radio-group v-model="status">
						<u-radio shape="circle" :name="2">通过</u-radio>
						<u-radio shape="circle" :name="3">拒绝</u-radio>
					</u-radio-group>
				</view>
				<view class="margin-top-sm" v-if="status==3">
					<u-input v-model="ref_reason" placeholder="请输入原因" type="textarea" />
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;
export default {
	data() {
		return {
			status:2,
			ref_reason:'',
			show:false,
			grade:0,
			form: {
				type:1,
				real_name: '',
				college: '',
				phone: '',
				grade:2015,
				store_name:'',
				major:'',
				des:'',
				address:'',
				status:0,
				ref_reason:''
			},
			nianji:[2015,2016,2017,2018,2019,2020,2021],
			rules: {}
		};
	},
	onLoad(e) {
		this.id=e.id
		this.applydet()
	},
	methods:{
		applydet() {
			uni.showLoading({
				title: '加载中'
			});
			db.collection("mdsh-user-apply")
			.where({
				_id: this.id
			}).get()
			.then((res) => {
				uni.hideLoading();
				if(res.result.data.length==1){
					this.form = res.result.data[0]
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
		submit(){
			this.show=true
		},
		confirm(){
			if(this.status==3 && this.ref_reason==''){
				uni.showToast({
					icon:"none",
					title:'请输入原因'
				})
			}else{
				db.action('user-apply-sh')
				.collection("mdsh-user-apply")
				.where({
					_id: this.id
				}).update({
					sh_time:db.env.now,
					ref_reason:this.ref_reason,
					status:this.status
				})
				.then((res) => {
					uni.showToast({
						title:'审核成功'
					})
					this.applydet()
				})
				.catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: err.message || '操作失败',
						showCancel: false
					})
				})
			}
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>