import { ComponentCustomProperties } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $loading: {
      show: () => none,
      hide: () => none
    }
  }
}
