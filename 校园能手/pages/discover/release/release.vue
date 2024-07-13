<template>
	<view>
		<view class="cu-form-group align-start">
			<textarea maxlength="160" @input="textareaBInput" placeholder="#话题#  说出你的故事,分享你的快乐..."
				style="height: 240rpx;" v-model="form.content"></textarea>
		</view>
		<view class="bg-white flex justify-end margin-right">
			{{valuelength}}/160
		</view>

		<view class="margin-top-sm">
			<view class=" ">
				<button class="cu-btn round text-blue bg-white" @click="showpop">
					<text class="cuIcon-newfill"></text>
					选择话题
				</button>
			</view>
		</view>
		<!-- <view class="margin-top-sm padding-sm" v-if="is_anonymous">
			<view class="">
				<u-radio-group v-model="form.is_anonymous">
					<u-radio shape="circle" name="1">匿名</u-radio>
					<u-radio shape="circle" name="0">不匿名</u-radio>
				</u-radio-group>
			</view>
		</view> -->

		<view class="bg-white">
			<uni-group>
				<uni-file-picker ref="mychild" file-mediatype="image" limit="9" title="选择图片"
					file-extname="png,jpg,gif,jpeg" mode="grid" @success="success" @fail="fail"></uni-file-picker>
			</uni-group>

			<view class="padding-sm">
				<!-- <view class="">
					<button class="cu-btn round" @click="showpop" style="color: #b5b1b0;">
						<template v-if="topic">
							{{topic}}
						</template>
						<template v-else>
							<text class="margin-right">#</text> 添加话题
						</template>
					</button>	
				</view> -->
				<view class="margin-top-sm">
					<button @click="getlocation" class="cu-btn round" style="color: #b5b1b0;">
						<template v-if="address">
							<text>{{address}}</text>
						</template>
						<template v-else>
							<text class="cuIcon-location margin-right"></text>添加位置
						</template>
					</button>
				</view>
			</view>
			<view class="text-center margin-top-xl" style="margin-bottom: 150rpx;">
				<button @click="subk" class="cu-btn round bg-blue" style="width: 80%;">发 布</button>
			</view>
		</view>

		<u-popup v-model="show" mode="bottom" height="1000" border-radius="14" safe-area-inset-bottom closeable>
			<unicloud-db ref="udbDiscover" v-slot:default="{data, loading, error, options}" collection="mdsh-discover"
				orderby="sort desc" where="status==true" field="name,cover" page-data="add" :page-size="20">
				<view class="bg-white padding " v-for="(res,index) in data" :key="index" @click="checkcid(res,index)">
					<view class="flex justify-between align-center">
						<view class="flex align-center">
							<view v-if="res.cover" class="cu-avatar  radius"
								:style="[{ backgroundImage:'url(' + res.cover+ ')' }]"></view>
							<view v-else class="cu-avatar  radius bg-green">{{res.name.slice(0,1)}}</view>
							<view class="margin-left-sm" style="line-height: 40rpx;">
								<view class="" style="font-size: 32rpx;font-weight: 600;">
									#{{res.name}}
								</view>
							</view>
						</view>
						<view class="item-color">
							<text v-if="cidindex===index" class="cuIcon-check"
								style="font-weight: 800;font-size: 34rpx;"></text>
						</view>
					</view>
				</view>
			</unicloud-db>
		</u-popup>

	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'mdsh-discover-content';

	export default {
		data() {
			return {
				tempFilePaths: [],
				imags: [],
				topic: '',
				content: '',
				show: false,
				form: {
					content: '',
					cid: '',
					images: [],
					school_id: '',
					location: ''
				},
				cidindex: '',
				cidinfo: '',
				valuelength: 0,
				is_anonymous: 0,
				disabled: false,
				address: '',
			};
		},
		onLoad(e) {
			if (e.discover) {
				this.form.content = '#' + e.discover + '#'
			}
		},
		computed: {
			conten() {
				this.content = this.topic + this.form.content
			},
			...mapGetters({
				userinfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
		},
		methods: {
			getlocation() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						that.form.location = res
						that.address = res.name
					},
					complete(e) {

					}
				});
			},
			// 上传成功
			success(e) {
				var that = this;
				e.tempFilePaths.forEach((img, index) => {
					uni.showLoading({
						title: "正在检测图片"
					})
					uniCloud.callFunction({
						name: "discover",
						data: {
							funct: "imgSecCheckResone",
							image: img
						},
						success(res) {
							uni.hideLoading()
							if (res.result.code == 0) {
								that.form.images.push(img)
							} else {
								that.$refs.mychild.delFileb(img);
								uni.showToast({
									icon: "none",
									title: res.result.message
								})
							}
						}
					})
				})
			},
			// 上传失败
			fail(e) {
				uni.showToast({
					icon: "none",
					title: "图片上传失败"
				})
			},
			checkcid(res, index) {
				this.topic = "#" + res.name + "#"
				this.form.content = this.GetContent(this.form.content)
				this.form.content = this.topic + this.form.content
				this.cidindex = index
				this.form.cid = res._id
				this.is_anonymous = res.is_anonymous
				this.cidinfo = res
				this.show = false
			},

			textareaBInput(e) {
				this.conten
				this.form.content = e.detail.value
				this.valuelength = e.detail.value.length
			},
			showpop() {
				this.show = true
			},

			subk() {
				if (this.form.content.length < 6) return this.shoutotal('发布内容不能小于6个字符', 0)
				this.form.school_id = this.userinfo.school_id
				this.settempst()
			},
			shoutotal(title, type) {
				uni.showToast({
					title: title,
					icon: type == 1 ? 'success' : 'none'
				})
			},
			postsbh() {
				var that = this;
				if (that.disabled) {

				} else {
					uni.showLoading({
						title: "内容安全检测中"
					})
					that.disabled = true
					uniCloud.callFunction({
						name: "discover",
						data: {
							funct: "textSecCheckRes",
							content: that.form.content
						},
						success(e) {
							if (e.result.code == 0) {
								that.announce()
							} else {
								uni.showToast({
									icon: "none",
									title: e.result.message
								})
							}
						},
						complete() {
							uni.hideLoading()
						}
					})
				}
			},
			announce() {
				this.form.images = this.$refs.mychild.getImgList()
				db.action("discover-content-add")
					.collection(dbCollectionName).add(this.form).then((res) => {
						uni.hideLoading()
						uni.showToast({
							title: '发布成功'
						})
						setTimeout(() => {
							let pages = getCurrentPages(); //获取所有页面栈实例列表
							let nowPage = pages[pages.length - 1]; //当前页页面实例
							let prevPage = pages[pages.length - 2]; //上一页页面实例
							prevPage.$vm.back = true; //修改上一页data里面的searchVal参数值为
							uni.navigateBack({
								delta: 1
							})
						}, 500)
						// setTimeout(() => uni.navigateBack(), 500)
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: err.message || '发布失败',
							showCancel: false
						})
					}).finally(() => {
						this.disabled = false
						uni.hideLoading()
					})
			},
			settempst() {
				//#ifdef MP-WEIXIN
				var that = this;
				uni.requestSubscribeMessage({
					tmplIds: ['ApwIEyiP5HHfCUZcrVj5D3IZYs0ULFdM8XqtxASzXmw','1lWfUSMRkVHKSqfN6hpP4ASUforudiCyZBjTwqNkb1g','6LrUIBoyCZk76ZI_q6uEIz_U7FHgNqmgbFG67MN28Vw'],
					complete(res) {
						that.postsbh()
					}
				})
				//#endif	
				//#ifndef MP-WEIXIN
				this.postsbh()
				//#endif
			},
			GetContent(str) {
				var str = str.replace(/＃/g, '#')
				var first = str.indexOf('#');
				var second = str.replace('#', '@').indexOf('#');
				var Gettopic = str.slice(first + 1, second);
				var GetContent = str.slice(second + 1);
				return first == -1 || second == -1 ? str : GetContent
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
</style>
