<script lang="ts" setup>
import { reactive, getCurrentInstance } from 'vue'

const emits = defineEmits(['on-change'])
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: 'Upload'
  },
  message: {
    type: String,
    default: 'each file size must under 5MB'
  },
  uploaded_files: {
    type: Array<String>,
    defalt: []
  }
})

const file_list = reactive<Array<File>>([])

function addFile(files: Array<File>) {
  for (let file of files) {
    if (file.size > 5*1024*1024*8) {
      alert('file size over 5MB')
      return
    }
  }
  file_list.splice(0, file_list.length)
  
  file_list.push(...files)

  emits('on-change', file_list)
}
</script>

<template>
  <div class="pt-upload">
    <label class="pt-upload-button" for="upload">{{ text }}</label>
    <input class="pt-upload-file" id="upload"
           type="file" multiple :accept="accept"
           @change="addFile($event.target.files)">
    <ul v-if="uploaded_files.length > 0" class="pt-upload-file-container">
      <li class="pt-upload-file-item" v-for="file_name in uploaded_files" :key="file_name">{{ file_name }}</li>
    </ul>
    <p v-else class="pt-upload-file-message">{{ message }}</p>
  </div>
</template>

<style lang="scss" scoped>
.pt-upload {
  width: 100%;

  .pt-upload-button {
    display: inline-block;
    padding: 6px 15px;
    background: #67C23A;
    border: 1px solid #dcdfe6;
    color: #fff;
    border-radius: 3px;
  }
  
  .pt-upload-file {
    display: none;
  }

  .pt-upload-file-container {
    padding-left: 10px;

    .pt-upload-file-item {
      margin-top: 3px;
      font-size: 13px;
      color: #909399;
    }
  }

  .pt-upload-file-message {
    padding-left: 10px;
    margin-top: 3px;
    font-size: 13px;
    color: #909399; 
  }
}
</style>
