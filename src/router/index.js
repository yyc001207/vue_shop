import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from "@/views/Home";
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },// 重定向
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]
const router = new VueRouter({
  routes
})

export default router
