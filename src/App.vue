<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import { RouterView } from "vue-router";

const theme = useStorage("theme", "default");
</script>

<template>
  <div class="theme" :class="[theme]">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.theme {
  display: contents;
}
</style>
