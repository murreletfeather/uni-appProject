//商铺主页
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if (error) {
			throw error
		}
		
		let arr = result.data;
		let arr1=[]
		let list=arr.reduce((pre,cur)=>{
		  let target=pre.find(ee=>ee._id == cur.cate_id[0]._id)
		  if(target){
		    target.prod.push(cur)
		  }else{
		    pre.push({
				_id:cur.cate_id[0]._id,
				name:cur.cate_id[0].name,
				prod:[
					cur
				]})
		  }
		  return pre
		},arr1)
		result.data=list
		return result
	}
}
