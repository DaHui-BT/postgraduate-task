<script lang="ts" setup>
import { ref, getCurrentInstance, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import Database from '@/tools/mongodb'


const proxy: ComponentPublicInstance | undefined | null = getCurrentInstance()?.proxy
if (proxy == null || proxy == undefined) {
  throw Error('Server, please try later')
}
const router = useRouter()

let username = ref<string>()
let password = ref<string>()
const database = new Database()

async function register() {
  if (username.value == null || password.value == null
      || username.value.trim().length == 0 || password.value.trim().length == 0) {
    alert('email and password must not be null')
    return
  }
  
  proxy?.$loading.show()
  await database.app?.emailPasswordAuth.registerUser({
    email: username.value,
    password: password.value
  }).then(() => {
    router.push({
      path: '/login'
    })
  }).catch(err => {
    proxy?.$notification.show('Error', err.error)
    console.log(err, err.error)
  }).finally(() => {
    proxy?.$loading.hide()
  })
}


window.onkeyup = (event) => {
  if (event.keyCode == 13) { // enter
    register()
  }
}
</script>

<template>
  <div class="register">
    <div class="register-container">
      <h2 class="register-title">Register</h2>
      <input class="register-item" type="text" placeholder="email" v-model="username">
      <input class="register-item" type="password" placeholder="password" v-model="password">
      <p class="register-message"><span>have an account?</span> <a @click="() => $router.push('/login')">login</a></p>
      <button class="register-button" @click="register">Register</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .register-container {
    margin: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 350px;
    padding: 40px 30px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 3px 3px 10px 0px #5353536d;

    .register-message {
      width: 300px;
      margin-top: -20px;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: right;

      a {
        color: #4570ff;
        cursor: pointer;
      }
    }
    
    .register-title {
      margin-bottom: 30px;
    }

    .register-item {
      padding: 10px 20px;
      width: 300px;
      height: 40px;
      border: 1px solid #4570ff;
      margin-bottom: 30px;
      border-radius: 5px;
    }

    .register-item::placeholder {
      color: #aaa;
    }

    .register-button {
      width: 300px;
      height: 40px;
      color: #fff;
      font-weight: bold;
      background-color: #7093fd;
      border: 1px solid #7e9df8;
      border-radius: 5px;
    }
  }
}
</style>
