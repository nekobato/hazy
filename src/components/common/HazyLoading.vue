<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
  size: {
    type: String,
    required: false,
    default: "medium",
  },
});
</script>

<template>
  <div class="loading" :class="[props.size]">
    <Icon class="loading-icon" icon="mingcute:loading-3-line" :spin="true" />
  </div>
</template>

<style lang="scss" scoped>
@keyframes rotate-2d {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  animation: 2s rotate-2d linear infinite;

  &.medium {
    .loading-icon {
      width: 40px;
      height: 40px;
    }
  }

  &.small {
    .loading-icon {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
