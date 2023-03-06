import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from "@/utils/auth"
import nProgress from "nprogress"

const requests = axios.create({
    baseURL: '/api/private/v1',
    timeout: 5000
})

// 请求拦截
requests.interceptors.request.use(

    config => {
        nProgress.start()
        if (store.getters.token) {
            config.headers.Authorization = getToken()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
requests.interceptors.response.use(
    response => {
        nProgress.done()
        const res = response.data
        if (res.meta.status == 200 || res.meta.status == 201) {
            return res
        }
        else {
            Message({
                message: res.meta.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject('状态码：' + res.meta.status)
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)
export default requests