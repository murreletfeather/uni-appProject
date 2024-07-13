<template>
	<view>
		<u-popup v-model="show" width="70%" @close="close">
			<unicloud-db ref="udbSchool" v-slot:default="{data,pagination, loading, error, options}" field="tag,college_name,location,logo,school_type"
				collection="mdsh-school" where="status==true"
				orderby="sort desc,create_date desc" page-data="add" :page-size="20" @load="handleLoad">
				<uni-list>
				    <uni-list-item :border="true" v-for="(res,index) in data" :key="index">
						<view slot="body" class="flex bg-white" @click="save(res)">
							<view class="">
								<image :src="res.logo" mode="aspectFit" style="width: 100rpx;height: 100rpx;"></image>
							</view>
							<view class="margin-left-sm">
								<view class="" style="font-size: 32rpx;">
									{{res.college_name}}
								</view>
								<view class="" v-if="res.tag.length">
									<view class='cu-tag round text-blue line-blue sm' v-for="(tag,indext) in res.tag">{{tag}}</view>
								</view>
								<view class="" style="font-size: 26rpx;color: #C0C0C0;">
									{{res.location}}
									<text>{{res.school_type}}</text>
								</view>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				
			</unicloud-db>
			 <uni-load-more :status="load" @clickLoadMore="getmore" :contentText="contentText"></uni-load-more>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"school-popup",
		props: {
			show: false
		},
		data() {
			return {
				load: 'more',
				contentText:{
					contentdown: "点击加载更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"}
			};
		},
		methods:{
			getmore(){
				if(this.load!="noMore"){
					this.load="loading"
				}
				this.$refs.udbSchool.loadMore()
			},
			handleLoad(data, ended, pagination){
				if(ended){
					this.load="noMore"
				}else{
					this.load="more"
				}
			},
			close(){
				
			},
			save(res){
				this.$emit('cschool',res)
			},
		}
	}
</script>

<style>

</style>
