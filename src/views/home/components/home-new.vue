<template>
 <div class="home-new">
    <home-panel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template v-slot:right>
        <xtx-more path="/" />
      </template>
      <!-- 面板结构 -->
      <div ref="target" style="position:relative;height:462px;">
      <Transition name="fade">
        <ul class="goods-list" v-if="goods.length">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="">
            <p class="name ellipsis">{{item.name}}</p>
            <p class="price">&yen;{{item.price}}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton v-else bg="#f0f9f4" />
      </Transition>
      </div>
    </home-panel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
// import { ref } from 'vue'
import { findNew } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
// import XtxMore from '@/components/library/xtx-more.vue'
export default {
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    // const target = ref(null)

    const { result, target } = useLazyData(findNew)
    return { goods: result, target }
  }

}
</script>

<style scoped lang="less">

.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
