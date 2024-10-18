<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, type ComponentPublicInstance } from 'vue'

import Database from '@/tools/mongodb'
import type { TaskType } from '@/types/task'

import ScreenMask from "@/components/ScreenMask.vue"
import FormTable from '@/components/FormTable.vue'
import PtInput from '@/components/PTInput.vue'
import PtButton from '@/components/PTButton.vue'


const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const database = new Database()
const is_show_screen_mask = ref<boolean>(false)
const is_update = ref<boolean>(false)
const task = ref<TaskType>({
  user_id: database.user?.id,
  task_list: []
})

onMounted(() => {
  proxy.$loading.show()
  database.user?.id && database.findOne<TaskType>('postgraduate-task', 'task', { user_id: { $eq: database.user.id} })
          .then((res: TaskType | null) => {
    if (res != null) {
      task.value = res
    }
  }).catch(err => {
    proxy.$notification.show('Error', err.error)
    console.log(err)
  }).finally(() => {
    proxy.$loading.hide()
  })
})

function taskAdd() {
  task.value.task_list.push({
    name: '',
    describe: ''
  })
}

function taskDelete(index: number) {
  if (task.value.task_list.length == 1) {
    alert('at least one task')
    return
  }
  task.value.task_list.splice(index, 1)
}

function submitForm() {
  for (let form of task.value.task_list) {
    if (form.name.trim().length == 0 || form.describe.trim().length == 0) {
      alert('name or describe must not be null')
      return
    }
  }
  
  task.value.date = new Date()
  proxy?.$loading.show()
  if (is_update.value) {
    database.updateOne('postgraduate-task', 'task', {_id: {$eq: task.value._id}}, task.value).then(() => {
      proxy?.$notification.show('Success', 'update task successfully!')
      closeForm()
    }).finally(() => {
      proxy?.$loading.hide()
    })
  } else {
    database.addOne('postgraduate-task', 'task', task.value).then(() => {
      proxy?.$notification.show('Success', 'submit task successfully!')
      closeForm()
    }).catch(err => {
      console.log(err)
      proxy?.$notification.show('Error', err.error)
    }).finally(() => {
      proxy?.$loading.hide()
    })
  }
}

function closeForm() {
  is_show_screen_mask.value = false
}


function addTask() {
  is_show_screen_mask.value = true
  is_update.value = false
  task.value.task_list.push({name: '', describe: ''})
}

function edit_task() {
  is_show_screen_mask.value = true
  is_update.value = true
}

function delete_task() {
  let val = confirm(`is ready to delete task!`)
  if (!val) {
    // alert('operate already canceled!')
    proxy?.$notification.show('Canceled', 'operate already canceled!')
    return
  }

  proxy?.$loading.show()
  database.deleteOne('postgraduate-task', 'task', {name: {$ne: ''}, user_id: {$eq: database.user.id}}).then(() => {
    proxy?.$notification.show('Success', 'delete task successfully!')
    task.value.task_list = []
  }).finally(() => {
    proxy?.$loading.hide()
  })
}
</script>

<template>
  <div class="task-from">
    <section class="profile-task">
      <pt-button class="profile-task-edit" v-if="task.task_list.length > 0" @click="edit_task">Edit</pt-button>
      <pt-button class="profile-task-delete" v-if="task.task_list.length > 0" type="danger" @click="delete_task">Delete</pt-button>
      <blockquote class="profile-task-container" v-if="task.task_list.length > 0">
        <li class="profile-task-item" v-for="item in task.task_list" :key="item.name">
          <div class="profile-task-item-name">
            <p class="profile-task-item-name-title">{{ item.name }}</p>
          </div>
          <p class="profile-task-item-descirbe">{{ item.describe }}</p>
        </li>
      </blockquote>
      <blockquote class="profile-task-no" v-else>
        no task to finish, to define your 
        <span class="profile-task-no-add" @click="addTask">tasks</span>
      </blockquote>
    </section>

    <screen-mask v-if="is_show_screen_mask">
      <form-table @close="closeForm">
        <template #form>
          <ol class="task-form-content">
            <li class="task-form-item" v-for="(task, index) in task.task_list" :key="task">
              <span class="task-form-item-number">{{ index + 1 }}.</span>
              <pt-input class="task-form-input" width="150px" v-model="task.name" placeholder="name"></pt-input>
              <pt-input class="task-form-input" v-model="task.describe" placeholder="describe"></pt-input>
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
  </div>
</template>

<style lang="scss" scoped>

.profile-task {

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
.task-form-content {
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
