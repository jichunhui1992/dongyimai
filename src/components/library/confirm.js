import XtxConfirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)
export default ({ title, text }) => {
  // 导入被创建的组件
  // 使用createVnode创建虚拟节点
  // 创建dom容易
  // 使用render函数渲染组件
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vnode = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })

    render(vnode, div)
  })
}
