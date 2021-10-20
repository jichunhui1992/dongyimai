<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container" >
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`" v-if="goods && goods.categories">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`"  v-if="goods && goods.categories">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem to="/"  v-if="goods && goods.categories">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
       <div class="goods-info">
        <div class="media">
          <GoodsImage :images='goods.mainPictures' />
          <GoodsSales />
        </div>
        <div class="spec">
        <GoodsName :goods="goods" />
        <GoodsSku :goods="goods"  @change="changeSku" />
        <XtxNumbox v-model="num" label="数量" :max="goods.skus[0].inventory" :min="1"  />
        <XtxButton type="primary" size="middle" style="margin-top:20px" @click="insertCart" >加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { nextTick, ref, watch, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { findGoods } from '@/api/product'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    const goods = useGoods()
    // if (goods.value) {
    //   return goods
    // }
    console.log(goods)
    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的SKU可能有数据 可能有数据 也可能没有数据
      currSku.value = sku
    }
    // 双向绑定数量值
    const num = ref(1)
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
      // console.log(1)
      // console.log(currSku.value)
      if (currSku.value && currSku.value.skuId) {
        store.dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          price: currSku.value.price,
          nowPrice: currSku.value.price,
          count: num.value,
          attrsText: currSku.value.specsText,
          selected: true,
          isEffective: true,
          stock: currSku.value.inventory
        }).then(() => {
          Message({ type: 'success', text: '添加购物车成功' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    return { goods, changeSku, num, insertCart }
  }

}
const useGoods = () => {
  // 有可能出现 路由地址的变化但是不会重新初始化组件 因为路由规则没有变化。需要使用watch监听路由id的变化
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal) {
      findGoods(route.params.id).then(data => {
        // console.log(data)
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
        // console.log(goods.value)
      })
    }
  }, { immediate: true })
  // 提供数据给后代使用
  provide('goods', goods)

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
