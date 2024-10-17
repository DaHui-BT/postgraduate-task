<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'

import SubmissionChart from "@/components/SubmissionChart.vue"
import ToolTip from '@/components/Tooltip.vue'
import TaskForm from '@/components/TaskForm.vue'
import PtButton from '@/components/PTButton.vue'


const { proxy } = getCurrentInstance()
const database = new Database()
const is_show_screen_mask = ref<boolean>(false)
const is_update = ref<boolean>(false)
const submission_list = reactive<Array<TaskType>>([])
const task = ref<TaskType>()
let today_finished_task_number = ref<number>(0)
let total_task_number = ref<Element>(null)
let today_task_number = ref<Element>(null)


onMounted(() => {
  proxy.$loading.show()
  database.findList('postgraduate-task', 'submission', {user_id: {$eq: database.user.id}}).then(res => {
    submission_list.splice(0, submission_list.length)
    res && submission_list.push(...res)
  }).finally(() => {
    proxy.$loading.hide()
  })

  database.count('postgraduate-task', 'submission', {
    date: {
      $gt: new Date(new Date().toLocaleDateString())
    },
    user_id: {
      $eq: database.user.id
    }
  }).then(res => {
    today_finished_task_number.value = res
  })

  database.findOne('postgraduate-task', 'task', {user_id: {$eq: database.user.id}}).then(res => {
    task.value = res
    
    database.findOne('postgraduate-task', 'task', {user_id: {$eq: database.user.id}}).then(res => {
      task.value = res
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

function sticky() {
  alert('stay tuned to be expected')
}

function addTask() {
  is_show_screen_mask.value = true
  is_update.value = false
}

function edit_task() {
  is_show_screen_mask.value = true
  is_update.value = true
}

function delete_task() {
  let val = confirm(`is ready to delete task!`)
  if (!val) {
    // alert('operate already canceled!')
    proxy.$notification.show('Canceled', 'operate already canceled!')
    return
  }

  // is_show_screen_mask.value = true
  proxy.$loading.show()
  database.deleteOne('postgraduate-task', 'task', {name: {$ne: ''}}).then(res => {
    // alert('delete success!')
    proxy.$notification.show('Success', 'delete task successfully!')
    database.findOne('postgraduate-task', 'task', {user_id: {$eq: database.user.id}}).then(res => {
      task.value = res
    }).catch(err => {
      console.log(err)
    })
  }).finally(() => {
    proxy.$loading.hide()
  })
}
</script>

<template>
  <div class="profile">
    <h2>Profile</h2>
    <section class="profile-info">
      <p class="profile-info-email">{{ database.user.profile.email }}</p>
      <tool-tip message="finished total task number">
        <p class="profile-info-message" ref="total_task_number">total: {{ submission_list.length }}</p>
      </tool-tip>
      <tool-tip message="today finished task number">
        <p class="profile-info-message" ref="today_task_number">today: {{ today_finished_task_number }}</p>
      </tool-tip>
    </section>

    <section class="profile-task">
      <pt-button class="profile-task-edit" v-if="task" @click="edit_task">Edit</pt-button>
      <pt-button class="profile-task-delete" v-if="task" type="danger" @click="delete_task">Delete</pt-button>
      <blockquote class="profile-task-container" v-if="task">
        <li class="profile-task-item" v-for="item in task.task_list" :key="item">
          <div class="profile-task-item-name">
            <p class="profile-task-item-name-title">{{ item.name }}</p>
          </div>
          <p class="profile-task-item-descirbe">{{ item.describe }}</p>
        </li>
      </blockquote>
      <blockquote class="profile-task-no" v-else>no task to finish, to define your <span class="profile-task-no-add" @click="addTask">tasks</span></blockquote>
    </section>

    <task-form v-show="is_show_screen_mask" @close="() => is_show_screen_mask = false" :is_update="is_update"></task-form>
    
    <!-- <section class="profile-sticky-container">
      <button class="profile-sticky-button" @click="sticky">Snuggle</button>
      <textarea class="profile-sticky-node" rows="3" placeholder="Mood Post-it notes, post daily mood"></textarea>
    </section> -->

    <section class="contribute">
      <submission-chart :submission_list="submission_list"></submission-chart>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.profile {

  section {
    margin-bottom: 30px;
  }

  .profile-info {
    display: flex;
    justify-content: space-between;

    .profile-info-message {
      display: inline-block;
      color: #999;
    }
  }

  .profile-task {

    .profile-task-edit {
      // padding: 5px 10px;
      // background-color: #35d8ea;
      // border-radius: 5px;
      // color: #fff;
      // font-weight: bold;
      // margin-right: 5px;
    }
    
    .profile-task-delete {
      // padding: 5px 10px;
      // background-color: #ea3535;
      // border-radius: 5px;
      // color: #fff;
      // font-weight: bold;
    }

    .profile-task-container {
      position: relative;
      
      .profile-task-item {
        margin-top: 20px;

        .profile-task-item-name {
          position: relative;
          border-top: 1px solid #dcdfe6;
          padding: 10px 0px;

          .profile-task-item-name-title {
            position: absolute;
            margin-left: 10px;
            padding: 0 10px;
            font-weight: bold;
            transform: translateY(-100%);
            background-color: #eee;
          }
        }

        .profile-task-item-descirbe {
          margin-left: 20px;
        }
      }
    }

    .profile-task-no {
      min-height: 100px;

      .profile-task-no-add {
        color: #409EFF;
        cursor: pointer;
      }
    }
  }

  .profile-sticky-container {

    .profile-sticky-button {
      padding: 5px 10px;
      background-color: #35d8ea;
      border-radius: 5px;
      color: #fff;
      font-weight: bold;
    }

    .profile-sticky-node {
      padding: 10px 20px;
      width: 100%;
      font-size: 14px;
      border: 1px solid #35d8ea;
      border-radius: 5px;
    }
  }

  
  .contribute {
    bottom: 0;
    margin: auto;
    margin-top: 30px;
    overflow-x: auto;
  }
}
</style>
