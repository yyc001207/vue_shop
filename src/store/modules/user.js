import { reqLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

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
    logout({ commit, state }) {
        return new Promise((resolve) => {
            removeToken()
            commit('RESET_STATE')
            resolve()
        })
    },
}
const mutations = {
    LOGIN: (state, userInfo) => {
        state.userInfo = userInfo
    },
    //重置state
    RESET_STATE: (state) => {
        Object.assign(state)
    },
}
const state = {
    userInfo: {}
}

export default {
    state,
    mutations,
    actions
}