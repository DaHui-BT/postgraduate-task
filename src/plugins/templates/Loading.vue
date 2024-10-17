<script lang="ts" setup>
</script>

<template>
  <div class="loading">
    <div class="loading-spinner"></div>
  </div>
</template>

<style lang="scss" scoped>
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #6662628a;

    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    .loading-spinner {
      border: 5px solid #3498db;
      // border-top: 5px solid #3498db;
      border-radius: 35%;
      width: 150px;
      height: 150px;
      animation: spin 2s linear infinite;
      overflow: hidden;
    }
  }
</style>
