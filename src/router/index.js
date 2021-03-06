import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
// import Home from '../views/Home.vue'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub.vue')
const goods = () => import('@/views/goods/index.vue')
const login = () => import('@/views/login/index.vue')
const LoginCallback = () => import('@/views/login/callback.vue')
const cart = () => import('@/views/cart/index.vue')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'TopCategory',
      component: TopCategory

    },
    {
      path: '/category/sub/:id',
      component: SubCategory
    },
    {
      path: '/product/:id',
      component: goods
    },
    {
      path: '/cart',
      component: cart
    },
    { path: '/member/checkout', component: PayCheckout },
    { path: '/member/pay', component: PayIndex }
    ]
  },
  { path: '/login', name: 'login', component: login },
  { path: '/login/callback', name: 'LoginCallback ', component: LoginCallback }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})
// 路由守卫
router.beforeEach((to, from, next) => {
  if (!store.state.user.profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
