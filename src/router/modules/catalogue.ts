import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('@/views/catalogue/Catalogue.vue'),
    meta: {
      title: '分类'
    }
  }
]

export default routes
