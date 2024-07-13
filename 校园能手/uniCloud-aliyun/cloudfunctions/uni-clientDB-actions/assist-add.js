module.exports = {
	before: async (state, event) => {
		var date = new Date(),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
			minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
			second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		month >= 1 && month <= 9 ? (month = "0" + month) : "";
		day >= 0 && day <= 9 ? (day = "0" + day) : "";
		var timer = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
		const outTradeNo = timer + Math.round(Math.random() * (999999 - 111111) + 111111);
		state.newData.order_id=outTradeNo
	},
	after: async (state, event, error, result) => {
		if (error) {
			throw error
		}
		return result
	}
}
