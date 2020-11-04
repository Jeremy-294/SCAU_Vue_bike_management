import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }  
]

const router = new VueRouter({
  routes
})

// ����·�ɵ�������
router.beforeEach((to,from,next) => {
  // to ��Ҫ��ת��·��
  // from ������ĸ�·����ת����
  // next ��һ������ ��ʾ����
  //   next()����
  //   next('/login') ǿ����ת

  if(to.path === '/login') return next();
  // ��ȡtoken
  const tokenStr = window.sessionStorage.getItem('token')
  // ���token������ ��û�е�¼  ����ת��login
  if(!tokenStr) return next('/login')
  next()
})

export default router
