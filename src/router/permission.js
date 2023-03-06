import router from "./index";
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import nProgress from "nprogress"

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
    nProgress.start()
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            Message({
                message: '请勿重复登录',
                type: 'warning'
            })
            next({ path: `${from.path}` })
            nProgress.done()
        } else {
            if (to.path == '/welcome') {
                window.sessionStorage.removeItem('activePath')
            }
            next()
            nProgress.done()
        }
    }
    else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
            nProgress.done()
        } else {
            next(`/login?redirect=${to.path}`)
            nProgress.done()
            Message({
                message: '请先登录',
                type: 'warning'
            })
        }
    }
})

router.afterEach(() => {
    nProgress.done()
})