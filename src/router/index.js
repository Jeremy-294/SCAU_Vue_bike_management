import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "user_right_roles" */ '../components/user/users.vue')
const Rights = () => import(/* webpackChunkName: "user_right_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user_right_roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "goodslist_add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "goodslist_add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')



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
      { path:'/params', component:Params },
      { path:'/goods',component:GoodsList },
      { path:'/goods/add',component:Add },
      { path:'/orders',component:Order },
      { path:'/reports',component:Report }

    ] 
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) => {
  // to 将要跳转的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行
  //   next()放行
  //   next('/login') 强制跳转

  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token不存在 即没有登录  则跳转到login
  if(!tokenStr) return next('/login')
  next()
})

export default router
