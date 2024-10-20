<script lang="ts" setup>
import { getCurrentInstance, type ComponentPublicInstance } from 'vue'
import Database from '@/tools/mongodb'
import type { UserType } from '@/types/user'
import moment from 'moment'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'


const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const router = useRouter()
const database = new Database()
const user_list = reactive<UserType[]>([])

proxy.$loading.show()
database.findList<UserType[]>('postgraduate-task', 'user').then((res) => {
  console.log(res)
  user_list.splice(0, user_list.length)
  res && user_list.push(...res)
  console.log(res)
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
    <div class="community-user-container">
      <div class="community-user-item" v-for="user in user_list" :key="user._id" @click="showDescribe(user._id)">
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
            <td>100</td>
            <td class="community-user-table-title">Today Finishing Tasks</td>
            <td>10</td>
          </tr>

          <tr class="community-user-table-describe">
            <td class="community-user-table-title">Describe</td>
            <td colspan="3">{{ user.describe }}</td>
          </tr>
        </table>
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
      margin-top: 50px;

      .community-user-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #eee;
        
        td {
          padding: 3px 5px;
          border: 1px solid #eee;
          text-align: justify;
        }

        .community-user-table-title {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
