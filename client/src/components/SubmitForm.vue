<script setup lang="ts">
import moment from "moment";
import { reactive, ref } from "vue";
import type { SubmitType } from '@/types/submit'

import { save_file } from "@/api/task"


const emit = defineEmits(['submit'])
const prop = defineProps(['is_submit_form_show'])
// const file_name_list = ref<string>('')

const submit_info = reactive<SubmitType>({
  date: moment().format('YYYY-MM-DD: HH-mm:ss'),
  title: '',
  message: '',
  file_list: []
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
      break;
    }
  }

  // if (file_name_list.value.indexOf(',') != -1)
  //   submit_info.file_name_list = file_name_list.value.split(',')
  // else if (file_name_list.value.indexOf(',') != -1)
  //   submit_info.file_name_list = file_name_list.value.split(',')

  // if (submit_info.file_name_list.length == 0 || submit_info.file_name_list.length != files.length)
  //   alert('must fill the file name first')

  for (let i = 0; i < files.length; ++ i) {
    let form_data = new FormData()
    form_data.append('file', files[i])
    // submit_info.file_list.push(form_data)
    // save to backend
    save_file(form_data).then(res => {
      console.log('save file', files[i], res)
      
      submit_info.file_list.push(res.data.data)
    }).catch(error => {
      console.log('save file', error)
    })
  }
  // console.log(submit_info)
}

function submit() {
  // alert('Please use git to submit!')
  // return
  emit('submit', submit_info)
  // submit_info.file_list = []
  // submit_info.message = ''
  // submit_info.title = ''
}

</script>
<template>
  <div class="submit-form">
    <div class="submit-button" @click="submit">submit</div>
    <div v-if="prop.is_submit_form_show">
      <label class="submit-form-text" for="title">Input title: </label>
      <input class="submit-form-title" id="title" type="text" v-model="submit_info.title">
      <br/>
      <!-- <label class="submit-form-text" for="input-name">Picutre Name(using "," to split): </label>
      <input class="submit-form-title submit-form-file_name" id="input-name" type="text" v-model="file_name_list"> -->

      <label class="submit-form-text" for="input-file">Input Picutre: </label>
      <input class="input-file" id="input-file" type="file" multiple accept=".png, .jpg, .jpeg" name="Upload" @change="uploadData">
      <br/>
      <label class="submit-form-text" for="submit-content">Submit Message: </label>
      <textarea class="submit-content" id="submit-content" rows="10"
                placeholder="input your submit message: "
                v-model="submit_info.message"></textarea>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .submit-form {
    
    .submit-button {
      display: inline-block;
      padding: 5px 15px;
      margin-bottom: 10px;
      color: #fff;
      font-weight: bold;;
      border-radius: 5px;
      cursor: pointer;
      background-color: #4452cb;
    }

    .submit-form-text {
      display: inline-block;
      color: #aaa;
      margin-top: 10px;
      margin-right: 10px;
    }

    .submit-form-title {
      padding: 5px 15px;
      border-radius: 5px;
      border: 1px solid #4452cb;
      outline: none;
    }

    .submit-form-file_name {
      margin-right: 20px;
    }

    .input-file {
      border: none;
      // background-color: #4452cb;
    }

    .submit-content {
      width: 100%;
      padding: 10px 20px;
      border: 1px solid #4452cb;
      resize: none;
      outline: none;
      border-radius: 10px;
      margin-bottom: 10px;
    }

    .submit-content::placeholder {
      color: #aaa;
    }

  }
</style>