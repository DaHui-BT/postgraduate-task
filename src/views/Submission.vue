<script setup lang="ts">
import { reactive, ref } from "vue";
import { loadFile } from '@/tools/file_utils'
import { parse_task } from '@/tools/parser'
import type { SubmissionType } from '@/types/submission'
import type { SubmitType } from "@/types/submit";

import SubmitForm from "@/components/SubmitForm.vue";


const is_submit_form_show = ref<boolean>(false)
const submission_status = ['submit', 'checked', 'awarded', 'failed']
const submission_status_color = ['#895ef9fc', '#41d6ba', '#3ddf58', '#f95e85fc']

const submission_list = reactive<SubmissionType[]>([])

function load_data() {
  const ans_text = loadFile('./submission.json')
  const ans_list: number[] = eval('' + ans_text)

  let res = loadFile('./task')?.toString()
  if (res == null) return

  let task_list = parse_task(res);

  task_list.forEach((task: SubmissionType, index: number) => {
    submission_list.push({
      title: task.title,
      date: task.date,
      message: task.message,
      status: ans_list[index],
      file: task.file,
      link: task.link
    })
  })
}
load_data()

function submit(submit_info: SubmitType) {
  if (is_submit_form_show.value == true) {
    if (submit_info.message == "" || submit_info.title == '' || submit_info.file_list.length < 1) {
      alert('Nothing to submit! The form should be completed!')
    } else {
      // submit the data

    }
  }
  is_submit_form_show.value = ! is_submit_form_show.value
  console.log(is_submit_form_show.value, submit_info)
}

</script>

<template>
  <div class="submission">
    <h1>This is an submission page</h1>

    <submit-form :is_submit_form_show="is_submit_form_show" @submit="submit"></submit-form>

    <ul class="submission-content">
      <li class="submission-item" v-for="submission in submission_list" :key="submission.date">
        <div class="submission-func">
          <div class="submission-title">{{ submission.title }}</div>
          <div class="submission-func-container">
            <div class="submission-file">
              <a class="submission-file-item" v-for="(file, index) in submission.file" :key="file"
                                              :href="submission.link[index]" target="_blank">{{ file.slice(0, file.indexOf('.')) }}</a>
            </div>
            <div class="submission-date">{{ submission.date }}</div>
            <div :class="{'submission-status': true, 'submission-status-error': submission.status == 3}"
                 :style="{'backgroundColor': submission_status_color[submission.status]}">
              {{ submission_status[submission.status] }}
            </div>
          </div>
        </div>
        <div class="submission-message">{{ submission.message }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.submission {
  width: 900px;
  min-height: calc(100vh - 60px);
  margin: auto;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 10px #d2d2d2;
  margin-bottom: 30px;

  .submission-content {

    .submission-item {
      margin-bottom: 20px;
      padding: 10px 20px;
      border-radius: 10px;
      border-bottom: 1px solid #eee;
      box-shadow: 0px 0px 10px #eee;
      list-style: none;

      .submission-func {
        display: flex;
        justify-content: space-between;

        .submission-title {
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
        }

        .submission-func-container {
          display: flex;

          .submission-file {
            font-size: 13px;
            color: #ff2020;

            .submission-file-item {
              padding: 3px 5px;
              margin-right: 10px;
              border: 1px solid #eee;
              border-radius: 8px;
              background-color: #00ffea53;
              box-shadow: 0px 0px 5px #79fff8;
              cursor: pointer;
            }
          }

          .submission-date {
            text-align: right;
            font-size: 13px;
            color: #aaa;
            margin-right: 20px;
          }
          
          .submission-status {
            padding: 2px 5px;
            color: #fff;
            border-radius: 3px;
          }
        }

        
      }

      .submission-message {
        color: #666;
      }
    }
  }
}
</style>
