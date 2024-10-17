import { type App, createApp, h, reactive } from "vue"
import Notification from "@/plugins/templates/Notification.vue"


export default {
  install (app: App) {
    const state = reactive({
      visible: false,
      title: 'Notification',
      message: '',
      duration: 5
    })

    const container = document.createElement('div')
    const notification_instance = createApp(Notification, {state, close: () => state.visible = false})

    notification_instance.mount(container)
    document.body.appendChild(container)

    app.config.globalProperties.$notification = {
      show: (title: string, message: string, duration: number | null = null) => {
        state.title = title
        state.message = message
        state.visible = true
        if (duration) state.duration = duration

        setTimeout(() => {
          state.visible = false
        }, state.duration * 1000)
      },
      close: () => state.visible = false
    }
  }
}
