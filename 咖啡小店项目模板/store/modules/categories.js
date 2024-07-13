export default {
    state: {
		categories: [
			{
				id: 1,
				name: '浓情咖啡',
				icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/b72fe298-1f2a-4a17-93ca-bb8f5e608d12.svg',
				total: 23,
			},
			{
				id: 2,
				name: '烘焙轻食',
				icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/f2488c24-6065-4478-98f8-0946f78c5e69.svg',
				total: 23,
			},
			{
				id: 3,
				name: '沁心冰饮',
				icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/d4f92d44-ce4a-4ead-b3b8-127a357d06e1.svg',
				total: 23,
			},
			{
				id: 4,
				name: '甜品小点',
				icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c21a4852-61be-4703-aaf4-fcbe9074012c/9039019d-03f3-45f0-97ed-d68249f96b70.svg',
				total: 23,
			}
		]
	},
    getters: {
		getCategoryById: (state) => (id) => {
			return state.categories.find(item=>item.id == id)
		}
    },
    mutations: {

    },
    actions: { 

    }
}