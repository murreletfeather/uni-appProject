<template>
	<view>
		<view :animation="anData" style="height:0;"></view>
		<scroll-view scroll-with-animation scroll-y="true" @touchmove="hideKey" style="width: 750rpx;"
			:style="{'height': srcollHeight}" :scroll-top="go">
			<view id="okk" scroll-with-animation>
				<view class="flex-column-start" v-for="(x, i) in msgList" :key="i">
					<view v-if="x.my" class="flex justify-end padding-right one-show  align-start  padding-top">
						<view class="flex justify-end" style="width: 400rpx;">
							<view class="margin-left padding-chat bg-cyan" style="border-radius: 35rpx;">
								<text style="word-break: break-all;">{{ x.msg }}</text>
							</view>
						</view>
					</view>
					<view v-else class="flex-row-start margin-left margin-top one-show">
						<view class="chat-img flex-row-center">
							<image style="height: 75rpx; width: 75rpx;" src="@/static/image/robt.png" mode="aspectFit">
							</image>
						</view>
						<view class="flex" style="width: 500rpx;">
							<view class="margin-left padding-chat flex-column-start"
								style="border-radius: 35rpx; background-color: #f9f9f9;">
								<text style="word-break: break-all;">{{ x.msg }}</text>
								<template v-if="x.type == 1">
									<text style="color: #838383; font-size: 22rpx; margin-top: 15rpx;">你可以这样问我:</text>
									<text @click="answer(index)" style="margin-top: 30rpx;"
										v-for="(item, index) in x.questionList" :key="index">{{ item }}</text>
								</template>
								<template v-else-if="x.type == 2">
									<text style="color: #838383; font-size: 22rpx; margin-top: 15rpx;">猜你想问:</text>
									<text @click="answer(index)" style="margin-top: 30rpx;"
										v-for="(item, index) in x.questionList" :key="index">{{ item }}</text>
								</template>
								<template v-else>
									<text class="padding-top-sm" style="color: #2fa39b;">提交意见与反馈</text>
									<text
										style="color: #838383; font-size: 22rpx; margin-top: 15rpx;">下面是一些常见问题,您可以点击对应的文字快速获取答案:</text>
									<text @click="answer(index)" style="margin-top: 30rpx; color: #2fa39b;"
										v-for="(item, index) in x.questionList" :key="index">{{ item }}</text>
								</template>
							</view>
						</view>
					</view>
				</view>
				<view v-show="msgLoad" class="flex-row-start margin-left margin-top">
					<view class="chat-img flex-row-center">
						<image style="height: 75rpx; width: 75rpx;" src="@/static/image/robt.png" mode="aspectFit">
						</image>
					</view>
					<view class="flex" style="width: 500rpx;">
						<view class="margin-left padding-chat flex-column-start"
							style="border-radius: 35rpx; background-color: #f9f9f9;">
							<view class="cuIcon-loading turn-load" style="font-size: 35rpx; color: #3e9982;"></view>
						</view>
					</view>
				</view>
				<view style="height: 120rpx;"></view>
			</view>
		</scroll-view>

		<view class="flex-column-center" style="position: fixed; bottom: -180px;" :animation="animationData">
			<view class="bottom-dh-char flex-row-around" style="font-size: 55rpx;">
				<input v-model="msg" class="dh-input" type="text" style="background-color: #f0f0f0;" @confirm="sendMsg"
					confirm-type="search" placeholder-class="my-neirong-sm" placeholder="用一句简短的话描述您的问题" />
				<view @click="sendMsg" class="cu-tag bg-cyan round">发送</view>
				<text @click="ckAdd" class="cuIcon-roundaddfill text-brown"></text>
			</view>
			<view class="box-normal flex-row-around flex-wrap">
				<view class="tb-text">
					<view class="cuIcon-form"></view>
					<text>问题反馈</text>
				</view>
				<view class="tb-text">
					<view class="cuIcon-form"></view>
					<text>人工客服</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		onMounted,
		reactive
	} from 'vue';

	export default {
		setup() {
			const state = reactive({
				msgLoad: false,
				anData: {},
				animationData: {},
				showTow: false,
				msgList: [{
					my: false,
					msg: "你好我是客服机器人娜娜,请问有什么问题可以帮助您?(问候模板)",
					type: 1,
					questionList: ["如何注销用户", "我想了解业务流程", "手机号如何更换"]
				}],
				msg: "",
				go: 0,
				srcollHeight: 0
			});

			const sendMsg = () => {
				if (state.msg === "") return;

				state.msgList.push({
					"msg": state.msg,
					"my": true
				});
				msgGo();
				msgKf(state.msg);
				state.msg = "";
			};

			const msgGo = () => {
				const query = uni.createSelectorQuery();
				setTimeout(() => {
					query.select('#okk').boundingClientRect(data => {
						if (data.height - wh > 0) {
							state.go = data.height - wh;
						}
						// ... (省略部分逻辑)
					}).exec();
				}, 100);
			};

			const msgKf = (x) => {
				state.msgLoad = true;
				setTimeout(() => {
					state.msgLoad = false;
					state.msgList.push({
						my: false,
						msg: "娜娜还在学习中,没能明白您的问题,请点击下方提交反馈与问题，我们会尽快人工处理。",
						type: 0,
						questionList: ["如何注销用户", "我想了解业务流程", "手机号如何更换"]
					});
					msgGo();
				}, 2000);
			};

			const answer = (id) => {
				console.log(id);
			};

			const hideKey = () => {
				uni.hideKeyboard();
			};

			const ckAdd = () => {
				if (!state.showTow) {
					upTowmn(-180, 350);
				} else {
					upTowmn(0, 200);
				}
				state.showTow = !state.showTow;
			};

			const upTowmn = (x, t) => {
				const animation = uni.createAnimation({
					duration: t,
					timingFunction: 'ease',
				});
				state.animation = animation;
				animation.translateY(x).step();
				state.animationData = animation.export();
			};


			onMounted(() => {
				const query = getSystemInfoSync();
				l.value = query.screenWidth / 750;
				wh.value = query.windowHeight;
				state.srcollHeight = `${query.windowHeight}px`;
			});
			return {
				...state,
				sendMsg,
				answer,
				hideKey,
				ckAdd,
				upTowmn,
			};
		}
	};
</script>

<style>
	.bottom-dh-char {
		background-color: #f9f9f9;
		width: 750rpx;
		height: 110rpx;
	}

	.center-box {
		width: 720rpx;
		padding-left: 25rpx;
	}

	.hui-box {
		width: 750rpx;
		height: 100%;
	}

	.dh-input {
		width: 500rpx;
		height: 65rpx;
		border-radius: 30rpx;
		padding-left: 15rpx;
		background-color: #FFFFFF;
	}

	.box-normal {
		width: 750rpx;
		height: 180px;
		background-color: #FFFFFF;
	}

	.tb-text view {
		font-size: 65rpx;
	}

	.tb-text text {
		font-size: 25rpx;
		color: #737373;
	}

	.chat-img {
		border-radius: 50%;
		width: 100rpx;
		height: 100rpx;
		background-color: #f7f7f7;
	}

	.padding-chat {
		padding: 17rpx 20rpx;
	}

	.tb-nv {
		width: 50rpx;
		height: 50rpx;
	}
</style>