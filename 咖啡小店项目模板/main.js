import App from './App';

// ------------------VUE2-------------//
// #ifndef VUE3
import Vue from 'vue';
import store from './store';

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
	store,
    ...App
})

app.$mount()
// #endif
// ------------------VUE2-------------//


// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif