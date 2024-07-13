'use strict';

const db = uniCloud.database()
const dbnews = db.collection('mdsh-news')//新闻
const dbnewscate = db.collection('mdsh-news-cate')//新闻分类

exports.main = async (event, context) => {
	var res;
	const apiUrl="http://210.26.0.114:9090/remote";
	
	switch(event.funct){
		case "xbmd-news"://新闻列表
			res = await uniCloud.httpclient.request(apiUrl, {
			    method: 'POST',
			    data: event.data,
			    dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
		break;
		case "xbmd-news-detail"://新闻列表
			let paramsa='{id:"'+event.id+'"}';
			res = await uniCloud.httpclient.request(apiUrl, {
			    method: 'POST',
			    data: {
					method:event.method,
					service:event.service,
					params:paramsa
				},
			    dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
		break;
		case "xbmd-active"://新闻列表
			let params="{status:1,pageNum:"+event.page+",pageSize:10}";
			res = await uniCloud.httpclient.request(apiUrl, {
			    method: 'POST',
			    data:{
					method:'search',
					service:'activityService',
					params:params
				},
			    dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
		break;
		case "news-detail"://新闻详情
			res = await dbnews.where({
				_id:event.id,
				status:true
			}).get()
		break;
	}
	return res.data
};
