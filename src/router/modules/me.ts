import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/me',
    name: 'me',
    component: () => import('@/views/me/Me.vue'),
    meta: {
      title: '我的'
    }
  }
]

export default routes
