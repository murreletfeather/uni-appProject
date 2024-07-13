<template>
	<view class="container">
		<view class="header">
			<h2>关于我们</h2>
		</view>

		<view class="content">
			<p class="intro">
				欢迎使用我们的应用！我们致力于提供最优质的服务，帮助用户解决问题。
			</p>
			<p>
				<strong>开发团队：</strong>
				我们的团队由一群热爱技术与创新的专业人士组成。
			</p>
			<p>
				<strong>联系方式：</strong>
				如有疑问，请联系 <a href="tel:123456789">123456789</a> 或发送邮件至 <a
					href="mailto:example@example.com">example@example.com</a>
			</p>
		</view>

		<view class="footer">
			<button class="back-button" @click="goBack">返回</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			goBack() {
				uni.navigateBack(); // 返回上一页
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

	.header {
		text-align: center;
		margin-bottom: 20px;
	}

	.header h2 {
		font-size: 24px;
		color: #333;
	}

	.content {
		background-color: white;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.intro {
		margin-bottom: 15px;
		color: #666;
	}

	.footer {
		margin-top: 20px;
		text-align: center;
	}

	.back-button {
		width: 100%;
		padding: 10px;
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.back-button:hover {
		background-color: #0056b3;
	}
</style>