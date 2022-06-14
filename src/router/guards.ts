import { PageEnum } from '@/enums/pageEnum'
import { isNavigationFailure, RouteLocationRaw, Router } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const whitePathList = [PageEnum.BASE_LOGIN_NAME] // no redirect whitelist

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (from.name === PageEnum.BASE_LOGIN_NAME && to.name === 'errorPage') {
      next(PageEnum.BASE_HOME)
      return
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.name as PageEnum)) {
      next()
      return
    }
    const userStore = useUserStore()
    const token = userStore.accessToken
    if (!token) {
      // You can access without permissions. You need to set the routing meta.permitAll to true
      if (to.meta.permitAll) {
        next()
        return
      }
      // redirect login page
      const redirectData: RouteLocationRaw = {
        name: PageEnum.BASE_LOGIN_NAME,
        replace: true
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path
        }
      }
      next(redirectData)
      return
    }

    next()
    return
  })

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
  })

  router.onError((error) => {
    console.error('路由错误', error)
  })
}
