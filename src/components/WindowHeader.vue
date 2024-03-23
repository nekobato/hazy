<script setup lang="ts">
import { ipcSend } from "@/utils/ipc";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { PropType } from "vue";

const props = defineProps({
  windowType: {
    type: String as PropType<"main" | "post" | "tutorial" | "settings">,
    required: true,
  },
});

const router = useRouter();

const exit = () => {
  switch (props.windowType) {
    case "post":
      ipcSend("post:close");
      break;
    case "tutorial":
      router.push("/main/settings");
      break;
    case "main":
      ipcSend("set-hazy-mode", { mode: "hide" });
      break;
    case "settings":
      router.push("/main/timeline");
      break;
  }
};

const haze = () => {
  ipcSend("set-hazy-mode", { mode: "haze" });
};

const post = () => {
  ipcSend("post:create");
};

const reload = () => {
  ipcSend("main:reload");
};

const settings = () => {
  router.push("/main/settings");
};
</script>

<template>
  <div class="window-header">
    <button class="nn-button type-ghost exit" @click="exit">
      <Icon icon="mingcute:close-line" class="nn-icon size-xsmall" v-if="props.windowType === 'post'" />
      <Icon icon="mingcute:close-line" class="nn-icon size-xsmall" v-if="props.windowType === 'main'" />
      <Icon icon="mingcute:arrow-left-line" class="nn-icon size-xsmall" v-if="props.windowType === 'tutorial'" />
      <Icon icon="mingcute:arrow-left-line" class="nn-icon size-xsmall" v-if="props.windowType === 'settings'" />
    </button>
    <button class="nn-button type-ghost haze" @click="haze" v-if="props.windowType === 'main'">
      <Icon icon="mingcute:ghost-line" class="nn-icon size-xsmall" />
    </button>
    <div class="rest"></div>
    <button class="nn-button type-ghost post" @click="post" v-if="props.windowType === 'main'">
      <Icon icon="mingcute:pencil-line" class="nn-icon size-xsmall" />
    </button>
    <div class="rest"></div>
    <button class="nn-button type-ghost refresh" v-if="props.windowType === 'main'" @click="reload">
      <Icon icon="mingcute:refresh-1-line" class="nn-icon size-xsmall" />
    </button>
    <button class="nn-button type-ghost settings" @click="settings" v-if="props.windowType === 'main'">
      <Icon icon="mingcute:settings-3-line" class="nn-icon size-xsmall" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.window-header {
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  height: 24px;
  overflow: hidden;
  background-color: var(--hazy-background-color);
  border: 1px solid var(--hazy-border-color);
  border-radius: 4px;
}
.rest {
  flex: 1;
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
}
.nn-button {
  &.settings {
    margin: 0 0 0 auto;
  }
  &.post {
    width: 64px;
    margin: 0 auto;
  }
}
</style>
