import router from "./index";
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            Message({
                message: '请勿重复登录',
                type: 'warning'
            })
            next({ path: `${from.path}` })
        } else {
            if (to.path == '/welcome') {
                window.sessionStorage.removeItem('activePath')
            }
            next()
        }
    }
    else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            Message({
                message: '请先登录',
                type: 'warning'
            })
        }
    }
})