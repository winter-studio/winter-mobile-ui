import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import { setupVant } from './plugin/vant'

import './styles/tailwind.css'

const app = createApp(App)
// 挂载状态管理
app.use(store)
// 挂载路由
app.use(router)
// 使用vant插件
setupVant(app)
app.mount('#app', true)
