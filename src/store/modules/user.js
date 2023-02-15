import { reqAddUser, reqGetUserList, reqLogin, reqUserStateChanged } from '@/api/user'
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
    }
}
const state = {
    userInfo: {},
    token: getToken(),
    userList: {}
}

export default {
    state,
    mutations,
    actions
}