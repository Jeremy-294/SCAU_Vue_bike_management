import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children:[
      { path:'/welcome', component: Welcome },
      { path:'/users' , component:Users },
      { path:'/rights', component:Rights },
      { path:'/roles', component:Roles },
      { path:'/categories', component:Cate },
      { path:'/params', component:Params }

    ] 
  }
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
