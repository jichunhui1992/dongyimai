import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'
// 创建一个容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
// 定时器
let timer = null

export default ({ type, text }) => {
  // 渲染组件
  // 1.导入小弟消息提示组件
  // 2.需要把组件解析成dom，虚拟节点
  const vnode = createVNode(XtxMessage, { type, text })
  // 3.装在消息提示组件的容器
  // 4.将虚拟节点 渲染在容器中
  render(vnode, div)
  // 参数1是虚拟节点，参数二是dom 容器
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
