<template>
	<view class="container">
		<view class="button-first">
			<navigator url="/pages/index/firstPage/contactCustomerService">
				<button type="primary">反馈问题</button>
			</navigator>
			<navigator url="/pages/index/firstPage/aboutUs">
				<button type="primary">关于我们</button>
			</navigator>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

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

	.button-first {
		display: flex;
		flex-direction: column;
		/* 垂直排列 */
		align-items: center;
		/* 水平居中 */
		gap: 20px;
		/* 按钮间距 */
	}
</style>