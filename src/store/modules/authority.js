import { reqAddRole, reqRemoveRoleById, reqEditRole, reqGetAuthorityList, reqGetMenuList, reqGetRoleById, reqGetRolesList, reqRemoveRightById, reqGetAuthorityTree, reqUpdateRight } from "@/api/authority"

const actions = {
    // 获取左侧菜单
    async getMenuList({ commit }) {
        let result = await reqGetMenuList()
        if (result.meta.status == 200) {
            commit('GETMENULIST', result.data)
        }
    },
    // 获取权限列表
    async getAuthorityList({ commit }) {
        let result = await reqGetAuthorityList()
        commit('GETAUTHORITYLIST', result.data)
    },
    async getAuthorityTree({ commit }) {
        let result = await reqGetAuthorityTree()
        commit('GETAUTHORITYTREE', result.data)
    },
    // 获取角色列表
    async getRolesList({ commit }) {
        let result = await reqGetRolesList()
        commit("GETROLESLIST", result.data)
    },
    // 删除id对应的角色
    async removeRoleById({ commit }, id) {
        await reqRemoveRoleById(id)
    },
    //添加角色 
    async addRole({ commit }, data) {
        await reqAddRole(data)
    },
    // 修改角色
    async editRole({ commit }, data) {
        await reqEditRole(data)
    },
    // 根据id获取角色
    async getRoleById({ commit }, id) {
        let result = await reqGetRoleById(id)
        commit("GETROLEBYID", result.data)
    },
    // 根据角色和权限id删除权限，接受返回值
    async removeRightById({ commit }, id) {
        let result = await reqRemoveRightById(id)
        commit('UPDATERIGHTBYID', result.data)
    },
    // 根据角色id分配权限
    async updateRight({ commit }, data) {
        await reqUpdateRight(data.roleId, data.idStr)
    }
}
const mutations = {
    GETMENULIST(state, menuList) {
        state.menuList = menuList
    },
    GETAUTHORITYLIST(state, authorityList) {
        state.authorityList = authorityList
    },
    GETROLESLIST(state, rolesList) {
        state.rolesList = rolesList
    },
    GETROLEBYID(state, role) {
        state.roleById = role
    },
    UPDATERIGHTBYID(state, rightById) {
        state.rightById = rightById
    },
    GETAUTHORITYTREE(state, authorityTree) {
        state.authorityTree = authorityTree
    }
}
const state = {
    menuList: [],
    authorityList: [],
    authorityTree: [],
    rolesList: [],
    roleById: {},
    rightById: {}
}
export default {
    actions,
    mutations,
    state
}