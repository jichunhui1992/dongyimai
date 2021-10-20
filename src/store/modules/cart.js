import { findCartList, getNewCartGoods, mergeLocalCart, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  mutations: {

    // 加入购物车，如果内部有相同商品则将商品删除得到数量累加后放在购物车最上面
    insertCart (state, payload) {
      // 如果有相同商品查询数量添加payload之上
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    },
    updateCart (state, goods) {
      // goods中字段不固定
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeLocalCart(cartList)
      // 清空本地购物车
      ctx.commit('setCart', [])
    },
    // 修改规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已经登录
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录

          // 找出 旧的商品信息 删除旧的商品信息 根据新的商品和旧的商品信息 合并成一条新的购物车商品数据 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已经登录
          // debugger
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(goods => {
            ctx.commit('deleteCart', goods.skuId)
          })
          resolve()
        }
      })
    },
    // 全选逻辑
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已经登录
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.getters.validList.forEach(goods => {
            context.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车
    updateCart (context, payload) {
      // payload需要：必需有skuid 可能：selected count
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已经登录
          updateCart(payload).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 删除购物车
    deleteCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已经登录
          deleteCart([payload]).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    }, // 加入购物车
    insertCart (context, payload) {
      // 区分已经登录以及未登录
      // console.log(1212)
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已经登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          findCartList().then(data => {
            context.commit('setCart', data.result)
          })
          resolve()
        } else {
          // 同时发送请求并监听所有请求结束后，更新显示购物车 Promise.all(promis数组).then(dataList=>{})
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(results => {
            // console.log(results)
            results.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
          // context.commit('updateCart', payload)
        }
      })
    }
  },
  getters: {
    // 有效商品、件数、金额
    validList (state) {
      // 有效商品库存大于0，标识为true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + (Math.round(c.nowPrice * 100) * c.count / 100), 0)
    },
    // JS中的浮点数计算不精确，解决办法
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 && !goods.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(goods => goods.selected === true)
    },
    // 已选商品件件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选择商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count * parseInt(c.nowPrice * 100), 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList !== 0 && getters.selectedList.length === getters.validList.length
    }

  }
}
