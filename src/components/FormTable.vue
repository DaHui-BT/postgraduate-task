<script lang="ts" setup>

defineProps({
  submit_text: {
    type: String,
    default: 'Submit'
  }
})

const emit = defineEmits(['close', 'submit'])

function close() {
  emit('close')
}

function submit() {
  emit('submit')
}

</script>

<template>
  <div class="form">
    <button class="form-close" @click="close">X</button>
    <slot></slot>
    <button class="form-button" @click="submit">{{ submit_text }}</button>
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
  border-radius: 5px;
  box-shadow: 0px 0px 10px 2px #aaa;
  
  .form-close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    // border: 2px solid #66e3be;
    // color: #66e3be;
    color: #fff;
    background-color: #66e3be;
  }

  .form-button {
    width: 100%;
    padding: 10px 20px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #66e3be;
    box-shadow: 0 0 3px 1px #66e3be;
    color: #666;
    font-weight: bold;
  }
}
</style>
