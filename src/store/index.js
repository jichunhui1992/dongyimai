import { createStore } from 'vuex'
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cart,
    category,
    user
  },
  plugins:
    [createPersistedState({
      key: 'dongyimaitoken',
      paths: ['user', 'cart']
    })]

})
