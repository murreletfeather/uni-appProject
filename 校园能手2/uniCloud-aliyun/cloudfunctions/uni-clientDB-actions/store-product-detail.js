//商品详情
const db = uniCloud.database()
const dbCmd = db.command
const dbproduct = db.collection('mdsh-store-product') //商品
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if (error) {
			throw new Error("商品不存在或已下架") 
		}
		if(result.data[0]){
			await dbproduct.where({
				_id: result.data[0]._id
			}).update({
				view: dbCmd.inc(1)
			})
		}
		return result
	}
}
