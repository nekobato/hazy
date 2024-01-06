<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "info",
  },
});
</script>

<template>
  <div class="hazy-alert" :class="[props.type]">
    <Icon icon="mingcute:flag-3-fill" class="nn-icon size-small color-white" v-if="props.type === 'success'" />
    <Icon icon="mingcute:chat-3-fill" class="nn-icon size-small color-white" v-if="props.type === 'info'" />
    <Icon icon="mingcute:alert-octagon-fill" class="nn-icon size-small color-white" v-if="props.type === 'warning'" />
    <Icon icon="mingcute:alert-fill" class="nn-icon size-small color-white" v-if="props.type === 'error'" />
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hazy-alert {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 8px;
  overflow: hidden;
  color: var(--hazy-color-white);
  background-color: var(--hazy-color-white);
  border: 1px solid var(--hazy-color-white-t2);
  border-radius: 4px;
  &.info {
    background-color: var(--hazy-color-info);
  }
  &.success {
    background-color: var(--hazy-color-success);
  }
  &.warning {
    background-color: var(--hazy-color-warning);
  }
  &.error {
    background-color: var(--hazy-color-error);
  }
  .content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-left: 8px;
    font-size: var(--font-size-14);
  }
}
</style>
