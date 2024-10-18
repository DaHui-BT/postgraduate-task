<script lang="ts" setup>
import { getCurrentInstance, type ComponentPublicInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Database from '@/tools/mongodb'

const router = useRouter()
const route = useRoute()
const database = new Database()
const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}

if (route.query == undefined || Object.keys(route.query).length != 2
    || (route.query['token'] == undefined || route.query['tokenId'] == undefined)) {
  proxy.$notification.show('Error', 'nothing to confirm')
  router.push({
    path: '/'
  })
} else {
  proxy?.$loading.show()

  database.app?.emailPasswordAuth.confirmUser(route.query as {token: string, tokenId: string}).then(() => {
    alert('confirm successfully!')
  }).catch(err => {
    alert(err.error)
  }).finally(() => {
    proxy?.$loading.hide()
    router.push({path: '/'})
  })
}

</script>

<template>
  <div class="confirm">Waitting for Confirm ...</div>
</template>

<style lang="scss" scoped>
  .confirm {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #aaa;
    font-size: 20px;
    font-weight: bold;
  }
</style>
