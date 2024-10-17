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
        <button class="form-button form-button-submit" @click="submit">{{ submit_text }}</button>
        <button class="form-button form-button-cancel" @click="cancel">{{ cancel_text }}</button>
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

    .form-button {
      width: 100%;
      padding: 10px 20px;
      margin-top: 10px;
      border-radius: 5px;
      border: 1px solid #dcdfe6;
      color: #666;
      font-weight: bold;
    }

    .form-button:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
      transition: .2s;
    }
  }

}
</style>
