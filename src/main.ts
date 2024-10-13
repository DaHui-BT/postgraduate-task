import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import loading from '@/plugins/loading'

const app = createApp(App)

app.use(loading)
app.use(router)
app.mount('#app')
