import { defineStore } from 'pinia'

export interface AppState {
  token?: string
}

export const useUserStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    token: undefined
  }),
  getters: {},
  actions: {}
})
