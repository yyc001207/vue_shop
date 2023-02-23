import request from '@/utils/request'

// 左侧菜单栏
export function reqGetMenuList() {
    return request({
        url: '/menus',
        method: 'get',
    })
}

// 获取权限列表
export const reqGetAuthorityList = () => request({ url: 'rights/list', method: 'get' })

// 获取权限树
export const reqGetAuthorityTree = () => request({ url: 'rights/tree', method: 'get' })

// 获取角色列表
export const reqGetRolesList = () => request({ url: '/roles', method: 'get' })

// 删除对应id的角色
export const reqRemoveRoleById = (id) => request({ url: `roles/${id}`, method: 'delete' })

// 添加角色
export const reqAddRole = (data) => request({ url: 'roles', data, method: 'post' })

// 修改角色
export const reqEditRole = (data) => request({ url: `roles/${data.id}`, data, method: 'put' })

// 根据id获取角色
export const reqGetRoleById = (id) => request({ url: `roles/${id}`, method: 'get' })

// 根据角色和权限id删除对应权限
export const reqRemoveRightById = (id) => request({ url: `roles/${id.roleId}/rights/${id.rightId}`, method: 'delete' })

// 根据角色id分配权限
export const reqUpdateRight = (id, rids) => request.post(`roles/${id}/rights`, { rids })
