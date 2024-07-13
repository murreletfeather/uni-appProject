// 添加好友
const db = uniCloud.database()
const dbCmd = db.command
const dbfriend = db.collection('mdsh-friend') //好友关注
const dbusers = db.collection('uni-id-users') //用户
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		let num=0;
		if(state.type=="create"){
			num=1;
		}else{
			num=-1;
		}
		dbusers.where({
			_id: state.newData.uid
		}).update({
			friend_num:dbCmd.inc(num)
		})
		if (error) {
			throw error
		}
		return result
	}
}
