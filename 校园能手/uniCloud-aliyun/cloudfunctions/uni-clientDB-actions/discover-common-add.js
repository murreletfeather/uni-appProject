// 评论发布
const db = uniCloud.database()
const dbCmd = db.command
const dbdis = db.collection('mdsh-discover') //圈子
const dbcon = db.collection('mdsh-discover-content') //内容
module.exports = {
	before: async (state, event) => {
		if(state.newData.content==''){
			throw new Error("请输入评论内容") 
		}
		var text= await uniCloud.callFunction({
			name: "discover",
			data: {
				funct: "textSecCheckRes",
				content: state.newData.content
			}
		})
		if(text.result.code==-2){
			throw new Error(text.result.message) 
		}
	},
	after: async (state, event, error, result) => {
		// var formdata=event.command.$db[1].$param[0];
		var dis=await dbcon.where({
			_id: state.newData.cid
		}).get()
		if (dis.data.length == 1) {
			await dbdis.where({
				_id: dis.data[0]._id
			}).update({
				common_num: dbCmd.inc(1)
			})
			
			if(dis.data[0].avatar.length<=10 && dis.data[0].avatar.indexOf(state.newData.avatar)== -1){
				await dbcon.where({
					_id: state.newData.cid
				}).update({
					avatar: dbCmd.push(state.newData.avatar),
					common_num: dbCmd.inc(1)
				})
			}else{
				await dbcon.where({
					_id: state.newData.cid
				}).update({
					common_num: dbCmd.inc(1)
				})
			}
		}
		// await uniCloud.callFunction({
		// 	name: "template",
		// 	data: {
		// 		funct: formdata.pid ? "CommentReplyNotice" : "NewCommentReminder",
		// 		id: result.id
		// 	}
		// }).then((err)=>{
			
		// }) 
		
		if (error) {
			throw error
		}
		return result
	}
}
