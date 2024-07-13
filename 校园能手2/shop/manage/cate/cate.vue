<template>
	<view>
		<uni-list>
			<uni-list-item :border="false" v-for="(res,index) in list" :key="index" class="bg-white">
				<view slot="body" style="width: 100%;">
					<view class="padding-sm flex justify-between align-center" style="width: 100%;">
						<uni-easyinput v-model="res.name" placeholder="请输入内容" @focus="res.fos=true"></uni-easyinput>
						<button v-if="res.name==''" class="cu-btn sm bg-red margin-sm" @click="del(res,index)">删除</button>
						<button v-else class="cu-btn sm bg-green margin-sm" @click="addcate(res,index)">确认</button>
					</view>
					
				</view>
			</uni-list-item>
		</uni-list>
		<uni-fab :pattern="pattern" @fabClick="add" horizontal="right"></uni-fab>
		<uni-load-more :status="load"></uni-load-more>
		<u-back-top :scroll-top="scrollTop" icon="arrow-up-fill"></u-back-top>
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
				fos:false,
				page:1,
				limit: 20,
				list:[],
				load: 'loading',
				orderby:"create_date desc",
				scrollTop: 0,
				pattern:{
					buttonColor:"#00bc8e"
				},
			};
		},
		computed: {
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		onLoad() {
			this.getContent()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.load = "loading"
			this.page=1;
			this.list=[];
			this.getContent()
		},
		onReachBottom() {
			if (this.load != "noMore") {
				this.load = "loading"
				this.page++
				this.getContent()
			}
		},
		methods:{
			getContent() {
				let skip = (this.page - 1) * this.limit;
				db.collection('mdsh-store-product-cate')
				.where({
					store_id:this.userinfo.store_id
				})
				.orderBy(this.orderby)
				.skip(skip)
				.limit(this.limit)
				.get().then((res) => {
					const data = res.result.data
					if (data.length < this.limit) {
						this.load = "noMore"
					} else {
						this.load = "more"
					}
					if (data) {
						this.list = this.list.concat(data)
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
			edit(id){
				uni.navigateTo({
					url:"./info?id="+id
				})
			},
			add(){
				var data={				
					status:true,
					store_id:this.userinfo.store_id,
					name:''
				}
				this.list.push(data)
			},
			addcate(res,index){
				if(res.name==''){
					uni.showToast({
						icon:"none",
						title:"请输入分类名"
					}) 
				}else{
					if(res._id){
						db.collection('mdsh-store-product-cate')
						.where({
						  _id: res._id
						})
						.update({
							name:res.name,
							status:true,
							store_id:this.userinfo.store_id,
						})
						.then((res) => {
							uni.showToast({
								icon:"success",
								title:"修改成功"
							})
							this.load = "loading"
							this.page=1;
							this.list=[];
							this.getContent()
						}).catch((err) => {
							uni.showModal({
								content: err.message || '修改失败',
								showCancel: false
							})
						}).finally(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
					}else{
						db.collection('mdsh-store-product-cate')
						.add({
							name:res.name,
							status:true,
							store_id:this.userinfo.store_id,
						})
						.then((res) => {
							uni.showToast({
								icon:"success",
								title:"添加成功"
							})
							this.load = "loading"
							this.page=1;
							this.list=[];
							this.getContent()
						}).catch((err) => {
							uni.showModal({
								content: err.message || '添加失败',
								showCancel: false
							})
						}).finally(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh()
						})
					}
				}
			},
			del(res,index){
				var that=this;
				if(res._id){
					uni.showModal({
					    title: '',
					    content: '确定要删除吗',
					    success: function (resb) {
					        if (resb.confirm) {
					           db.collection("mdsh-store-product-cate")
					             .where({ 
					               _id: res._id
					             })
					             .remove()
					               .then((resc) => {
					                   uni.showToast({
					                       title: '删除成功'
					                   })
					                   that.load = "loading"
					                   that.page=1;
					                   that.list=[];
					                   that.getContent()
					               }).catch((err) => {
					                   uni.showModal({
					                       content: err.message || '删除失败',
					                       showCancel: false
					                   })
					               }).finally(() => {
					           
					               })
					        } else if (resb.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					that.list.splice(index,1); 
				}
			}
		}
	}
</script>

<style lang="less">

</style>
