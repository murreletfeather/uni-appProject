// 用户提交申请单子
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		var id;
		if(result.id){
			id=result.id
		}else{
			var formdata=event.command.$db[1].$param[0];
			id=formdata._id
		}
		
		await uniCloud.callFunction({
			name: "template",
			data: {
				funct: "NoticeToBeReviewedAdmin",
				id: id
			}
		}).then((err)=>{
			
		}) 
		if (error) {
			throw error
		}
		return result
	}
}
