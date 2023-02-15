import request from '@/utils/request'

export function reqGetMenuList() {
    return request({
        url: '/menus',
        method: 'get',
    })
}