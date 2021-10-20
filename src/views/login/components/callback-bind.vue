<template>
  <Form  :validation-schema="mySchema" ref="formCom" class="xtx-form" autocomplete="off" v-slot={errors}>
    <div class="user-info">
      <img :src="avatar" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" type="text" placeholder="绑定的手机号" name="mobile" v-model="form.mobile" />
      </div>
      <div v-if="errors.mobile" :class="{error:errors.mobile}">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" type="text" placeholder="短信验证码" name="code" v-model="form.code" />
        <span class="code" @click="send"> {{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" :class="{error:errors.code}">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { reactive, ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useStore } from 'vuex'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const avatar = ref(null)
    const nickname = ref(null)
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
        // console.log(res.data.)
      })
    }
    const form = reactive({
      mobile: null,
      code: null
    })
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code

    }
    // 发送验证码倒计时
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
    const formCom = ref(null)
    // const time=ref(0)
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
        // 没有倒计时才可以发送
          await userQQBindCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    const store = useStore()
    // const route = useRoute()
    const router = useRouter()
    // const route = useRoute()
    const submit = async () => {
      const valid = formCom.value.validate()
      try {
        if (valid) {
        // const unionId = props.unionId
        // const code = form.code
        // const resmobile = form.mobile
          const data = await userQQBindLogin({ unionId: props.unionId, ...form })
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirectUrl || '/')
            // 成功消息提示
            Message({ type: 'success', text: '登录成功' })
          })
        }
      } catch (e) {
        Message({ type: 'error', text: '登录失败' })
      }
    }
    return { avatar, nickname, form, mySchema, send, formCom, time, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
