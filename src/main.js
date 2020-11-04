import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// ����ȫ����ʽ��
import './assets/css/global.css'
// ��������ͼ��
import './assets/fonts/iconfont.css'
// ����axios
import axios from 'axios'
// ��������ĸ�·��
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
