import request from '@/utils/request'

/**
 * 帐号登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}
/**
 * 短信登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}
export const userQQLogin = (unionId, source = 6) => {
  return request('/login/social', 'post', { unionId, source })
}
// setup () {
//   const hasAccount = ref(true)
//   // 假设已经绑定，默认会去做一次登录，如果登录失败证明未绑定。
//   const isBind = ref(true)
//   // 1. 获取QQ互联的openId也就是后台需要的unionId
//   // 2. 根据QQ互联的openId去进行登录，准备一个接口
//   const store = useStore()
//   const router = useRouter()
//   if (QC.Login.check()) {
//     // 检查QQ是否登录
//     QC.Login.getMe((openId) => {
//       userQQLogin(openId).then(data => {
//         // 代表：使用qq登录成功
//         // 1. 存储用户信息
//         const { id, account, avatar, mobile, nickname, token } = data.result
//         store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
//         // 2. 跳转到来源页或者首页
//         router.push(store.state.user.redirectUrl)
//         // 3. 成功提示
//         Message({ type: 'success', text: 'QQ登录成功' })
//       }).catch(e => {
//         // 代表：使用qq登录失败===>1. 没绑定小兔鲜帐号  2. 没有小兔鲜帐号
//         isBind.value = false
//       })
//     })
//   }
