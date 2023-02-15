import { reqAddUser, reqEditUser, reqGetUserById, reqGetUserList, reqLogin, reqRemoveUserById, reqUserStateChanged } from '@/api/user'
import { getToken, setToken, clearSessionStorage } from '@/utils/auth'

const actions = {
    async login({ commit }, loginInfo) {
        let result = await reqLogin(loginInfo)
        if (result.meta.status == 200) {
            commit('LOGIN', result.data)
            // 保存token
            setToken(result.data.token)
        }
    },
    // 退出登录
    logout({ commit }) {
        return new Promise((resolve) => {
            clearSessionStorage()
            commit('RESET_STATE')
            resolve()
        })
    },
    // 获取用户列表
    async getUserList({ commit }, qureyInfo) {
        let result = await reqGetUserList(qureyInfo)
        if (result.meta.status == 200) {
            commit('GETUSERLIST', result.data)
        }
    },
    // 用户状态改变
    async userStateChanged({ commit }, idState) {
        await reqUserStateChanged(idState)
    },
    // 添加用户
    async addUser({ commit }, addForm) {
        await reqAddUser(addForm)
    },
    // 根据id获取用户
    async getUserById({ commit }, id) {
        let result = await reqGetUserById(id)
        commit('GETUSERBYID', result.data)
    },
    // 修改用户
    async editUser({ commit }, data) {
        await reqEditUser(data)
    },
    // 删除用户
    async removeUserById({ commit }, id) {
        await reqRemoveUserById(id)
    }
}
const mutations = {
    LOGIN: (state, userInfo) => {
        state.userInfo = userInfo
        state.token = userInfo.token
    },
    //重置state
    RESET_STATE: (state) => {
        Object.assign(state)
    },
    GETUSERLIST: (state, userList) => {
        state.userList = userList
    },
    GETUSERBYID: (state, userById) => {
        state.userById = userById
    }
}
const state = {
    userInfo: {},
    token: getToken(),
    userList: {},
    userById: {}
}

export default {
    state,
    mutations,
    actions
}