<script lang="ts" setup>
const props = defineProps({
  center: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div :class="{'screen-mask': true, 'screen-mask-center': center}">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.screen-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000000a8;
}

.screen-mask-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
</style>
