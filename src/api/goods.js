import request from '@/utils/request'
// 获取商品分类列表
export const reqGetCateList = (data) => request({ url: 'categories', method: 'get', params: data })

// 根据id删除分类
export const reqRemoveCateById = (id) => request({ url: `categories/${id}`, method: 'delete' })

// 根据id查找分类
export const reqGetCateById = (id) => request({ url: `categories/${id}`, method: 'get' })

// 修改分类
export const reqUpdateCateNameById = ({ id, cat_name }) => request.put(`categories/${id}`, { cat_name })

// 新增分类
export const reqAddCate = (data) => request({ url: 'categories', data, method: 'post' })

// 获取参数列表
export const reqGetParamsList = (data) => request({ url: `categories/${data.id}/attributes`, params: { sel: data.sel }, method: 'get' })

// 删除分类参数
export const reqRemoveParams = (data) => request({ url: `categories/${data.cat_id}/attributes/${data.attr_id}`, method: 'delete' })

// 添加参数
export const reqAddParams = (data) => request({ url: `categories/${data.id}/attributes`, data, method: 'post' })

// 修改参数
export const reqEditParams = (data) => request({ url: `categories/${data.id}/attributes/${data.attrId}`, method: 'put', data })