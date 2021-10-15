<template>
  <SubBread />
  <!-- 筛选区 -->
  <SubFilter @filter-change="filterChange" />
  <!-- 商品面板 -->
  <!-- 排序组件 -->
  <div class="goods-list">
    <SubSort @sort-change="sortChange" />
     <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id" >
            <GoodsItem :goods="item" />
          </li>
        </ul>
    <XtxInfiniteLoading @infinite="getData" :loading="loading" :finished="finished" />
  </div>

</template>

<script>

import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'

export default {
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem

  },
  setup () {
    // const isChecked = ref(false)
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    const route = useRoute()
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      // console.log('加载数据吧')
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }
    watch(() => route.params.id, (newVal) => {
      // console.log(1)
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    const sortChange = (sortParams) => {
      // console.log(sortParams)
      finished.value = false
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    const filterChange = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }

    return { getData, loading, finished, goodsList, sortChange, filterChange }
  }

}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
i
