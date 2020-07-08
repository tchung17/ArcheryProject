import Vue from 'vue'
import store from './store/store.js';
import router from './router'

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';


import App from './App.vue';
import VueClipboard from 'vue-clipboard2';
import { firestorePlugin } from 'vuefire';

Vue.use(firestorePlugin)
Vue.use(VueClipboard)
Vue.use(ElementUI, { locale });

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
