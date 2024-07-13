// 管理员审核申请单
const db = uniCloud.database()
const dbCmd = db.command
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		var formdata=event.command.$db[2].$param[0];
		if(formdata.status==2){
			var info = await db.collection('mdsh-user-apply').where({
				_id: event.command.$db[1].$param[0]._id
			}).get();
			if(info.data.length==1){
				var apply=info.data[0];
				if(apply.status==2){
					if(apply.type==1){//业务员
						await db.collection("uni-id-users").where({
							_id:apply.uid
						}).update({
							is_assist:true,
							mobile:apply.phone,
							real_name:apply.real_name,
							college:apply.college,
							major:apply.major,
							grade:apply.grade
						})
						
						uniCloud.callFunction({
							name: "template",
							data: {
								funct: "NotificationOfAuditResults",
								id: apply._id
							}
						}).then((err)=>{
							
						}) 
					}else{
						await db.collection("mdsh-store").add({
							school_id:apply.school_id,
							name:apply.store_name,
							cover:'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ad262787-dade-474e-b9c6-8f8330817a02/22c1346b-5275-4870-bb29-b3fb24b08bec.png',
							dis:apply.store_name,
							shopkeeper:apply.real_name,
							phone:apply.phone,
							address:apply.address,
							status:2,
							notice:'',
							wx:'',
							wx_code:'',
							delivery_price:'0',
							rate:0.02,
							score:10,
							is_recommend:false,
							is_currency:false,
							create_date:new Date(),
						}).then((res) => {
							db.collection("uni-id-users").where({
								_id:apply.uid
							}).update({
								store_id:res.id,
								mobile:apply.phone,
								real_name:apply.real_name,
								college:apply.college,
								major:apply.major,
								grade:apply.grade
							})
							
							uniCloud.callFunction({
								name: "template",
								data: {
									funct: "NotificationOfAuditResults",
									id: apply._id
								}
							}).then((err)=>{
								
							}) 
						})
					}
					
					 
				}
			}
		}
		
		if (error) {
			throw error
		}
		return result
	}
}
