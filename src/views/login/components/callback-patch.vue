<template>
  <Form class="xtx-form" ref="formCom" :validation-schema="mySchema" v-slot={errors} autocomplete="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field class="input" type="text" placeholder="请输入用户名" name="account" v-model="form.account" />
      </div>
      <div class="error" v-if="errors.account" :class="{error:errors.account}">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" type="text" placeholder="请输入手机号" name="mobile" v-model="form.mobile" />
      </div>
      <div class="error" v-if="errors.mobile" :class="{error:errors.mobile}">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" type="text" placeholder="请输入验证码" name="code" v-model="form.code" />
        <span class="code" @click="send">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
     <div class="error" v-if="errors.code" :class="{error:errors.code}">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" type="password" placeholder="请输入密码" name="password" v-model="form.password" />
      </div>
      <div class="error" v-if="errors.password" :class="{error:errors.password}">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" type="password" placeholder="请确认密码" name="rePassword" v-model="form.rePassword" />
      </div>
     <div class="error" v-if="errors.rePassword" :class="{error:errors.rePassword}">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Form, Field
  },
  setup (props) {
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword

    }
    // -------------------------------------------------------
    const formCom = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
    // 1.3 如果失败，失败的校验样式显示出来
    const send = async () => {
      // console.log(1)
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
        // 没有倒计时才可以发送
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // ----------------------------------------------------------
    // 完善信息
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          // 实现和之前登录一样的逻辑
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2. 跳转到来源页或者首页
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirectUrl || '/')
            // 成功消息提示
            Message({ type: 'success', text: '登录成功' })
          })
        }).catch(e => {
          Message({ type: 'error', text: '完善信息失败' })
        })
      }
    }

    return { form, mySchema, formCom, time, send, submit }
  }

}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
