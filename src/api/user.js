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

// 获取用户列表
export function reqGetUserList(qureyInfo) {
  return request({
    url: '/users',
    method: 'get',
    params: qureyInfo
  })
}

// 修改用户状态
export function reqUserStateChanged({ id, mg_state }) {
  return request({
    url: `users/${id}/state/${mg_state}`,
    method: 'put'
  })
}

// 添加用户
export const reqAddUser = (data) => request({ url: 'users', method: 'post', data })
