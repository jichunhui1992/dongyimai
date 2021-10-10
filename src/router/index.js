import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub.vue')

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
    }]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
