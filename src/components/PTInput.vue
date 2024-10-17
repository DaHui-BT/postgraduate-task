<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])
defineProps({
  label: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '40px'
  },
  width: {
    type: String,
    default: '100%'
  },
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

</script>

<template>
  <div class="input" :style="{'width': width, 'height': height}">
    <label v-if="label" for="input" class="input-label">{{ label }}</label>
    <input id="input" class="input-form" :type="type"
           :placeholder="placeholder"
           @input="emit('update:modelValue', $event.target.value)"
           :value="modelValue">
  </div>
</template>

<style lang="scss" scoped>
.input {
  display: flex;
  align-items: center;

  .input-label {
    color: #606266;
    margin-right: 10px;
  }

  .input-form {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }

  .input-form:focus {
    border-color: #409eff;
  }
}
</style>
