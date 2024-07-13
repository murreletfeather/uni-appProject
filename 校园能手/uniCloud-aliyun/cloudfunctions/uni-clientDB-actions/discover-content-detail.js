// 圈子详情
const db = uniCloud.database()
const dbCmd = db.command
const dbdis = db.collection('mdsh-discover') //圈子
const dbcon = db.collection('mdsh-discover-content') //内容
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if(result.data._id){
			await dbcon.where({
				_id: result.data._id
			}).update({
				view: dbCmd.inc(1)
			})
		}
		
		if (error) {
			throw error
		}
		return result
	}
}
