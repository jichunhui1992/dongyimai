// 扩展组件全局组件,自定义指令,挂在原型方法,没有过滤器
// vue2.0插件的语法要素 导出对象有install函数 默认传入vue构造函数 可以在vue基础之上扩展
// vue3.0插件的语法要素 导出对象有install函数 默认传入app 可以在vue基础之上扩展
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'
// import XtxBreadItem from './xtx-bread-item.vue'
// import XtxBread from './xtx-bread.vue'
const importFn = require.context('./', false, /\.vue$/)
// console.log(importFn.keys())
export default {
  install (app) {
    // 在app上扩展app提供component方法以及directive方法
    // 如果要在挂在原型  要使用 app
    // app.component('XtxSkeleton', XtxSkeleton)
    // app.component('XtxCarousel', XtxCarousel)
    // app.component('XtxMore', XtxMore)
    // app.component('XtxBreadItem', XtxBreadItem)
    // app.component('XtxBread', XtxBread)
    // 定义指令
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })
    defineDirective(app)
  }
}

// 定义指令
// 原理先把图片存储起来，不在src上显示，当图片进入可视区，将src的地址换成存储的地址
const defineDirective = (app) => {
  app.directive('lazy', {
    // VUE2.0 监听使用指令的dom是否创建好：inserted
    // vue 3.0 的使用mounted
    mounted (el, binding) {
      // 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => { // 这个语法什么意思
        if (isIntersecting) {
          // console.log('进入可视区')
          observe.unobserve(el)
          // 把指令的值设置给src 就是bingding。value
          // 处理元素加载失败
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
