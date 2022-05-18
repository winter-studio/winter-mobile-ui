import { Router } from 'vue-router'

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    next()
    return
  })

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title
  })

  router.onError((error) => {
    console.error('路由错误', error)
  })
}
