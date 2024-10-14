<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Database from '@/tools/mongodb'

const router = useRouter()
const database = new Database()
const status = ['Login/Register', 'Profile']
const navbar_list = reactive<Array<object>>([{
  title: 'Submission',
  path: '/submission'
}, {
  title: 'Profile',
  path: '/profile'
}, {
  title: 'Login',
  path: '/login'
}, {
  title: 'Register',
  path: '/register'
}])

const is_collpase_show = ref<boolean>(window.innerWidth < 500)
const is_expand = ref<boolean>(false)
const nav_expand = ref(null)

if (database.isLogin) {
  navbar_list.splice(2, 2)
} else {
  navbar_list.splice(0, 2)
  navbar_list.splice(2, 1)
}

function to(path: string) {
  router.push(path)
}

window.onresize = (event) => {
  if (window.innerWidth < 500) {
    is_collpase_show.value = true
  } else {
    is_collpase_show.value = false
  }
}

window.onclick = (event) => {
  if (event.target != nav_expand.value && is_expand.value) {
    is_expand.value = false
  }
}

function expand() {
  is_expand.value = ! is_expand.value
}

</script>

<template>
  <div class="nav-bar">
    <div class="wrapper">
      <div class="nav-item" @click="to('/')">👍🛶🦆🍻👌Home</div>
      <div class="right-bar-collpase" v-if="is_collpase_show">
        <div class="nav-item" ref="nav_expand" @click="expand()">〇</div>
        <ul class="nav-collpase-container" v-if="is_expand">
          <li class="nav-collpase-container-item"
              v-for="item in navbar_list" :key="item"
              @click="to(item.path)">{{ item.title }}</li>
        </ul>
      </div>
      <div class="right-bar" v-else>
        <li class="nav-item"
        v-for="item in navbar_list" :key="item"
        @click="to(item.path)">{{ item.title }}</li>
      </div>
    </div>
    <div class="wrapper-place"></div>
  </div>
</template>

<style scoped lang="scss">
.nav-bar {
  
  .wrapper-place {
    height: 50px;
  }

  .wrapper {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    height: 50px;
    width: 100%;
    min-width: 350px;
    background-color: #fff;
    box-shadow: 0px 3px 10px #eee;

    .nav-item {
      padding: 10px 20px;
      background-color: #fff;
      font-weight: bolder;
      cursor: pointer;
    }

    .right-bar-collpase {
      position: relative;

      .nav-collpase-container {
        position: absolute;
        top: 50px;
        right: 10px;
        padding: 10px 20px;
        background-color: #fff;
        border: 1px solid #eee;

        .nav-collpase-container-item {
          cursor: pointer;
          color: #666;
          margin-top: 10px;
          padding-bottom: 3px;
          border-bottom: 1px solid #ddd;
          font-weight: bolder;
        }

        .nav-collpase-container-item:first-child {
          margin-top: 0px;
        }

        .nav-collpase-container-item:last-child {
          border: none;
        }
      }
    }

    .right-bar {
      display: flex;
    }
  }
}
</style>
