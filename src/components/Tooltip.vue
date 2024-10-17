<script lang="ts" setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.75)', // Default background color
  },
  textColor: {
    type: String,
    default: 'white', // Default text color
  },
});

const isVisible = ref(false);

function showTip() {
  isVisible.value = true;
}

function hideTip() {
  isVisible.value = false;
}
</script>

<template>
  <div class="hover-tip-container" @mouseenter="showTip" @mouseleave="hideTip">
    <slot></slot>
    <div
      v-if="isVisible"
      class="hover-tip-message"
      :style="{ backgroundColor: backgroundColor, color: textColor }"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.hover-tip-container {
  position: relative;
  display: inline-block;
}

.hover-tip-message {
  position: absolute;
  bottom: 100%;
  left: 100%;
  transform: translateX(-90%);
  padding: 8px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
  margin-bottom: 8px;
  font-size: 12px;
  opacity: 0;
  animation: fadeIn 0.2s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
