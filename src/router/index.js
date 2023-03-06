import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/Welcome')

const Users = () => import(/* webpackChunkName: "Users_AuthorityList_Roles" */ '@/views/user/Users')
const AuthorityList = () => import(/* webpackChunkName: "Users_AuthorityList_Roles" */ '@/views/authority/AuthorityList')
const Roles = () => import(/* webpackChunkName: "Users_AuthorityList_Roles" */ '@/views/authority/Roles')

const Categories = () => import(/* webpackChunkName: "Categories_Params" */ '@/views/goods/Categories')
const Params = () => import(/* webpackChunkName: "Categories_Params" */ '@/views/goods/Params')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },// 重定向
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome', component: Welcome,
      },
      { path: '/users', component: Users },
      { path: '/rights', component: AuthorityList },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
    ]
  }
]
const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
