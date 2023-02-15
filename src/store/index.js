import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import authority from './modules/authority'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        authority,
    },
    getters
})

export default store
