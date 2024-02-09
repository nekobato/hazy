<script lang="ts" setup>
import WindowHeader from "@/components/WindowHeader.vue";
import Layout from "@/components/layouts/WithHeader.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <Layout>
    <WindowHeader windowType="settings" />
    <RouterView />
  </Layout>
</template>
