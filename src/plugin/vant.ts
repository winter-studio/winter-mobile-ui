import { App } from 'vue'
import { Tabbar, TabbarItem } from 'vant'

export function setupVant(app: App<Element>) {
  app.use(Tabbar)
  app.use(TabbarItem)
}
