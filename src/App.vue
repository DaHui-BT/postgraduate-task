<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'


</script>

<template>
  <div class="app">
    <navbar v-if="$route.meta.showNavbar"></navbar>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.app {
  position: relative;
}
</style>
