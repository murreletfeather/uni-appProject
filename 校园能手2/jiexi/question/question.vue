<template>
	<view>
		<view class="padding">
			<u-parse :html="info.value"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:''
			}
		},
		onLoad() {
			this.getnotice()
		},
		methods: {
			getnotice(){
				var that=this
				uniCloud.callFunction({
					name:"system-config",
					data:{
						funct:"get-config",
						token:uni.getStorageSync('uni_id_token'),
						label:"qsy-question"
					},
					success(res) {
						that.info=res.result[0]
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
