<template>
	<view class="container">
		<view class="button-container">
			<button class="call-button" @click="callService">电话联系客服</button>
		</view>

		<view class="form-container">
			<view class="sendInfo">
				<view class="header">
					<h2>反馈问题</h2>
				</view>
				<p>请详细描述您的问题，我们会尽快处理。</p>
			</view>
			<form @submit.prevent="submitQuery">
				<textarea class="query-input" v-model="query" placeholder="输入您的问题" rows="4" />
				<button class="submit-button" type="submit">提交</button>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: ''
			};
		},
		methods: {
			callService() {
				uni.makePhoneCall({
					phoneNumber: '123456789' // 替换为实际客服电话
				});
			},
			submitQuery() {
				uni.request({
					url: 'https://your-api-url.com/contact', // 替换为实际接口
					method: 'POST',
					data: {
						message: this.query
					},
					success: (res) => {
						uni.showToast({
							title: '提交成功'
						});
					},
					fail: () => {
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		background: linear-gradient(135deg, #74ebd5, #ACB6E5);
		/* 渐变背景 */
		height: 100vh;
		/* 使容器高度充满视口 */
	}

	.button-container {
		margin-bottom: 20px;
	}

	.call-button {
		width: 100%;
		padding: 10px;
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.call-button:hover {
		background-color: #0056b3;
	}

	.form-container {
		background-color: white;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.query-input {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.submit-button {
		width: 100%;
		padding: 10px;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.submit-button:hover {
		background-color: #218838;
	}


	.header {
		text-align: center;
		/* 添加此行 */
		margin-bottom: 20px;
		font-size: 22px;
		font-weight: 500;
	}
</style>