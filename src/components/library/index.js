// 扩展组件全局组件,自定义指令,挂在原型方法,没有过滤器
// vue2.0插件的语法要素 导出对象有install函数 默认传入vue构造函数 可以在vue基础之上扩展
// vue3.0插件的语法要素 导出对象有install函数 默认传入app 可以在vue基础之上扩展
import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
export default {
  install (app) {
    // 在app上扩展app提供component方法以及directive方法
    // 如果要在挂在原型  要使用 app
    app.component('XtxSkeleton', XtxSkeleton)
    app.component('XtxCarousel', XtxCarousel)
    app.component('XtxMore', XtxMore)
  }
}
