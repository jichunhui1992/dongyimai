<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddres">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddres">
         <li><span>收<i/>货<i/>人：</span>{{showAddres.receiver}}</li>
        <li><span>联系方式：</span>{{showAddres.contact}}</li>
        <li><span>收货地址：</span>{{showAddres.fullLocation.replace(/ /g,'')+showAddres.address}}</li>
      </ul>
      <a href="javascript:;" @click="openAddressEdit(showAddres)" >修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
  </div>
  <xtx-dialog title="切换收货地址" v-model:visible="visibleDialog">
        <div @click="selectedAddress=item" :class="{active:selectedAddress && selectedAddress.id===item.id}" class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact}}</li>
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
      <template v-slot:footer>
        <XtxButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
      </template>
  </xtx-dialog>
  <AddressEdit ref="addressEditCom" @on-success="successHandler" />
</template>
<script>
import { ref } from 'vue'
import xtxDialog from '@/components/library/xtx-dialog.vue'
import AddressEdit from './address-edit.vue'
export default {
  components: { xtxDialog, AddressEdit },
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      defualt: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    //   找到默认收货地址 没有默认收货地址 使用第一条收货地址 没有数据 提示添加地址
    const showAddres = ref(null)
    const defaultAddres = props.list.find(item => item.isDefault === 0)
    if (defaultAddres) {
      showAddres.value = defaultAddres
    } else {
      if (props.list.length) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddres.value = props.list[0]
      }
    }
    // 默认通知结算组件收货地址id
    emit('change', showAddres.value && showAddres.value.id)
    const visibleDialog = ref(false)
    // 记录选中的地址 id
    const selectedAddress = ref(null)
    const confirmAddressFn = () => {
      showAddres.value = selectedAddress.value
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
      // 数据使用完毕空
    }
    const openDialog = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      console.log(address)
      addressEditCom.value.open(address)
    }
    const successHandler = (formData) => {
      // 根据formdataid跟当前列表中id进行对比查找
      // console.log(formData)
      const address = props.list.find(item => item.id === formData.id)
      if (address) {
        for (const k in address) {
          address[k] = formData[k]
        }
      } else {
        // 如果是添加往list中追加一条
      // eslint-disable-next-line vue/no-mutating-props
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }
    return { showAddres, visibleDialog, selectedAddress, confirmAddressFn, openDialog, openAddressEdit, addressEditCom, successHandler }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
