import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'// 重置样式库
import '@/assets/styles/common/common.less'

createApp(App).use(store).use(router).mount('#app')
