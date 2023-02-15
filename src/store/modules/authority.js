import { reqGetMenuList } from "@/api/authority"

const actions = {
    // 获取左侧菜单
    async getMenuList({ commit }) {
        let result = await reqGetMenuList()
        if (result.meta.status == 200) {
            commit('GETMENULIST', result.data)
        }
    }
}
const mutations = {
    GETMENULIST(state, menuList) {
        state.menuList = menuList
    }
}
const state = {
    menuList: []
}
export default {
    actions,
    mutations,
    state
}