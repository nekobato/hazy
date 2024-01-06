<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="hazy-post">
    <h2 class="section-title">{{ props.title }}</h2>
  </div>
</template>

<style lang="scss" scoped>
.section-title {
  margin: 0;
  padding: 0;
  color: var(--color-text-title);
  font-weight: bold;
  font-size: 0.8rem;
}
</style>
