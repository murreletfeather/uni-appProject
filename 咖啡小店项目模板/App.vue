<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import '@/tailwind.scss';
	
	uni-button{
		margin: 0;
		line-height: 1;
		background-color: transparent;
	}
	
	uni-button[type=default]{
		color: #FFFFFF;
		background: #047857;
	}
	uni-button:after{
		display: none;
	}
	.border-l2-green{
		border-left: 4px solid #047857;
		border-bottom: 2px solid #047857;
	}
</style>
