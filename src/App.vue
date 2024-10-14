<script setup lang="ts">
import Container from '@/views/Container.vue'
import Navbar from '@/components/Navbar.vue'

</script>

<template>
  <div class="app">
    <navbar v-if="$route.meta.showNavbar"></navbar>
    <container></container>
  </div>
</template>

<style scoped lang="scss">
.app {
  position: relative;
}
</style>
