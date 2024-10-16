<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'

import ScreenMask from "@/components/ScreenMask.vue"
import FormTable from '@/components/FormTable.vue'


const emit = defineEmits(['close', 'show'])
let props = defineProps({
  is_update: {
    type: Boolean,
    required: true
  }
})

const { proxy } = getCurrentInstance()
const database = new Database()
const form_list = ref<TaskType>({
  task_list: [{
    name: '',
    describe: ''
  }]
})

onMounted(() => {
  proxy.$loading.show()
  database.findOne('postgraduate-task', 'task').then(res => {
    if (res != null) {
      form_list.value = res
    }
  }).finally(() => {
    proxy.$loading.hide()
  })

})

function formAdd() {
  form_list.value.task_list.push({
    name: '',
    describe: ''
  })
}

function submitForm() {
  console.log(form_list)
  for (let form of form_list.value.task_list) {
    if (form.name.trim().length == 0 || form.describe.trim().length == 0) {
      alert('name or describe must not be null')
      return
    }
  }
  
  form_list.value.date = new Date()
  proxy.$loading.show()
  if (props.is_update) {
    database.updateOne('postgraduate-task', 'task', {_id: {$eq: form_list.value._id}}, form_list.value).then(res => {
      alert('update success')
      closeForm()
    }).finally(() => {
      proxy.$loading.hide()
    })
  } else {
    database.addOne('postgraduate-task', 'task', form_list.value).then(res => {
      console.log(res)
      alert('submit success')
      closeForm()
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      proxy.$loading.hide()
    })
  }
}

function closeForm() {
  // is_show_screen_mask.value = false
  emit('close')
}

</script>

<template>
  <screen-mask>
    <form-table @close="closeForm" @submit="submitForm">
      <ol class="task-form">
        <li class="task-form-item" v-for="(form, index) in form_list.task_list" :key="form">
          <span class="task-form-item-number">{{ index + 1 }}.</span>
          <input class="task-form-input task-form-input-name" placeholder="task name" v-model="form.name">
          <input class="task-form-input" placeholder="task describe" v-model="form.describe">
          <button class="task-form-add" @click="formAdd">+</button>
        </li>
      </ol>
    </form-table>
  </screen-mask>
</template>

<style lang="scss" scoped>
.task-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  // padding: 30px 20px;
  background-color: #fff;
  border-radius: 5px;

  .task-form-item {
    margin-bottom: 10px;

    .task-form-item-number {
      color: #66e3be;
      margin-right: 5px;
    }

    .task-form-input {
      margin-right: 5px;
      padding: 5px 10px;
      border: 1px solid #66e3be;
      border-radius: 5px;
    }

    .task-form-input-name {
      width: 100px;
    }

    .task-form-add {
      padding: 5px 9px;
      color: #fff;
      font-weight: bold;
      // background-color: rgba(213, 140, 37, 0.978);
      background-color: #66e3be;
      border-radius: 50%;
    }
  }
}
</style>
