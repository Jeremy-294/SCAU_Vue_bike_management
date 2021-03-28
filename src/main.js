import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// ����ȫ����ʽ��
import './assets/css/global.css'
// ��������ͼ��
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
// ���븻�ı��༭��
import VueQuillEditor from 'vue-quill-editor'
//���ı��༭����ʽ
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// ����NProgress��Ӧ��css��js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// ����axios
import axios from 'axios'
// ��������ĸ�·��
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// ��request �������� չʾ������ NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // ��������return config
  return config
})

//��response �������� ���ؽ����� NProgress.done()
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
// �����ı��༭��ע��Ϊȫ�ֿ��õ����
Vue.use(VueQuillEditor )


Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes() +'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}) 


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
