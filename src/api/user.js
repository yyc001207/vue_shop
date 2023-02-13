//引入axios（axios进行了二次封装）
import request from '@/utils/request'

//对外暴露的登录接口函数
export function reqLogin(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
