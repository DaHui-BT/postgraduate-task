<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function to(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="nav-bar">
    <div class="wrapper">
      <div class="nav-item" @click="to('/')">👍🛶🦆🍻👌Home</div>
      <div class="nav-item" @click="to('/submission')">Submission</div>
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
  }
}
</style>
