<script lang="ts" setup>

const props = defineProps({
  state: {
    type: Object,
    default: 'Notification'
  },
  close: {
    type: Function,
    required: true
  }
})

function close() {
  props.close()
}

</script>

<template>
  <div class="notification" v-if="state.visible">
    <button class="notification-close" @click="close">x</button>
    <h2 class="notification-title">{{ state.title }}</h2>
    <p class="notification-message">{{ state.message }}</p>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  position: absolute;
  top: 60px;
  right: 5%;
  width: 330px;
  padding: 14px 26px 14px 13px;
  border: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  z-index: 2;

  .notification-close {
    position: relative;
    float: right;
    top: 0px;
    right: 0px;
    color: #909399;
    font-size: 16px;
  }

  .notification-title {
    font-weight: 700;
    font-size: 16px;
    color: #303133;
  }

  .notification-message {
    font-size: 14px;
    line-height: 21px;
    margin: 6px 0 0;
    color: #606266;
    text-align: justify;
  }
}
</style>
