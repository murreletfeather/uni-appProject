// 用户收藏帖子
const db = uniCloud.database()
const dbCmd = db.command
const dbassist = db.collection('mdsh-discover-content') //帖子
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if(state.newData.cid){
			await dbassist.where({
				_id: state.newData.cid
			}).update({
				collect_num: dbCmd.inc(1)
			})
		}
		
		if (error) {
			throw error
		}
		return result
	}
}
