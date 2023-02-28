import request from '@/utils/request'
// 获取商品分类列表
export const reqGetCateList = (data) => request({ url: 'categories', method: 'get', params: data })

// 获取商品至二级分类列表
export const reqGetCateListType2 = (data) => request({ url: 'categories', method: 'get', params: data })

// 根据id删除分类
export const reqRemoveCateById = (id) => request({ url: `categories/${id}`, method: 'delete' })

// 根据id查找分类
export const reqGetCateById = (id) => request({ url: `categories/${id}`, method: 'get' })

// 修改分类
export const reqUpdateCateNameById = ({ id, cat_name }) => request.put(`categories/${id}`, { cat_name })

// 新增分类
export const reqAddCate = (data) => request({ url: 'categories', data, method: 'post' })