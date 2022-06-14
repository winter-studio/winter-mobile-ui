import { defineStore } from 'pinia'
import { logout } from '@/api/base/auth'
import { UserLogin } from '@/types/response/base'

export interface UserState {
  accessToken: string | undefined
  refreshToken: string | undefined
  refreshTokenExpireIn: number | undefined
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    accessToken: undefined,
    refreshToken: undefined,
    refreshTokenExpireIn: undefined,
    info: {}
  }),
  getters: {},
  actions: {
    setToken(accessToken: string, refreshToken: string, refreshTokenExpireIn: number) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.refreshTokenExpireIn = refreshTokenExpireIn
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    setUserInfo(info: UserLogin) {
      this.info = info
    },
    // 登录
    login(result: UserLogin) {
      this.setToken(result.accessToken, result.refreshToken, result.refreshTokenExpireIn)
      this.setUserInfo(result)
    },
    // 登出
    async logout() {
      await logout(this.refreshToken)
      this.info = undefined
      this.accessToken = undefined
      this.refreshToken = undefined
      this.refreshTokenExpireIn = undefined
      localStorage.removeItem('WINTER_CURRENT_USER')
    }
  },
  persist: {
    key: 'WINTER_CURRENT_USER'
  }
})
