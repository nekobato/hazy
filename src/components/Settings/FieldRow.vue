<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  indent: {
    type: Number,
    default: 0,
  },
});

const indent = computed(() => {
  return `indent-${props.indent}`;
});
</script>

<template>
  <div class="field-row" :class="[indent]"></div>
</template>

<style lang="scss" scoped>
.field-row {
  display: flex;
  min-height: 40px;
  padding: 8px;
  background-color: var(--hazy-color-settings-background);
  border-radius: 8px;

  &.indent-1 {
    margin-left: 16px;
  }

  &.indent-2 {
    margin-left: 32px;
  }
}
</style>
