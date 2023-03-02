import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from "@/views/Home";
import Welcome from '@/views/Welcome'
import Users from '@/views/user/Users'
import AuthorityList from '@/views/authority/AuthorityList'
import Roles from '@/views/authority/Roles'
import Categories from '@/views/goods/Categories'
import Params from '@/views/goods/Params'
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
