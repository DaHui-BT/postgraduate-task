<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue"
import moment from 'moment'

import Database from '@/tools/mongodb'
import type { SubmissionType, TaskType, ObjectId } from '@/types/submission'

import SubmitForm from "@/components/SubmitForm.vue"
import ImageBlock from "@/components/ImageBlock.vue"
import Loading from "@/components/Loading.vue"


const is_image_block_show = ref<boolean>(false)
const is_loading_show = ref<boolean>(false)
const is_submit_form_show = ref<boolean>(false)

const task_status = ['submit', 'checked', 'awarded', 'failed']
const task_status_color = ['#895ef9fc', '#41d6ba', '#3ddf58', '#f95e85fc']
const image_url = ref<null | string>(null)

const submission_list = reactive<SubmissionType[]>([])
const task_list = reactive<TaskType[]>([])
const database = new Database()

function start_loading() { is_loading_show.value = true }
function stop_loading() { is_loading_show.value = false }

async function load_data() {
  start_loading()

  await database.findList('postgraduate-task', 'tasks').then(res => {

    task_list.splice(0, task_list.length)
    submission_list.splice(0, submission_list.length)

    if (res != null) task_list.push(...res)
    task_list.sort((task1, task2) => task2.date.getTime() - task1.date.getTime())

    task_list.forEach(task => {
      if (submission_list.length == 0
          || submission_list.filter(submission => submission.id == moment(task.date).format('YY-MM-DD')).length == 0) {

        submission_list.push({id: moment(task.date).format('YY-MM-DD'), task_list: [task]})
      } else {
        submission_list.map(submission => {
          if (submission.id == moment(task.date).format('YY-MM-DD')) {
            submission.task_list.push(task)
            return
          }
        })
      }
    })
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    stop_loading()
  })
}

onBeforeMount(async () => {
  is_loading_show.value = true
  await load_data()
})

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

function displayImage(imageId: ObjectId) {
  is_image_block_show.value = true
  start_loading()
  image_url.value = null
  database.getImageUrl('postgraduate-task', 'files', imageId).then(res => {
    image_url.value = res
    stop_loading()
  })
}

function display_close() {
  image_url.value = null
  is_image_block_show.value = false
  stop_loading()
}

function submit(submit_info: TaskType) {
  is_submit_form_show.value = ! is_submit_form_show.value

  if (is_submit_form_show.value == false) {
    if (submit_info.message == null || submit_info.title == null
         || submit_info.message.trim().length == 0
         || submit_info.title.trim().length == 0) {
      alert('Nothing to submit! The form should be completed!')
    } else {
      // submit the data
      submit_info.date = new Date()
      database.addOne('postgraduate-task', 'tasks', submit_info)
      load_data()
    }
  }
}

</script>

<template>
  <div class="submission">
    <loading v-if="is_loading_show"></loading>
    <image-block v-if="is_image_block_show" :image_url="image_url" @close="display_close"></image-block>
    <h1>This is the submission page</h1>
    
    <submit-form :is_submit_form_show="is_submit_form_show"
                 @submit="submit"
                 @start_loading="start_loading"
                 @stop_loading="stop_loading"></submit-form>

    <ul class="submission-content" v-if="submission_list.length > 0">
      <li class="submission-item" v-for="(submission, index) in submission_list" :key="submission.id">
        <div class="submission-collapse-container">
          <div class="submission-collapse" @click="toggle">{{ submission.id }}</div>
          <div class="submission-collapse-func">
            <span class="submission-collapse-func-item">Submitted: {{ calNumber(submission.task_list, 0) }}</span>
            <span class="submission-collapse-func-item">Checked: {{ calNumber(submission.task_list, 1) }}</span>
            <span class="submission-collapse-func-item">Awarded: {{ calNumber(submission.task_list, 2) }}</span>
          </div>
        </div>
        
        <div class="submission-item-container" :style="{'display': index == 0 ? 'display' : 'none'}">
          <div class="submission-item-container-content" v-for="(task, inner_index) in submission.task_list" :key="inner_index">
            <div class="submission-func">
              <div class="submission-title">{{ task.title }}</div>
              <div class="submission-func-container">
                <div class="submission-file" v-if="task.file_id_list.length > 0">
                  <div class="submission-file-item" v-for="(file, index) in task.file_name_list" :key="index"
                                                  @click="displayImage(task.file_id_list[index])">{{ file }}</div>
                </div>
                <div class="submission-date">{{ moment(task.date).format('HH:mm:ss') }}</div>
                <div :class="{'submission-status': true, 'submission-status-error': task.status == 3}"
                    :style="{'backgroundColor': task_status_color[task.status]}">
                  {{ task_status[task.status] }}
                </div>
                <!-- <div class="submission-edit">Edit</div>
                <div class="submission-delete">Delete</div> -->
              </div>
            </div>
            <div class="submission-message">{{ task.message }}</div>
            <hr class="submission-line" v-if="inner_index != submission.task_list.length-1">
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

@media screen and (min-width: 350px) and (max-width: 600px) {
  .submission-func {
    flex-direction: column;

    .submission-func-container {
      justify-content: space-between;
    }
  }
}

@media screen and (max-width: 900px){
  .submission {
    width: 95%;
  }
}

.submission {
  max-width: 900px;
  min-width: 350px;
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
                display: flex;
                font-size: 13px;
                color: #8c20ffac;
                max-width: 300px;
                overflow-x: auto;

                .submission-file-item {
                  padding: 3px 5px;
                  margin-right: 10px;
                  height: 30px;
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
                height: 30px;
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
