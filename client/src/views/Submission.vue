<script setup lang="ts">
import { reactive, ref } from "vue";
import { loadFile } from '@/tools/file_utils'
import { parse_task } from '@/tools/parser'
import type { SubmissionType, TaskType } from '@/types/submission'
import type { SubmitType } from "@/types/submit"

import { get_task_list, save_task } from '@/api/task'

import SubmitForm from "@/components/SubmitForm.vue"


const is_submit_form_show = ref<boolean>(false)
const submission_status = ['submit', 'checked', 'awarded', 'failed']
const submission_status_color = ['#895ef9fc', '#41d6ba', '#3ddf58', '#f95e85fc']

const submission_list = reactive<SubmissionType[]>([])

function load_data() {
  // const ans_text = loadFile('./submission.json')
  // const ans_list: number[] = eval('' + ans_text)

  // let res = loadFile('./task')?.toString()
  // let task_list = parse_task(res);
  // console.log(task_list)

  get_task_list().then(({data}) => {
    submission_list.splice(0, submission_list.length)
    if (data == null || data.length == 0) return

    data.forEach((task: TaskType, index: number) => {
      let submission_index = -1
      let date = task.date.split(' ')[0]
      let link: string[] = []
      // task.file = task.file_list
      // console.log(task)

      task.file.forEach((item: string) => {link.push('http://localhost:3000/' + item)})
      
      for (let i = 0; i < submission_list.length; ++ i) {
        if (submission_list[i].id == date) {
          submission_index = i
          break
        }
      }
      if (submission_index == -1) {
        submission_list.push({
          id: date,
          info: [{
            date: task.date,
            title: task.title,
            message: task.message,
            file: task.file,
            status: task.status,
            link: link
          }]
        })
      } else {
        submission_list[submission_index].info.push({
          date: task.date,
          title: task.title,
          message: task.message,
          file: task.file,
          status: task.status,
          link: link
        })
      }
    })
  })

  // let task_list = parse_task(res);

  // task_list.forEach((task: TaskType, index: number) => {
  //   let submission_index = -1

  //   for (let i = 0; i < submission_list.length; ++ i) {
  //     if (submission_list[i].id == task.date) {
  //       submission_index = i
  //       break
  //     }
  //   }
  //   if (submission_index == -1) {
  //     submission_list.push({
  //       id: task.date,
  //       info: [{
  //         date: task.date,
  //         title: task.title,
  //         message: task.message,
  //         file: task.file,
  //         status: ans_list[index] | 0,
  //         link: task.link
  //       }]
  //     })
  //   } else {
  //     submission_list[submission_index].info.push({
  //       date: task.date,
  //       title: task.title,
  //       message: task.message,
  //       file: task.file,
  //       status: ans_list[index] | 0,
  //       link: task.link
  //     })
  //   }
  // })

  // submission_list.sort((s1, s2) => -s1.id.localeCompare(s2.id))
}
load_data()
console.log(submission_list)

function toggle(event: any) {
  if (event.target.parentNode.nextElementSibling.style.display == 'none') {
    event.target.parentNode.nextElementSibling.style.display = 'block'
  } else {
    event.target.parentNode.nextElementSibling.style.display = 'none'
  }
}

function calNumber(info: TaskType[], v: number) {
  let number = 0;
  for (let i of info) {
    if (i.status >= v) number ++
  }
  return number
}

function submit(submit_info: SubmitType) {
  if (is_submit_form_show.value == true) {
    if (submit_info.message == "" || submit_info.title == '' || submit_info.file_list.length < 1) {
      alert('Nothing to submit! The form should be completed!')
    } else {
      // submit the data
      // console.log("submit: ", submit_info)
      save_task(submit_info)
    }
  }
  is_submit_form_show.value = ! is_submit_form_show.value
  // console.log(is_submit_form_show.value, submit_info)
  load_data()
}

</script>

<template>
  <div class="submission">
    <h1>This is an submission page</h1>

    <submit-form :is_submit_form_show="is_submit_form_show" @submit="submit"></submit-form>

    <ul class="submission-content" v-if="submission_list.length > 0">
      <li class="submission-item" v-for="(submission, index) in submission_list" :key="submission.id">
        <div class="submission-collapse-container">
          <div class="submission-collapse" @click="toggle">{{ submission.id }}</div>
          <div class="submission-collapse-func">
            <span class="submission-collapse-func-item">Submitted: {{ calNumber(submission.info, 0) }}</span>
            <span class="submission-collapse-func-item">Checked: {{ calNumber(submission.info, 1) }}</span>
            <span class="submission-collapse-func-item">Awarded: {{ calNumber(submission.info, 2) }}</span>
          </div>
        </div>
        
        <div class="submission-item-container" :style="{'display': index == 0 ? 'display' : 'none'}">
          <div class="submission-item-container-content" v-for="(info, inner_index) in submission.info" :key="info.message">
            <div class="submission-func">
              <div class="submission-title">{{ info.title }}</div>
              <div class="submission-func-container">
                <div class="submission-file">
                  <a class="submission-file-item" v-for="(file, index) in info.file" :key="file"
                                                  :href="info.link[index]"
                                                  target="_blank">{{ file.slice(file.lastIndexOf('\\')+1, file.lastIndexOf('-')) }}</a>
                </div>
                <div class="submission-date">{{ info.date.split(' ')[1] }}</div>
                <div :class="{'submission-status': true, 'submission-status-error': info.status == 3}"
                    :style="{'backgroundColor': submission_status_color[info.status]}">
                  {{ submission_status[info.status] }}
                </div>
              </div>
            </div>
            <div class="submission-message">{{ info.message }}</div>
            <hr class="submission-line" v-if="inner_index != submission.info.length-1">
          </div>
        </div>
      </li>
    </ul>
    <div class="empty" v-else>
      Nothing to show!
    </div>
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

      .submission-collapse-container {
        
        .submission-collapse {
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
        }

        .submission-collapse-func {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .submission-collapse-func-item {
            color: #999;
            font-size: 13px;
            border-bottom: 1px solid #eee;
          }
        }
      }

      .submission-item-container {

        .submission-item-container-content {
          padding-left: 10px;

          .submission-line {
            background-color: #eee;
            border: 1px solid #eee;
            margin-top: 5px;
            margin-bottom: 15px;
          }

          .submission-func {
            display: flex;
            justify-content: space-between;

            .submission-title {
              font-size: 17px;
              font-weight: 600;
              cursor: pointer;
            }

            .submission-func-container {
              display: flex;

              .submission-file {
                font-size: 13px;
                color: #8c20ffac;

                .submission-file-item {
                  padding: 3px 5px;
                  margin-right: 10px;
                  border: 1px solid #eee;
                  border-radius: 8px;
                  background-color: #00ffea53;
                  box-shadow: 0px 0px 5px #79fff8;
                  cursor: pointer;
                  white-space: nowrap;
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
        }
      }

      .submission-message {
        color: #666;
      }
    }
  }
}
</style>
