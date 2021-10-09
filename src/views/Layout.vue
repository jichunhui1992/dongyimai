<template>
<div class="container">
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
export default {
  components: {
    AppNavbar,
    AppHeader,
    AppFooter

  }

}
</script>

<style lang="less">
.app-body{
  min-height:600px ;
}

</style>
