<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onMounted, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'
import type { UserType } from '@/types/user'

import SubmissionChart from "@/components/SubmissionChart.vue"
import ToolTip from '@/components/Tooltip.vue'
import TaskForm from '@/components/TaskForm.vue'
import PtButton from '@/components/PTButton.vue'
import UserInfoForm from '@/components/UserInfoForm.vue'


const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const router = useRouter()
const database = new Database()
const submission_list = reactive<Array<TaskType>>([])
let is_show_edit = ref<boolean>(false)
let today_finished_task_number = ref<number>(0)
let total_task_number = ref<Element | null>(null)
let today_task_number = ref<Element | null>(null)
let user_info = ref<UserType>({
  username: '',
  email: '',
  describe: ''
})


onMounted(() => {
  if (database.user?.id == undefined || database.user?.id == null) {
    alert('Please login first')
    router.push({ path: '/login' })
    return
  }
  database.findOne<UserType>('postgraduate-task', 'user', {_id: {$eq: database.user.id}}).then(res => {
    if (res == null) {
      database.addOne('postgraduate-task', 'user',
                            {
                              _id: database.user?.id,
                              username: 'YaYa',
                              email: database.user?.profile.email,
                              describe: 'Nothing left',
                              register_date: new Date(),
                              update_date: new Date(),
                              status: 0
                            }).catch(err => {
        proxy?.$notification.show('Error', err.error)
      })
    }
    res != null && (user_info.value = res)
  })
  proxy?.$loading.show()
  database.findList<TaskType>('postgraduate-task', 'submission', {user_id: {$eq: database.user.id}}).then((res: TaskType[] | null) => {
    submission_list.splice(0, submission_list.length)
    res && submission_list.push(...res)
  }).finally(() => {
    proxy?.$loading.hide()
  })
  
  database.count('postgraduate-task', 'submission', {
    date: {
      $gte: new Date(moment().format('YYYY-MM-DD'))
    },
    user_id: {
      $eq: database.user.id
    }
  }).then((res: number) => {
    today_finished_task_number.value = res
  })
})

function edit() {
  is_show_edit.value = true
}

function close(info: UserType) {
  console.log(info)
  info && (user_info.value = info)
  is_show_edit.value = false
}

function logout() {
  database.user?.logOut()
  localStorage.clear()
  router.push({path: '/'})
}

</script>

<template>
  <div class="profile">
    <section class="profile-header">
      <h2 class="profile-header-title">Profile</h2>
      <div class="profile-header-container">
        <pt-button class="profile-header-edit" type="primary" @click="edit">Edit</pt-button>
        <pt-button class="profile-header-logout" type="warning" @click="logout">Logout</pt-button>
      </div>
    </section>
    <section class="profile-info">
      <p class="profile-info-username">Username: {{ user_info?.username }}</p>
      <p class="profile-info-email">Email: {{ user_info?.email }}</p>
      <tool-tip message="finished total task number">
        <p class="profile-info-message" ref="total_task_number">total: {{ submission_list.length }}</p>
      </tool-tip>
      <tool-tip message="today finished task number">
        <p class="profile-info-message" ref="today_task_number">today: {{ today_finished_task_number }}</p>
      </tool-tip>
    </section>
    <blockquote class="profile-info-describe">Describe: {{ user_info.describe }}</blockquote>
    <br>
    <task-form></task-form>
    <user-info-form v-if="is_show_edit" @close="close" :user_info="user_info"></user-info-form>

    <section class="contribute">
      <submission-chart v-if="submission_list.length > 0" :submission_list="submission_list"></submission-chart>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.profile {

  section {
    margin-bottom: 30px;
  }

  .profile-header {
    display: flex;
    justify-content: space-between;

    .profile-header-container {
      
      .profile-header-logout {
        margin-left: 10px;
      }
    }
  }

  .profile-info {
    display: flex;
    justify-content: space-between;

    .profile-info-message {
      display: inline-block;
      color: #999;
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
