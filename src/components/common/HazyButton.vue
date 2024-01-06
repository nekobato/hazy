<script setup lang="ts">
import HazyLoading from "@/components/common/HazyLoading.vue";

defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <button class="nn-button type-primary" :class="{ loading: loading }" :disabled="disabled">
    <div class="button-content">
      <slot />
    </div>
    <HazyLoading class="loading-icon" size="small" />
  </button>
</template>

<style lang="scss" scoped>
.loading-icon {
  position: absolute;
  visibility: hidden;
}
.button-content {
  display: contents;
}
.loading {
  .button-content {
    visibility: hidden;
  }
  .loading-icon {
    visibility: visible;
  }
}
.button-icon {
  margin-left: 4px;
}
</style>
