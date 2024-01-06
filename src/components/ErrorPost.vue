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
  <div class="hazy-post type-error">
    <div class="post-data-group">
      <div class="post-data">
        <!-- <div class="hazy-post-info">
          <span class="username" v-html="props.post.user.name" />
        </div> -->
        <div class="hazy-post-contents">
          <div class="hazy-avatar">
            <Icon icon="mingcute:alert-fill" class="nn-icon size-small" />
          </div>
          <p class="hazy-post-body">
            {{ props.error.message }}
          </p>
        </div>
      </div>
    </div>
    <div class="hazy-post-actions">
      <button class="hazy-post-action" @click="deleteError(props.error.index)">
        <Icon class="nn-icon size-xsmall" icon="mingcute:close-line" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-data,
.repost-data {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.repost-data {
  margin-top: 4px;
  padding-left: 8px;
  &::before {
    position: absolute;
    left: 0;
    display: inline-flex;
    width: 4px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.32);
    border-radius: 2px;
    content: "";
  }
}
.hazy-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
