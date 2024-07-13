// 业务员接单
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		var formdata=event.command.$db[1].$param[0];
		await uniCloud.callFunction({
			name: "template",
			data: {
				funct: "HelperReceivingNotice",
				id: formdata._id
			}
		}).then((err)=>{
			
		}) 
		if (error) {
			throw error
		}
		return result
	}
}
