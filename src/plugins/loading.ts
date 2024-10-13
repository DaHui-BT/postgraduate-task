import { type App, createApp, h } from "vue"
import Loading from "@/components/Loading.vue"


export default {
  install (app: App) {
    const container = document.createElement('div')
    const loading_instance = createApp({
      render: () => h(Loading)
    })

    loading_instance.mount(container)
    document.body.appendChild(container)
    container.style.display = 'none'

    app.config.globalProperties.$loading = {
      show: () => container.style.display = 'block',
      hide: () => container.style.display = 'none'
    }
  }
}

