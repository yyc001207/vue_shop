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

// 根据id获取用户
export const reqGetUserById = (id) => request({ url: `users/${id}`, method: 'get' })

// 修改用户
export const reqEditUser = (data) => request({ url: `users/${data.id}`, data, method: 'put' })

// 删除用户
export const reqRemoveUserById = (id) => request({ url: `users/${id}`, method: 'delete' })
