<template>
	<view>
		<unicloud-db ref="udbStore" v-slot:default="{data, loading, error, options}"
			collection="mdsh-store,mdsh-school" field="address,cover,create_date,delivery_price,dis,is_currency,is_recommend,name,notice,phone,rate,score,shopkeeper,status,wx,wx_code,school_id{college_name}" getone :where="StoreWhere" loadtime="manual" @load="handleLoad" @error="handleError">
			<view v-if="data">
				<view class="flex align-center bg-white padding solid-bottom">
					<view class="">
						<view class="cu-avatar radius" :style="[{ backgroundImage:'url(' + data.cover+ ')' }]"></view>
					</view>
					<view class="margin-left-sm" style="line-height: 40rpx;">
						<view class="">
							{{data.name}}
						</view>
					</view>
				</view>
				
				<view class="flex justify-between bg-white padding">
					<view class="">
						店铺评级
					</view>
					<view class="">
						<view class="text-gray">
							<u-rate :disabled="true" v-model="data.score/2" size="26"></u-rate>
							<text class="text-red">{{data.score}}</text>
						</view>
					</view>
				</view>
				
				<view class="bg-white margin-top-sm padding">
					<view class="flex " style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							起送价
						</view>
						<view class="">
							{{data.delivery_price}}元
						</view>
					</view>
					<view class="flex " style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							所在学校
						</view>
						<view class="">
							{{data.school_id[0].college_name}}
						</view>
					</view>
					<view class="flex " style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							店铺介绍
						</view>
						<view class="">
							{{data.dis}}
						</view>
					</view>
					<view class="flex" style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							联系电话
						</view>
						<view class="" @click="callphone">
							{{data.phone}}
						</view>
					</view>
					<view class="flex" style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							微信
						</view>
						<view class="" @click="codewx">
							{{data.wx}}
						</view>
					</view>
					<view class="flex" style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							微信二维码
						</view>
						<view class="">
							<image :src="data.wx_code" mode="scaleToFill" style="width: 200rpx;height: 200rpx;" @click="saveimg"></image>
						</view>
					</view>
					<!-- <view class="flex" style="margin: 16rpx 0;">
						<view class="" style="width: 160rpx;">
							开店时间
						</view>
						<view class="">
							{{$u.timeFormat(res.create_time, 'yyyy-mm-dd hh:MM:ss') || ''}}
						</view>
					</view> -->
				</view>
			</view>
		</unicloud-db>
		<u-action-sheet :list="sheetlist" v-model="sheetshow" @click="sheetclick"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StoreWhere:"status=="+1,
				deleteid:'',
				sheetshow:false,
				sheetlist: [{
					text: '隐藏'
				}, {
					color: 'red',
					text: '删除' 
				}],
				value: 2,
				info:'',
				id:''
			};
		},
		onLoad(e) {
			this.id=e.id
			if(this.id){
				this.StoreWhere=this.StoreWhere+'&&' + "_id=='" + this.id + "'"
			}
		},
		onReady() {
			if(this.id){
				uni.showLoading({
					title: '加载中'
				});
				this.$refs.udbStore.loadData()
			}
		},
		onShow() {
			
		},
		methods:{
			handleLoad(data, ended, pagination){
				uni.hideLoading();
				if(data){
					this.info=data
				}else{
					uni.showToast({
						icon:"none",
						title:"店铺不存在或已关闭"
					})
					setTimeout(() => uni.navigateBack(), 500)
				}
			},
			handleError(e){
				uni.hideLoading();
				uni.showToast({
					icon:"none",
					title:e || "店铺不存在或已关闭"
				})
				setTimeout(() => uni.navigateBack(), 500)
			},
			
			codewx(){
				//#ifndef H5
				uni.setClipboardData({
				    data: this.info.wx,
				    success: function () {
				        uni.showToast({
				        	icon:"success",
							title:"微信号已复制"
				        })
				    },
					fail:function(){
						uni.showToast({
							icon:"none",
							title:"复制失败"
						})
					}
				});
				//#endif
			},
			saveimg(){
				var that=this;
				//#ifdef MP-QQ
				that.codewx()
				// uni.authorize({
				// 	scope: "scope.writePhotosAlbum",
				// 	success(res) {
				// 		 uni.saveImageToPhotosAlbum({
				// 		 	filePath: that.info.wx_code,
				// 		 	success: function () {
				// 		 	    uni.showToast({
				// 		 	    	icon:"success",
				// 		 			title:"已保存到手机"
				// 		 	    })
				// 		 	},
				// 		 	fail:function(e){console.log(e)
				// 		 		uni.showToast({
				// 		 			icon:"none",
				// 		 			title:"保存失败"
				// 		 		})
				// 		 	}
				// 		 });
				//     }
				// })
				//#endif
				//#ifdef MP-WEIXIN
				uni.saveImageToPhotosAlbum({
					filePath: that.info.wx_code,
					success: function () {
					    uni.showToast({
					    	icon:"success",
							title:"二维码已保存到手机"
					    })
					},
					fail:function(e){console.log(e)
						uni.showToast({
							icon:"none",
							title:"保存失败"
						})
					}
				});
				//#endif
			},
			callphone(){
				uni.makePhoneCall({
				    phoneNumber: this.info.phone
				});
			},
			delt(id){
				this.sheetshow=true;
			},
			sheetclick(e){
				this.$u.api.delstore({
					id:this.id,
					type:e
				}).then(res => {
					uni.showToast({
						icon:"success",
						title:res.msg
					})
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
