import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from "@/utils/auth"


const requests = axios.create({
    baseURL: '/',
    timeout: 5000
})

// 请求拦截
requests.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['token'] = getToken()
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
        const res = response.data
        if (res.meta.status != 200) {
            Message({
                message: res.meta.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject('状态码：' + res.meta.status)
        }
        else {
            return res
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