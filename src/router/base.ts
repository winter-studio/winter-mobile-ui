import { ErrorPage, AppLayout } from '@/router/constant'
import modules from './modules'
import { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  component: AppLayout,
  redirect: '/home',
  meta: {
    title: 'Root'
  },
  children: [...modules]
}

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: PageEnum.Login,
  component: () => import('@/views/basic/Login.vue'),
  meta: {
    title: '登录'
  }
}

// 404 on a page
export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: AppLayout,
  meta: {
    title: 'ErrorPage'
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: '错误'
      }
    }
  ]
}

//普通路由 无需验证权限
export const constantRouter: RouteRecordRaw[] = [LoginRoute, RootRoute, ErrorPageRoute]
