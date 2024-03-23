<script setup lang="ts">
import { useStore, type ErrorItem } from "@/store";
import { Icon } from "@iconify/vue";
import { type PropType } from "vue";

const store = useStore();

const props = defineProps({
  error: {
    type: Object as PropType<ErrorItem & { index: number }>,
    required: true,
  },
});

const deleteError = (index: number) => {
  store.$state.errors.splice(index, 1);
};
</script>

<template>
  <div class="hazy-error-post">
    <div class="hazy-avatar">
      <Icon icon="mingcute:alert-fill" class="nn-icon size-small" />
    </div>
    <div class="post-data-group">
      <p class="error-body">
        {{ props.error.message }}
      </p>
    </div>
    <div class="actions">
      <button class="hazy-post-action" @click="deleteError(props.error.index)">
        <Icon class="nn-icon size-xsmall" icon="mingcute:close-line" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hazy-error-post {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--color-error);
  color: var(--color-error-text);
  margin-bottom: 8px;
}
</style>
