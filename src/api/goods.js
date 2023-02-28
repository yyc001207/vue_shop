import request from '@/utils/request'

export const reqGetCateList = (data) => request({ url: 'categories', method: 'get', params: data })

export const reqGetCateListType2 = (data) => request({ url: 'categories', method: 'get', params: data })

export const reqRemoveCateById = (id) => request({ url: `categories/${id}`, method: 'delete' })

export const reqGetCateById = (id) => request({ url: `categories/${id}`, method: 'get' })

export const reqUpdateCateNameById = ({ id, cat_name }) => request.put(`categories/${id}`, { cat_name })

export const reqAddCate = (data) => request({ url: 'categories', data, method: 'post' })