// 跑腿详情
const db = uniCloud.database()
const dbCmd = db.command
const dbassist = db.collection('mdsh-assist') //跑腿
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if(result.data._id){
			await dbassist.where({
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
