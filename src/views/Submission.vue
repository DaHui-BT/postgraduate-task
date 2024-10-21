<script setup lang="ts">
import { onBeforeMount, reactive, ref, getCurrentInstance, type ComponentPublicInstance } from "vue"
import { useRouter } from "vue-router"
import moment from 'moment'

import Database from '@/tools/mongodb'
import type { SubmissionType, SubmissionListType, ObjectId } from '@/types/submission'

import ImageBlock from "@/components/ImageBlock.vue"
import PtButton from '@/components/PTButton.vue'
import ScreenMask from '@/components/ScreenMask.vue'
import FormTable from '@/components/FormTable.vue'
import PtInput from '@/components/PTInput.vue'
import PtUpload from '@/components/PTUpload.vue'


const is_image_block_show = ref<boolean>(false)
const is_submit_form_show = ref<boolean>(false)

const router = useRouter()
const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const task_status = ['submit', 'checked', 'awarded', 'failed']
const task_status_color = ['#895ef9fc', '#41d6ba', '#3ddf58', '#f95e85fc']
const image_url = ref<null | string>(null)
let is_show_submission_option = ref<boolean>(false)
let show_submission_content_number = ref<number>(0)

const database = new Database()
let show_user_id = ref<string | null>(database.user?.id)
const submission_list = reactive<SubmissionListType[]>([])
const task_list = reactive<SubmissionType[]>([])
const submission_info = reactive<SubmissionType>({
  user_id: database.user?.id,
  file_id_list: [],
  file_name_list: [],
  date: new Date(),
  title: '',
  message: '',
  status: 0
})

async function load_data() {
  proxy?.$loading.show()
  await database.findList<SubmissionType>('postgraduate-task', 'submission', {user_id: {$eq: show_user_id.value}})
                .then((res: SubmissionType[] | null) => {
    task_list.splice(0, task_list.length)
    submission_list.splice(0, submission_list.length)

    if (res != null) task_list.push(...res)
    task_list.sort((task1, task2) => task2.date.getTime() - task1.date.getTime())

    task_list.forEach(task => {
      if (submission_list.length == 0 || submission_list
          .filter(submission => submission.id == moment(task.date).format('YY-MM-DD')).length == 0) {

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
    proxy?.$notification.show('Error', err)
    console.log(err)
  }).finally(() => {
    proxy?.$loading.hide()
  })
}

onBeforeMount(async () => {
  console.log(router.currentRoute.value.query._id)
  if (router.currentRoute.value.query._id) {
    show_user_id.value = router.currentRoute.value.query._id.toString()
  } else {
    show_user_id.value = database.user?.id
  }
  await load_data()
})

function toggle(index: number) {
  if (show_submission_content_number.value == index) {
    show_submission_content_number.value = -1
  } else {
    show_submission_content_number.value = index
  }
}

function calNumber(submission_list: SubmissionType[], v: number) {
  let number = 0;
  for (let submission of submission_list) {
    if (submission.status >= v) number ++
  }
  return number
}

function displayImage(imageId: ObjectId) {
  proxy?.$loading.show()
  image_url.value = null
  database.getImageUrl('postgraduate-task', 'files', imageId).then((res: string | null) => {
    image_url.value = res
    proxy?.$loading.hide()
    is_image_block_show.value = true
  })
}

function display_close() {
  image_url.value = null
  is_image_block_show.value = false
}

function submit() {
  is_submit_form_show.value = ! is_submit_form_show.value

  if (is_submit_form_show.value == false) {
    if (submission_info.message == null || submission_info.title == null
         || submission_info.message.trim().length == 0
         || submission_info.title.trim().length == 0) {
      alert('Nothing to submit! The form should be completed!')
    } else {
      // submit the data
      submission_info.date = new Date()
      database.addOne('postgraduate-task', 'submission', submission_info).then(() => {
        proxy?.$notification.show('Success', 'add submission successfully!')
        load_data()
        submission_info.file_id_list = []
        submission_info.file_name_list = []
        submission_info.message = ''
        submission_info.title = ''
      })
    }
  }
}

async function delete_task(submission: SubmissionType) {
  let val = confirm(`is ready to delete ${submission.title}!`)
  if (val) {
    let token = prompt('input your delete token')
    if (token != 'delete') {
      return
    }
    proxy?.$loading.show()
    
    await database.findOne<SubmissionType>('postgraduate-task', 'submission', {_id: submission._id}).then((res: SubmissionType | null) => {
      if (res && res.file_id_list && res.file_id_list.length > 0) {
        database.deleteMany('postgraduate-task', 'files', {_id: {$in: res.file_id_list}})
      }
      if (res) database.deleteOne('postgraduate-task', 'submission', {_id: res._id})
      load_data()
    }).finally(() => {
      proxy?.$loading.hide()
    })
  } else {
    proxy?.$notification.show('Cancel', 'operate already canceled!')
  }
}

function uploadFile(files: Array<File>) {
  proxy?.$loading.show()
  for (let file of files) {
    // save to backend
    database.uploadFile('postgraduate-task', 'files', file).then(res => {
      submission_info.file_id_list?.push(res.insertedId)
      submission_info.file_name_list?.push(res.file_name)
    }).catch(err => {
      console.log(err)
      proxy?.$notification('Error', 'upload file error, please try again later')
    }).finally(() => {
      proxy?.$loading.hide()
    })
  }
}

function changeStatus(task: SubmissionType, value: number) {
  if (database.user?.id == '670a8dc865ba7090dcbfa4e3' && value < task_status.length) {
    if (confirm(`confirm to change status to ${task_status[value]}`)) {
      task.status = value
      proxy?.$loading.show()
      database.updateOne('postgraduate-task', 'submission', {_id: task._id}, {status: value}).then(() => {
        proxy?.$notification.show('Success', 'update status successfully')
      }).catch(err => {
        proxy?.$notification.show('Error', err.error)
      }).finally(() => {
        proxy?.$loading.hide()
      })
    } else {
      proxy?.$notification.show('Cancel', 'cancel operate successfully')
    }
  } else {
    proxy?.$notification.show('No Permission', 'you have no permission!')
  }
  
  is_show_submission_option.value = false
}
</script>

<template>
  <div class="submission">
    <image-block v-if="is_image_block_show" :image_url="image_url" @close="display_close"></image-block>
    <h1>This is the submission page</h1>
    
    <pt-button class="submit-button" type="primary" @click="submit">submit</pt-button>

    <screen-mask v-if="is_submit_form_show">
      <form-table @close="() => is_submit_form_show = false" @submit="submit">
        <template #form>
          <pt-input placeholder="title" v-model="submission_info.title"></pt-input>
          <pt-upload @on-change="uploadFile" accept=".png, .jpg, .jpeg" :uploaded_files="submission_info.file_name_list"></pt-upload>
          <pt-input placeholder="message" v-model="submission_info.message"></pt-input>
        </template>
      </form-table>
    </screen-mask>

    <ul class="submission-content" v-if="submission_list?.length > 0">
      <li class="submission-item" v-for="(submission, index) in submission_list" :key="submission.id">
        <div class="submission-collapse-container">
          <div class="submission-collapse" @click="toggle(index)">{{ submission.id }}</div>
          <div class="submission-collapse-func">
            <span class="submission-collapse-func-item">Submitted: {{ calNumber(submission.task_list, 0) }}</span>
            <span class="submission-collapse-func-item">Checked: {{ calNumber(submission.task_list, 1) }}</span>
            <span class="submission-collapse-func-item">Awarded: {{ calNumber(submission.task_list, 2) }}</span>
          </div>
        </div>
        
        <div class="submission-item-container" v-if="show_submission_content_number == index">
          <div class="submission-item-container-content"
               v-for="(task, inner_index) in submission.task_list" :key="inner_index">
            <div class="submission-func">
              <div class="submission-title" @click="delete_task(task)">{{ task.title }}</div>
              <div class="submission-func-container">
                <div class="submission-file" v-if="task.file_id_list?.length > 0">
                  <div class="submission-file-item" v-for="(file, index) in task.file_name_list" :key="index"
                                                  @click="displayImage(task.file_id_list[index])">{{ file }}</div>
                </div>
                <div class="submission-date">{{ moment(task.date).format('HH:mm:ss') }}</div>
                <pt-button v-if="!is_show_submission_option" :class="{'submission-status': true, 'submission-status-error': task.status == 3}"
                    :style="{'backgroundColor': task_status_color[task.status]}"
                    @click="is_show_submission_option = true">
                  {{ task_status[task.status] }}
                </pt-button>
                <select class="submission-option" v-else :style="{'backgroundColor': task_status_color[task.status]}">
                  <option class="submission-option-item"
                          v-for="(option, index) in task_status"
                          :value="index" :key="index" :selected="task.status == index"
                          @click="changeStatus(task, index)">{{ option }}</option>
                </select>
              </div>
            </div>
            <div class="submission-message">{{ task.message }}</div>
            <hr class="submission-line" v-if="inner_index != submission.task_list?.length-1">
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

.submission {

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
                font-weight: 500;
                border-radius: 3px;
                height: 30px;
              }

              .submission-option {
                padding: 5px 10px;
                border: 1px solid #eee;
                border-radius: 5px;
                color: #fff;
                outline: none;
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
