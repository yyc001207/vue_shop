import { reqGetCateById, reqGetCateList, reqRemoveCateById, reqUpdateCateNameById, reqAddCate, reqGetParamsList, reqRemoveParams, reqAddParams, reqEditParams } from "@/api/goods"

const actions = {
    // 获取商品分类列表
    async getCateList({ commit }, data) {
        let result = await reqGetCateList(data)
        commit('GETCATELIST', result.data)
    },
    // 根据id删除分类
    async removeCateById({ commit }, id) {
        await reqRemoveCateById(id)
    },
    // 根据id查找分类
    async getCatNameById({ commit }, id) {
        let result = await reqGetCateById(id)
        commit('GETCATNAMEBYID', result.data)
    },
    // 修改分类
    async editCatName({ commit }, data) {
        await reqUpdateCateNameById(data)
    },
    // 新增分类
    async addCate({ commit }, data) {
        await reqAddCate(data)
    },
    // 参数列表
    async getParamsList({ commit }, data) {
        let result = await reqGetParamsList(data)
        commit('GETPARAMSLIST', result.data)
    },
    // 删除参数
    async removeParams({ commit }, data) {
        await reqRemoveParams(data)
    },
    // 添加参数
    async addParams({ commit }, data) {
        await reqAddParams(data)
    },
    // 修改参数
    async editParams({ }, data) {
        await reqEditParams(data)
    }
}

const mutations = {
    // 获取商品列表
    GETCATELIST(state, cateList) {
        if (!(cateList instanceof Array)) {
            // 给每一个商品分类添加一个index方便展示序号
            setIndex(cateList.result)
        }
        state.cateList = cateList
    },
    // 根据id获取商品分类
    GETCATNAMEBYID(state, catNameById) {
        state.catNameById = catNameById
    },
    // 获取分类参数
    GETPARAMSLIST(state, paramsData) {
        if (state.paramsData.length) {
            state.paramsData = []
        }
        paramsData.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            item.inputVisible = false
            item.inputValue = ''
        })
        state.paramsData = paramsData
    }

}
// 给每一个商品分类添加一个index方便展示序号
function setIndex(arr) {
    arr.forEach((item, index) => {
        item.index = index + 1
        if (!item.children) {
            return
        } else {
            setIndex(item.children)
        }
    })
}
const state = {
    cateList: [],
    catNameById: {},
    paramsData: []
}

export default {
    actions,
    mutations,
    state
}