import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/message/Message.vue'),
    meta: {
      title: '消息'
    }
  }
]

export default routes
