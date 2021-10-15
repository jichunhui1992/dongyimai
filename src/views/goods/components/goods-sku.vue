<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
        <img @click="changeSku(val,item)" v-if="val.picture" :class="{selected:val.selected,disabled:val.disabled}" :src="val.picture">
        <span  @click="changeSku(val,item)" v-else :class="{selected:val.selected,disabled:val.disabled}">{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
const spliter = '★'
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      const valueArr = sku.specs.map(val => val.valueName)
      // console.log(valueArr)
      const valueArrPowerSet = getPowerSet(valueArr)
      // console.log(valueArrPowerSet)
      valueArrPowerSet.forEach(arr => {
        const key = arr.join(spliter)
        // console.log(key)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  // console.log(pathMap)
  return pathMap
}
// 更新按钮禁用状态
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
const updateDisabledStatus = (specs, pathMap) => {
  // 约定每一个按钮的状态由他本身的disabled的数据来记录
  // console.log(specs)
  specs.forEach((item, i) => {
    // console.log(item)
    const selectedValues = getSelectedValues(specs)
    // console.log(item.values)
    item.values.forEach(val => {
      if (val.selected) return
      selectedValues[i] = val.name
      const key = selectedValues.filter(value => value).join(spliter)
      val.disabled = !pathMap[key]

      // val.disabled = !pathMap[val.name]
    })
  })
}
// 获取skuid初始化选择按钮
const initDefaultSelected = (goods, skuId) => {
  // 首先要找到这个sku
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 遍历这个sku得到对的的valname值去按钮所在数组去对应查找把selected的值改为ture
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
  // 遍历specs数组
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      required: true
    },
    skuId: {
      type: [String, Number],
      defualt: '300260780'
    }
  },
  setup (props, { emit }) {
    // 初始化的时候调用这个含税默认选中
    initDefaultSelected(props.goods, props.skuId)

    console.log(props.goods)
    const pathMap = getPathMap(props.goods.skus)
    // 每一个按钮都拥有自己的选中状态数据
    // 把同一个规格的暗女改成未选中
    // 初始化的时候调用数据
    updateDisabledStatus(props.goods.specs, pathMap)
    const changeSku = (val, item) => {
      // console.log(val.selected)
      // val.selected = !val.selected
      // 当按钮为真就禁用
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      updateDisabledStatus(props.goods.specs, pathMap)

      // console.log(getSelectedValues(props.goods.specs))
      // 选择完整sku组合按钮，才可以拿到这些信息，提交父组件
      // 不是是完整的sku组合按钮。
      const vailidSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (vailidSelectedValues.length === props.goods.specs.length) {
        // console.log('完整')
        const skuIds = pathMap[vailidSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', '')
        })
      } else {
        // console.log('不完整')
        emit('change', '')
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
