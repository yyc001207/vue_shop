import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import '@/assets/css/global.css'
// 引入vuex状态管理工具
import store from '@/store'
// 引入导航守卫
import "@/router/permission"

import '@/assets/fonts/iconfont.css'

// 注册全局组件
import Dialog from '@/components/Dialog'
Vue.component(Dialog.name, Dialog)

import Breadcrumb from '@/components/Breadcrumb'
Vue.component(Breadcrumb.name, Breadcrumb)

Vue.config.productionTip = false
Vue.config.devtools = true;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
