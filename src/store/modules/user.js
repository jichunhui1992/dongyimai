export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        mobile: '',
        token: '',
        account: ''
      }

    }
  },
  mutations: {
    setUser (state, payload) {
      state.profile = payload
    }
  }
}
