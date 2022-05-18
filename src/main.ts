import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

import './styles/tailwind.css'
import vant from '@/plugin/vant'

const app = createApp(App)
app.use(vant)
// 挂载状态管理
app.use(store)
// 挂载路由
app.use(router)
app.mount('#app', true)
