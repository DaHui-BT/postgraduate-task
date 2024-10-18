<script lang="ts" setup>
import { ref } from "vue"
import type { TaskType } from '@/types/submission'
import Database from "@/tools/mongodb"


const emit = defineEmits(['submit', 'start_loading', 'stop_loading', 'hide_submit_form'])
const prop = defineProps(['is_submit_form_show'])
const database = new Database()

const submit_info = ref<TaskType>({
  user_id: database.user.id,
  title: '',
  message: '',
  status: 0,
  file_id_list: [],
  file_name_list: []
})

function uploadData (e: Event) {
  //@ts-ignore
  let files = e.target.files;
  if (files == null || files == undefined) {
    alert('No files upload')
    return
  }

  for (let file of files) {
    if (file.size > 500*1024*1024) {
      alert('upload file over than 500M!')
      return;
    }
  }

  emit('start_loading')
  for (let file of files) {
    let form_data = new FormData()
    form_data.append('file', file)
    // save to backend
    database.uploadFile('postgraduate-task', 'files', file).then(res => {
      submit_info.value.file_id_list?.push(res.insertedId)
      submit_info.value.file_name_list?.push(res.file_name)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      emit('stop_loading')
    })
  }
}

function submit() {
  emit('submit', submit_info.value)
  // when submit clear input message
  submit_info.value = {}
  submit_info.value.status = 0
  submit_info.value.file_id_list = []
  submit_info.value.file_name_list = []
}

function close() {
  emit('hide_submit_form')
}

</script>

<template>
  <div class="submit-table">
    <div class="submit-container">
      <div class="submit-container-close" @click="close">X</div>
      <h2 class="submit-container-title">Submit</h2>
      <input class="submit-container-item submit-container-item-title"
             type="text" placeholder="title"
             v-model="submit_info.title">

      <input class="submit-container-item-file" id="input-file"
             type="file" multiple accept=".png, .jpg, .jpeg" name="Upload"
             @change="uploadData">

      <textarea class="submit-container-item submit-container-item-textarea"
                placeholder="describe" name="" id="" rows="5"
                v-model="submit_info.message"></textarea>

      <button class="submit-container-item submit-container-submit"
              @click="submit">Submit</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.submit-table {
  // position: fixed;
  // top: 0;
  // left: 0;
  // background-color: #3b3b3b94;
  // width: 100%;
  // height: 100vh;
  // display: flex;
  // align-items: center;

  .submit-container {
    position: relative;
    margin: auto;
    width: 350px;
    padding: 40px 30px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 5px;

    .submit-container-close {
      position: absolute;
      top: 15px;
      right: 20px;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #ff4d65;
      border: 1px solid #ff4d4d5b;
      border-radius: 50%;
      font-weight: bold;
      cursor: pointer;
    }

    .submit-container-title {
      text-align: center;
      margin-bottom: 20px;
    }

    .submit-container-item {
      border: 1px solid #6993fe;
      padding: 15px 15px;
      max-width: 350px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .submit-container-item::placeholder {
      color: #aaa;
    }

    .submit-container-item-title {
      height: 30px;
    }

    .submit-container-item-file {
      margin-bottom: 20px;
    }

    .submit-container-item-textarea {
      margin-bottom: 30px;
    }

    .submit-container-submit {
      width: 290px;
      font-size: 16px;
      color: #fff;
      font-weight: bold;
      background-color: #6993fe;
    }
  }
}
</style>
