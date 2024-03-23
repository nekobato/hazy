<script setup lang="ts">
import HazyLoading from "@/components/common/HazyLoading.vue";

const props = defineProps({
  status: {
    type: String,
    default: "default" as "default" | "loading" | "error" | "empty",
  },
});
</script>

<template>
  <div class="hazy-post-list">
    <slot />
    <HazyLoading class="loading" v-if="props.status === 'loading'" />
  </div>
</template>

<style lang="scss" scoped>
.hazy-post-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--hazy-background-color);
  border: 1px solid var(--hazy-border-color);
  border-radius: 8px;
}

.loading {
  padding: 24px 0;
}
</style>
