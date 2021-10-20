<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
        <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{profile.account}}</a></li>
        <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
        <li><router-link to="/login">请先登录</router-link></li>
        <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'AppTopnav',
  setup () {
    // 获取用户信息切换导航菜单
    const store = useStore()// vue3使用vuex必须引入usestore命令
    const router = useRouter()
    const route = useRoute()
    // const profile = store.state.user.profile//使用vuex的state响应式需要设置计算属性那么设置成reactive可以吗？日后测试
    const profile = computed(() => {
      return store.state.user.profile
    })
    const logout = () => {
      store.commit('user/setUser', {})
      store.commit('cart/setCart', [])
      router.push(route.query.redirectUrl || '/login')
    }

    return { profile, logout }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      //选择当前选择器后的所有元素
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
