<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, type ComponentPublicInstance } from 'vue'

import Database from '@/tools/mongodb'

import ScreenMask from "@/components/ScreenMask.vue"
import FormTable from '@/components/FormTable.vue'
import PtInput from '@/components/PTInput.vue'
import PtButton from '@/components/PTButton.vue'
import type { UserType } from '@/types/user'


const emits = defineEmits(['close'])
const props = defineProps(['user_info'])
const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const database = new Database()
const user_info = ref<UserType>(props.user_info)

onMounted(() => {
  proxy.$loading.show()
  database.user?.id && database.findOne<UserType>('postgraduate-task', 'user', { _id: { $eq: database.user.id} })
          .then((res: UserType | null) => {
    if (res != null) {
      user_info.value = res
    }
  }).catch(err => {
    proxy.$notification.show('Error', err.error)
    console.log(err)
  }).finally(() => {
    proxy.$loading.hide()
  })
})

function submitForm() {
  if (user_info.value.username.trim().length == 0) {
    alert('username must not be null')
    return
  }
  user_info.value.update_date = new Date()
  proxy?.$loading.show()
  database.updateOne('postgraduate-task', 'user', {_id: {$eq: user_info.value._id}}, user_info.value).then(() => {
    proxy?.$notification.show('Success', 'update user information successfully!')
    closeForm(user_info.value)
  }).finally(() => {
    proxy?.$loading.hide()
  })
}

function closeForm(user_info: UserType) {
  emits('close', user_info)
}

</script>

<template>
  <screen-mask>
    <form-table @close="closeForm">
      <template #form>
        <pt-input class="task-form-input" v-model="user_info.username" placeholder="username"></pt-input><br>
        <pt-input class="task-form-input" v-model="user_info.describe" placeholder="describe"></pt-input>
      </template>
      <template #button>
        <pt-button class="task-form-button" type="primary" @click="submitForm">Submit</pt-button>
      </template>
    </form-table>
  </screen-mask>
</template>

<style lang="scss" scoped>

.task-form-input {
  margin-bottom: 10px;
}

.task-form-button {
  margin-left: 10px;
}
</style>
