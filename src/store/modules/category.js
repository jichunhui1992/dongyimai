import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'
export default {
  namespaced: true,
  state () {
    return {
      List: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, payload) {
      state.List = payload
    },
    // 控制当前分类下的二级分类的显示和隐藏
    show (state, item) {
      const category = state.List.find(category => category.id === item.id)
      category.open = true
    },
    // 修改当前一级分类下的open数据为false
    hide (state, item) {
      const category = state.List.find(category => category.id === item.id)
      category.open = false
    }
  },
  actions: {
    async getList (context) {
      const data = await findAllCategory()
      // 遍历数组添加open属性
      data.result.forEach(item => {
        item.open = false
      })
      context.commit('setList', data.result)
    }
  }
}
