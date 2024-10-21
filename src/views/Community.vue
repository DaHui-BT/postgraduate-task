<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance, type ComponentPublicInstance } from 'vue'
import moment from 'moment'

import type { UserType } from '@/types/user'

import Database from '@/tools/mongodb'
import PtButton from '@/components/PTButton.vue'
import type { TaskType } from '@/types/task'


const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const router = useRouter()
const database = new Database()
const user_list = reactive<UserType[]>([])

proxy.$loading.show()
database.findList<Array<UserType>>('postgraduate-task', 'user').then(async (res: Array<UserType> | null) => {
  user_list.splice(0, user_list.length)
  if (res) {
    for (let user of res) {
      await database.count('postgraduate-task', 'submission', {user_id: {$eq: user._id}}).then(res => {
        user.total_finish_task_num = res
      })
      
      await database.count('postgraduate-task', 'submission', {
        date: {
          $gte: new Date(moment().format('YYYY-MM-DD'))
        },
        user_id: {
          $eq: user._id
        }
      }).then((res: number) => {
        user.today_finish_task_num = res
      })

      await database.findOne<TaskType>('postgraduate-task', 'task', {user_id: {$eq: user._id}}).then(res => {
        res && (user.task_list = res.task_list)
      })

      user_list.push(user)
    }
  }
}).finally(() => {
  proxy.$loading.hide()
})

function showDescribe(user_id: string) {
  router.push({
    path: '/submission',
    query: {
      '_id': user_id
    }
  })
}
</script>

<template>
  <div class="community">
    <h2 class="community">Community</h2>
    <div class="community-user-container">
      <div class="community-user-item" v-for="user in user_list" :key="user._id">
        <table class="community-user-table">
          <tr class="community-user-table-info">
            <td class="community-user-table-title">Username</td>
            <td>{{ user.username }}</td>
            <td class="community-user-table-title">Email</td>
            <td>{{ user.email }}</td>
          </tr>
          
          <tr class="community-user-table-date">
            <td class="community-user-table-title">Register Date</td>
            <td>{{ moment(user.register_date).format('YY-MM-DD HH:mm:ss') }}</td>
            <td class="community-user-table-title">Lastest Submit Date</td>
            <td>{{ moment(user.update_date).format('YY-MM-DD HH:mm:ss') }}</td>
          </tr>
          
          <tr class="community-user-table-status">
            <td class="community-user-table-title">Total Finishing Tasks</td>
            <td>{{ user.total_finish_task_num }}</td>
            <td class="community-user-table-title">Today Finishing Tasks</td>
            <td>{{ user.today_finish_task_num }}</td>
          </tr>

          <tr class="community-user-table-describe">
            <td class="community-user-table-title">Describe</td>
            <td colspan="3">{{ user.describe }}</td>
          </tr>

          <tr class="community-user-table-task">
            <td class="community-user-table-title">Task</td>
            <td colspan="3" class="community-user-table-task-container">
              <li v-for="task in user.task_list" :key="task.name">
                <span class="community-user-table-task-name">{{ task.name }}: </span>
                {{ task.describe }}
                </li>
            </td>
          </tr>
        </table>
        <pt-button class="community-user-table-button" width="100%" @click="showDescribe(user._id)">Read More</pt-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.community {

  .community-user-container {

    .community-user-item {
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin-top: 30px;

      .community-user-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #eee;
        
        td {
          padding: 3px 5px;
          border: 1px solid #eee;
          text-align: justify;
          word-break: break-word;
        }

        .community-user-table-title {
          font-weight: 500;
        }

        .community-user-table-task {

          .community-user-table-task-container {

            .community-user-table-task-name {
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
