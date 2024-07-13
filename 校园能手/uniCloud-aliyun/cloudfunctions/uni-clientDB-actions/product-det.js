// 商品详情 店铺
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if (error) {
			throw error
		}
		let info = result.data[0]
		if(info){
			let arr=[]
			let cov=[]
			let cover=''
			let images=info.images
			images.forEach((img,index) => {
				let aerrc={
					name:index,
					extname:index,
					url:images[index]
				}
				arr.push(aerrc)
			})
			result.data[0].images=arr
			let aerrd={
				name:1,
				extname:1,
				url:info.cover
			}
			cov.push(aerrd)
			result.data[0].cover=cov
		}
		return result
	}
}
