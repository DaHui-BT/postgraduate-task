<script lang="ts" setup>
defineProps({
  type: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :class="['pt-button', type, {'circle': circle, [type + '-plain']: plain}]">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.pt-button {
  // width: 100%;
  padding: 10px 20px;
  // margin-top: 10px;
  border-radius: 5px;
  color: #666;
  font-weight: bold;
}

.pt-button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
  transition: .2s;
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 15px;
  width: 20px;
  height: 20px;
  font-size: 20px;
}

.default {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.default:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}


.primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}


.warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}

.warning:hover {
  background: #ebb563;
  border-color: #ebb563;
  color: #fff;
}

.danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.danger:hover {
  background: #f78989;
  border-color: #f78989;
  color: #fff;
}

.info {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}

.info:hover {
  background: #a6a9ad;
  border-color: #a6a9ad;
  color: #fff;
}

.warning-plain {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
}

.warning-plain:hover {
  background: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}

.default-plain:hover {
  background: #fff;
  border-color: #409eff;
  color: #409eff;
}

.primary-plain {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.primary-plain:hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.danger-plain {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}

.danger-plain:hover {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}

.info-plain {
  color: #909399;
  background: #f4f4f5;
  border-color: #d3d4d6;
}

.info-plain:hover {
  background: #909399;
  border-color: #909399;
  color: #fff;
}
</style>
