import { reqGetCateById, reqGetCateList, reqRemoveCateById, reqUpdateCateNameById, reqGetCateListType2, reqAddCate } from "@/api/goods"

const actions = {
    // 获取商品分类列表
    async getCateList({ commit }, data) {
        let result = await reqGetCateListType2(data)
        commit('GETCATELIST', result.data)
    },
    // 获取商品至二级分类列表
    async getCateListType2({ commit }, data) {
        let result = await reqGetCateList(data)
        commit('GETCATELISTTYPE2', result.data)
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
    }
}

const mutations = {
    // 获取商品列表
    GETCATELIST(state, cateList) {
        // 给每一个商品分类添加一个index方便展示序号
        setIndex(cateList.result)
        state.cateList = cateList
    },
    // 根据id获取商品分类
    GETCATNAMEBYID(state, catNameById) {
        state.catNameById = catNameById
    },
    // 获取商品至二级分类列表
    GETCATELISTTYPE2(state, cateListType2) {
        state.cateListType2 = cateListType2
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
    cateList: {},
    catNameById: {},
    cateListType2: []
}

export default {
    actions,
    mutations,
    state
}