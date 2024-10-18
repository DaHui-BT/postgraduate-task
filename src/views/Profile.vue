<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onMounted, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'

import SubmissionChart from "@/components/SubmissionChart.vue"
import ToolTip from '@/components/Tooltip.vue'
import TaskForm from '@/components/TaskForm.vue'
import PtButton from '@/components/PTButton.vue'


const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const router = useRouter()
const database = new Database()
const submission_list = reactive<Array<TaskType>>([])
let today_finished_task_number = ref<number>(0)
let total_task_number = ref<Element | null>(null)
let today_task_number = ref<Element | null>(null)


onMounted(() => {
  if (database.user?.id == undefined || database.user?.id == null) {
    alert('Please login first')
    router.push({ path: '/login' })
    return
  }
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
      <pt-button class="profile-header-logout" type="warning" @click="logout">Logout</pt-button>
    </section>
    <section class="profile-info">
      <p class="profile-info-email">{{ database.user?.profile.email }}</p>
      <tool-tip message="finished total task number">
        <p class="profile-info-message" ref="total_task_number">total: {{ submission_list.length }}</p>
      </tool-tip>
      <tool-tip message="today finished task number">
        <p class="profile-info-message" ref="today_task_number">today: {{ today_finished_task_number }}</p>
      </tool-tip>
    </section>

    <task-form></task-form>

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
