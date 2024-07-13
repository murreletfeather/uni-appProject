<template>
	<view class="uni-tabs">
		<view class="wrapper">
			<slot name="left" />
			
			<view class="scroll-view-wrapper">
				<scroll-view
					:scroll-x="scrollable"
					:scroll-left="scrollLeft"
					scroll-with-animation
					class="scroll-view"
					:show-scrollbar="false"
					ref="scroll-view">
					
					<view class="nav" ref="nav" :style="[{flex: scrollable ? 0 : 1}]">
						<template v-for="(item, index) in list">
							<view class="nav-item"
								:class="[`nav-item-${index}`, item.disabled && 'nav-item--disabled']"
								:style="[itemStyle]"
								@click="clickHandler(item, index)"
								:ref="`nav-item-${index}`"
								:key="index">
								
								<text class="nav-item-text"
									:class="['ellipsis' && 'u-line-1', item.disabled && 'nav-item-text--disabled']"
									:style="[textStyle(index)]">
									{{ item[keyName] }}
								</text>
								
							</view>
						</template>
					</view>
					
					<!-- #ifdef APP-NVUE -->
					<view class="nav-line"
						ref="nav-line"
						:style="[{
							width: lineWidth,
							height: lineHeight,
							backgroundColor: lineColor
						}]"
					>
					<!-- #endif -->
					
					<!-- #ifndef APP-NVUE -->
					<view class="nav-line" ref="nav-line"
						:style="[{
							width: lineWidth,
							transform: `translate(${lineOffsetLeft}px)`,
							transitionDuration: `${firstTime ? 0 : duration}ms`,
							height: lineHeight,
							backgroundColor: lineColor
						}]"
					>
					<!-- #endif -->
					</view>
					
				</scroll-view>
			</view>
			
			<slot name="right" />
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation')
	const dom = uni.requireNativePlugin('dom')
	// #endif
	
	import props from './props.js';
	
	export default {
		name:"uni-tabs",
		
		data() {
			return {
				firstTime: true,
				scrollLeft: 0,
				scrollViewWidth: 0,
				lineOffsetLeft: 0,
				tabsRect: {
					left: 0
				},
				innerCurrent: 0,
				moving: false,
			};
		},
		
		watch: {
			current: {
				immediate: true,
				handler (newValue, oldValue) {
					if (newValue !== this.innerCurrent) {
						this.innerCurrent = newValue
						this.$nextTick(() => {
							this.resize()
						})
					}
				}
			},
			
			list() {
				this.$nextTick(() => {
					this.resize()
				})
			}
		},
		
		computed: {
			textStyle(){
				return index => {
					const style = {};
					const customeStyle = index;
					
				}
			}
		},
		
		async mounted() {
			this.init()
		},
		
		methods: {
			setLineLeft(){
				const tabItem = this.list[this.innerCurrent];
				if (!tabItem) { return }
				
				let lineOffsetLeft = this.list.slice(0, this.innerCurrent).reduce((total, curr) => total + curr.rect.width, 0);
				this.lineOffsetLeft = lineOffsetLeft + (tabItem.rect.width - this.lineWidth) / 2;
				
				// #ifdef APP-NVUE
				// 第一次移动滑块，无需过渡时间
				this.animation(this.lineOffsetLeft, this.firstTime ? 0 : parseInt(this.duration))
				// #endif
				
				if (this.firstTime) {
					setTimeout(() => {
						this.firstTime = false
					}, 10);
				}
			},
			
			animation(x, duration = 0){
				const ref = this.$refs['nav-line'];
				animation.transition(ref, {
					styles: {
						transform: `translateX(${x}px)`
					},
					duration
				})
			},
			
			clickHandler(item, index){
				this.$emit('click', { ...item, index })
				// 如果disabled状态，返回
				if (item.disabled) return
				this.innerCurrent = index
				this.resize()
				this.$emit('change', {...item, index })
			},
			
			init(){},
			
			setScrollLeft(){},
			
			resize(){
				if(this.list.length === 0) { return }
			},
			
			getTabsRect(){
				return new Promise(resolve => {
					this.queryRect('u-tabs__wrapper__scroll-view').then(size => resolve(size))
				})
			},
			
			getAllItemRect(){},
			
			queryRect(){},
		}
	}
</script>

<style scoped lang="scss">

</style>
