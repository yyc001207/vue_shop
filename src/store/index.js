import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import authority from './modules/authority'
import goods
    from './modules/goods'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        authority,
        goods,
    },
    getters
})

export default store
