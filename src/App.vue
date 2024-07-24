<script setup lang="ts">
import { useRouter } from 'vue-router';

// import { RouterLink, RouterView } from 'vue-router'
const router = useRouter()

function to(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="app">
    <div class="wrapper">
      <div class="nav-item" @click="to('/')">Home</div>
      <div class="nav-item" @click="to('/submission')">Submission</div>
    </div>
    <div class="wrapper-place"></div>

    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.app {
  position: relative;

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
