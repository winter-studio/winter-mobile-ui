import { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: PageEnum.Home,
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '首页'
    }
  }
]

export default routes
