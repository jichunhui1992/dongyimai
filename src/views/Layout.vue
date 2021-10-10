<template>
<div class="container">
  <!-- 头部吸顶组件 -->
  <AppHeaderSticky />
    <!-- 顶部通栏 -->
    <AppNavbar />
    <!-- 头部组件 -->
    <AppHeader />
    <!-- 二级路由组件 -->
    <div class="app-body">
    <router-view />
    </div>

    <!-- 底部组件 -->
     <AppFooter />
</div>
</template>

<script>
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky

  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
    // console.log(res)
    // store.state.category.List
  }

}
</script>

<style lang="less">
.app-body{
  min-height:600px ;
}

</style>
