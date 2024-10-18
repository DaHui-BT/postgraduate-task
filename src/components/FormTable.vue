<script lang="ts" setup>
import PtButton from '@/components/PTButton.vue'

defineProps({
  submit_text: {
    type: String,
    default: 'Submit'
  },
  cancel_text: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['close', 'submit'])

function close() {
  emit('close')
}

function submit() {
  emit('submit')
}

function cancel() {
  emit('close')
}

</script>

<template>
  <div class="form">
    <pt-button class="form-close" type="info" plain circle @click="close">x</pt-button>
    <slot name="form"></slot>
    <div class="form-button-container">
      <slot name="button">
        <pt-button class="form-button-item form-button-submit" type="primary" @click="submit">{{ submit_text }}</pt-button>
        <pt-button class="form-button-item form-button-cancel" @click="cancel">{{ cancel_text }}</pt-button>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  padding: 40px 20px 20px;
  background-color: #fff;
  
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  
  .form-close {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 10px;
    font-weight: 400;
    font-size: 16px;
  }

  .form-button-container {
    display: flex;

    .form-button-item {
      margin: 10px;
    }
  }

}
</style>
