<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'
import SubmissionChart from "@/components/SubmissionChart.vue"

const { proxy } = getCurrentInstance()
const database = new Database()
const task_list = reactive<Array<TaskType>>([])
let today_finished_task_number = ref<number>(0)


onMounted(() => {
  proxy.$loading.show()
  database.findList('postgraduate-task', 'tasks').then(res => {
    task_list.splice(0, task_list.length)
    res && task_list.push(...res)
  }).finally(() => {
    proxy.$loading.hide()
  })

  database.count('postgraduate-task', 'tasks', {
    date: {
      $gt: new Date(new Date().toLocaleDateString())
    }
  }).then(res => {
    today_finished_task_number.value = res
  })
})

function sticky() {
  alert('stay tuned to be expected')
}

</script>

<template>
  <div class="profile">
    <h2>Profile</h2>
    <section class="profile-info">
      <p class="profile-info-message">total finished tasks number：{{ task_list.length }}</p>
      <p class="profile-info-message">today finished tasks number: {{ today_finished_task_number }}</p>
    </section>
    
    <section class="profile-sticky-container">
      <button class="profile-sticky-button" @click="sticky">Snuggle</button>
      <textarea class="profile-sticky-node" rows="3" placeholder="Mood Post-it notes, post daily mood"></textarea>
    </section>

    <section class="contribute" v-if="task_list.length > 0">
      <submission-chart :task_list="task_list"></submission-chart>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.profile {

  section {
    margin-bottom: 10px;
  }

  .profile-info {

    .profile-info-message {
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
    position: relative;
    bottom: 0;
    margin: auto;
    margin-top: 30px;
    overflow-x: auto;
  }
}
</style>
