const path = require('path')
module.exports = {
	// 微信小程序端对应的微信支付及登录配置配置
	wxConfigMp: {
		appId: 'wx60eeb38ba0432f63',
		secret: 'a94fe98d67d270718fc6830751ed96d5',
		mchId: '1610293723',
		key: 'LTAI4G84JCejs7XGNGKb5sDC22244ddd',
		pfx:'',
	},
	// App端对应的微信支付配置
	wxConfigApp: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 微信PC网站支付
	wxConfigH5: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 支付宝小程序端对应的支付宝支付及登录配置
	aliConfigMp: {
		mchId: "",
		appId: "",
		alipayPublicKey: "",
		privateKey: "",
	},
	// App端对应的支付宝支付配置
	aliConfigApp: {
		mchId: "",
		appId: "",
		alipayPublicKey: "",
		privateKey: "",
	}
}
