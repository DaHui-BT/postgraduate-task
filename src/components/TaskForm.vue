<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'

import ScreenMask from "@/components/ScreenMask.vue"
import FormTable from '@/components/FormTable.vue'
import PtInput from '@/components/PTInput.vue'
import PtButton from '@/components/PTButton.vue'


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
  user_id: database.user.id,
  task_list: [{
    name: '',
    describe: ''
  }]
})

onMounted(() => {
  proxy.$loading.show()
  database.findOne('postgraduate-task', 'task', { user_id: { $eq: database.user.id} }).then(res => {
    if (res != null) {
      form_list.value = res
    }
  }).finally(() => {
    proxy.$loading.hide()
  })

})

function taskAdd() {
  form_list.value.task_list.push({
    name: '',
    describe: ''
  })
}

function taskDelete(index: number) {
  if (form_list.value.task_list.length == 1) {
    alert('at least one task')
    return
  }
  form_list.value.task_list.splice(index, 1)
}

function submitForm() {
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
      proxy.$notification.show('Success', 'update task successfully!')
      closeForm()
    }).finally(() => {
      proxy.$loading.hide()
    })
  } else {
    database.addOne('postgraduate-task', 'task', form_list.value).then(res => {
      console.log(res)
      // alert('submit success')
      proxy.$notification.show('Success', 'submit task successfully!')
      closeForm()
    }).catch(err => {
      console.log(err)
      proxy.$notification.show('Error', 'update task error!')
    }).finally(() => {
      proxy.$loading.hide()
    })
  }

  database.findOne('postgraduate-task', 'task', { user_id: { $eq: database.user.id} }).then(res => {
    form_list.value = res
  })
}

function closeForm() {
  // is_show_screen_mask.value = false
  emit('close')
}

</script>

<template>
  <screen-mask>
    <form-table @close="closeForm">
      <template #form>
        <ol class="task-form">
          <li class="task-form-item" v-for="(form, index) in form_list.task_list" :key="form">
            <span class="task-form-item-number">{{ index + 1 }}.</span>
            <pt-input class="task-form-input" width="150px" v-model="form.name" placeholder="name"></pt-input>
            <pt-input class="task-form-input" v-model="form.describe" placeholder="describe"></pt-input>
            <pt-button type="danger" plain circle @click="taskDelete(index)">-</pt-button>
          </li>
        </ol>
      </template>
      <template #button>
        <pt-button class="task-form-button" type="primary" @click="submitForm">Submit</pt-button>
        <pt-button class="task-form-button" @click="taskAdd">Add</pt-button>
      </template>
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
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .task-form-item-number {
      color: #6c6f6e;
      margin-right: 5px;
    }

    .task-form-input {
      margin-right: 5px;
    }
  }
}

.task-form-button {
  margin-left: 10px;
}
</style>
