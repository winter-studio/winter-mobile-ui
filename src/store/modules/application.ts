import { defineStore } from 'pinia'

export interface AppState {
  counter:number
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    counter: 0
  }),
  getters: {},
  actions: {
    increment(state: AppState) {
      state.counter++
    }
  }
})
