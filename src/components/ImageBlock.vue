<script lang="ts" setup>
import ScreenMask from '@/components/ScreenMask.vue'

const props = defineProps(['image_url'])
const emit = defineEmits(['close'])

function close() {
  emit('close')
}

</script>

<template>
  <screen-mask>
    <div class="image-block">
      <div class="close" @click="close">X</div>
      <img :src="props.image_url" alt="">
    </div>
  </screen-mask>
</template>

<style lang="scss" scoped>
  .image-block {
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
      margin: auto;
      max-width: 95%;
      max-height: 60%;
    }

    .close {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #fff;

      line-height: 40px;
      text-align: center;
      color: #999;
      font-weight: bolder;
      cursor: pointer;
    }
  }
</style>
