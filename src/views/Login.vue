<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Database from '@/tools/mongodb'


const {proxy} = getCurrentInstance()
const router = useRouter()

let username = ref<string>()
let password = ref<string>()
const database = new Database()

async function login() {
  if (username.value == null || password.value == null
      || username.value.trim().length == 0 || password.value.trim().length == 0) {
    alert('email and password must not be null')
    return
  }
  
  proxy.$loading.show()

  await database.connect(username.value, password.value).then(res => {
    if (router.currentRoute.value.query['from'] != undefined) {
      router.replace(router.currentRoute.value.query['from'].toString())
    } else {
      router.replace({path: '/'})
    }
  }).catch((err) => {
    alert('username or password is error, please try again!')
  }).finally(() => {
    proxy.$loading.hide()
  })
}

window.onkeyup = (event) => {
  if (event.keyCode == 13) { // enter
    login()
  }
}

</script>

<template>
  <div class="login">
    <div class="login-container">
      <h2 class="login-title">Login</h2>
      <input class="login-item" type="text" placeholder="email" v-model="username">
      <input class="login-item" type="password" placeholder="password" v-model="password">
      <p class="login-message"><span>don't have a account?</span> <a @click="() => $router.push('/register')">register</a></p>
      <button class="login-button" @click="login">Login</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .login-container {
    margin: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 350px;
    padding: 40px 30px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 3px 3px 10px 0px #5353536d;

    .login-message {
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
    
    .login-title {
      margin-bottom: 30px;
    }

    .login-item {
      padding: 10px 20px;
      width: 300px;
      height: 40px;
      border: 1px solid #4570ff;
      margin-bottom: 30px;
      border-radius: 5px;
    }

    .login-item::placeholder {
      color: #aaa;
    }

    .login-button {
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
