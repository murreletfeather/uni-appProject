// 圈子发布
const db = uniCloud.database()
const dbCmd = db.command
const dbdis = db.collection('mdsh-discover') //圈子
const dbcon = db.collection('mdsh-discover-content') //内容
module.exports = {
	before: async (state, event) => {
		// var images = [];
		// var info;
		// if (state.newData.images.length) {
		// 	var res = await uniCloud.callFunction({
		// 		name: "discover",
		// 		data: {
		// 			funct: "imgSecCheckRes",
		// 			imgs: state.newData.images
		// 		}
		// 	})
		// 	state.newData.images = res.result.data
		// }
		// if (state.newData.content == '') {
		// 	throw new Error("请输入发布内容")
		// }
		// var text = await uniCloud.callFunction({
		// 	name: "discover",
		// 	data: {
		// 		funct: "textSecCheckRes",
		// 		content: state.newData.content
		// 	}
		// })
		// if (text.result.code == -2) {
		// 	throw new Error(text.result.message)
		// }
	},
	after: async (state, event, error, result) => {
		var formdata=event.command.$db[1].$param[0];
		function spl(str) {
			var str = str.replace(/＃/g, '#')
			var first = str.indexOf('#');
			var second = str.replace('#', '@').indexOf('#');
			var Gettopic = str.slice(first + 1, second);
			var GetContent = str.slice(second + 1);
			return first == -1 || second == -1 ? {
				content: str,
				topic: ''
			} : {
				content: GetContent,
				topic: Gettopic
			}
		}
		var topic = spl(formdata.content)
		if(topic.content==''){
			throw new Error("请输入发布内容")
		}
		if (topic.topic) {
			var res = await dbdis.where({
				name: topic.topic
			}).get();

			if (res.data.length == 0) {
				var htid = await dbdis.add({
					name: topic.topic,
					status: true,
					sort: 0,
					cover: '',
					is_best: false,
					description:topic.topic,
					is_anonymous: true,
					is_comment: true,
					topic_num: 1,
					common_num: 0,
					uid: state.auth.uid,
					backgroundImage:''
				})
				if (htid.id) {
					await dbcon.where({
						_id: result.id
					}).update({
						cid: htid.id,
						content:topic.content
					})
				}
			}else{
				await dbdis.where({
					_id: res.data[0]._id
				}).update({
					topic_num: dbCmd.inc(1)
				})
				await dbcon.where({
					_id: result.id
				}).update({
					cid: res.data[0]._id,
					content:topic.content
				})
			}
			
			await uniCloud.callFunction({
				name: "template",
				data: {
					funct: "NewPostPostingReminder",
					id: result.id
				}
			}).then((err)=>{
				
			}) 
		}
		if (error) {
			throw error
		}
		return result
	}
}
