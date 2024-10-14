<script lang="ts" setup>
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  .container {
    width: 95%;
  }
}

.container {
  max-width: 900px;
  min-width: 350px;
  min-height: calc(100vh - 60px);
  margin: auto;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 10px #d2d2d2;
  margin-bottom: 30px;
}
</style>
