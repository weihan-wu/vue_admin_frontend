import Vue from 'vue'
import { Message } from 'element-ui'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login = () => import('../views/login')

const routes = [
  {
    name: "Login",
    path: "/login",
    component: Login,
    hidden: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    if (to.path === '/' || to.path === '' || to.path === '/login') {
      document.title = '垃圾分类助手管理系统'
      next('/controller')
    } else {
      document.title = '垃圾分类助手管理系统'
      next()
    }
  } else {
    if (to.path === '/login') {
      document.title = '登录页面'
      next()
    } else {
      document.title = '登录页面'
      next('/login')
      Message('欢迎使用垃圾分类助手后台管理系统，请先登录！')
    }
  }
})

export default router
