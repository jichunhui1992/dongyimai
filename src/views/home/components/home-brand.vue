<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证" ref="target">
    <template v-slot:right>
      <a @click="toggle(-1)" :class="{disabled:index===0}" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(+1)" :class="{disabled:index===1}" href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>
    <div class="box" ref="box" >
    <Transition name="fade">
      <ul class="list" :style="{transform:`translateX(${-index*1240}px)`}" v-if="brands.length" >
          <!-- :style="{transform:`translateX(${-index*1240}px)`}" -->
        <li v-for="(item,index) in brands" :key="index">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
          </RouterLink>
        </li>
      </ul>
       <div v-else class="skeleton">
          <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
       </div>
    </Transition>
      <!-- //骨架 -->
      <!-- <HomeSkeleton v-else /> -->

    </div>
  </HomePanel>
</template>

<script>
import HomePanel from './home-panel'
import { ref } from 'vue'
import { findBrand } from '@/api/home'
// import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // const brands = ref([])
    // findBrand(10).then(data => {
    //   brands.value = data.result
    // })
    // 实现懒加载

    const { result, target } = useLazyData(() => findBrand(10))

    // 切换效果
    const index = ref(0)
    const toggle = (step) => {
      console.log(1)
      const newIndex = index.value + step
      if (newIndex > 1 || newIndex < 0) {
        return
      }
      index.value = newIndex
    }
    // 骨架

    // 懒加载
    return { brands: result, index, toggle, target }
  }
//   切换效果
}
</script>

<style scoped lang='less'>
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
