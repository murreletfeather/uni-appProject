// 上次启动时的用户信息
let userInfoHistory = uni.getStorageSync('userInfo') || {};
let state = {
		//是否已经登录
		hasLogin: Boolean(Object.keys(userInfoHistory).length),
		//用户信息
		info: userInfoHistory
	},
	getters = {
		info(state) {
			return state.info;
		},
		hasLogin(state){
			return state.hasLogin;
		}
	},
	mutations = {
		login(state, info) { //登录成功后的操作
			//原有的结合传来的参数
			// let _info = state.info;
			// state.info = Object.assign({}, _info, info);
			// //设置为已经登录
			state.info = info.userInfo;
			state.hasLogin = true;
			// console.log(88888);
			// console.log(info);
			// console.log(state.info.userInfo);
			// console.log(state.info);
			//存储最新的用户数据到本地持久化存储
			uni.setStorageSync('userInfo', info.userInfo);
			uni.setStorageSync('uni_id_token', info.token)
			uni.setStorageSync('uni_id_token_expired', info.tokenExpired)
			
		},
		setinfo(state, info) {
			//原有的结合传来的参数
			let _info = state.info;
			state.info = Object.assign({}, _info, info);
			uni.setStorageSync('userInfo', state.info);
		},
		logout(state) {
			state.info = {};
			state.hasLogin = false;
			uni.setStorageSync('userInfo', {});
			uni.setStorageSync('uni_id_token', '');
			uni.setStorageSync('uni_id_token_expired', 0)
		}
	},
	actions = {

	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}