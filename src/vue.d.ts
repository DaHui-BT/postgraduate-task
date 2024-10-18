import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $loading: {
      show: () => none,
      hide: () => none
    },
    $notification: {
      show: (title: string, message: string) => none,
      close: () => none
    }
  }
}
