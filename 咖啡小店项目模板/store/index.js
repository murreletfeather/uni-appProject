import Vue from 'vue';
import Vuex from 'vuex';

import products from '@/store/modules/products';
import categories from '@/store/modules/categories';
import home from '@/store/modules/home';
import user from '@/store/modules/user';

import stores from '@/store/states/stores';

Vue.use(Vuex);
export default new Vuex.Store({
	modules: { products, categories, home, user },
    state: {
		stores
	}
})