import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiResponse, ApiResponseType, ProxyAxiosResponse } from '@/utils/request/types'
import router from '@/router'
import { RouteLocationRaw } from 'vue-router'
import { ApiCodes } from '@/utils/request/api-codes'
import { refreshToken } from '@/api/base/auth'
import { Toast } from 'vant'

let refreshing: Promise<any> | undefined = undefined
let waiting = false
let retryCount = 0

/**
 * request interceptor
 */
function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (request: AxiosRequestConfig) => {
      Toast.loading({ forbidClick: true })
      // set header Authorization
      const token = useUserStore().accessToken
      if (request.headers && token) {
        request.headers.Authorization = `Bearer ${token}`
      }
      return request
    },
    (error: any) => {
      Toast.clear()
      console.error(error)
      throw new Error(error)
    }
  )
}

function createRefreshing(token: string): Promise<ApiResponse<string>> {
  if (!refreshing) {
    waiting = true
    refreshing = refreshToken(token)
  }
  return refreshing
}

/**
 * response interceptor
 */
function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: ProxyAxiosResponse) => {
      Toast.clear()
      const { data } = response
      switch (data.type) {
        case ApiResponseType.SUCCESS:
          if (response.config.handleSuccess) {
            return data
          }
          break
        case ApiResponseType.FAILURE:
          if (response.config.handleFailure) {
            Toast.fail(data.message ?? '未知错误')
            throw new Error('接口失败')
          }
          break
        case ApiResponseType.ERROR:
          if (response.config.handleError) {
            Toast.fail(data.message ?? '请求异常')
            throw new Error(`接口异常:${data.message}`)
          }
          break
      }
    },
    async (error: any) => {
      Toast.clear()
      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            const userStore = useUserStore()
            if (error.response.data.code === ApiCodes.ACCESS_TOKEN_EXPIRED) {
              // token过期，尝试刷新token
              if (userStore.refreshToken) {
                console.info('token expired，try to refresh token')
                refreshing = createRefreshing(userStore.refreshToken)
                const res = await refreshing
                if (waiting) {
                  console.info('refresh token successfully')
                  waiting = false
                  userStore.setAccessToken(res.data)
                }
                if (retryCount++ < 3) {
                  console.info('retry request')
                  return instance(error.response.config)
                } else {
                  retryCount = 0
                }
              }
            }
            userStore.logout().then(() => {
              const redirect = router.currentRoute.value.fullPath
              const to: RouteLocationRaw = {
                name: 'Login'
              }
              if (redirect && redirect !== '/') {
                to.query = { redirect }
              }
              router.push(to).then((_) => {
                Toast.fail('登录失效')
              })
            })

            break
          case 403:
            Toast.fail('没有权限')
            break
          case 404:
            Toast.fail('请求资源不存在')
            break
        }
      } else {
        console.error(error)
        switch (error.code) {
          case 'ECONNABORTED':
            Toast.fail('网络错误')
            break
          case 'ETIMEDOUT':
            Toast.fail('请求超时')
            break
          default:
            Toast.fail('请求失败')
        }
      }
    }
  )
}

export function setupInterceptors(axios: AxiosInstance) {
  setupRequestInterceptor(axios)
  setupResponseInterceptor(axios)
}
