<script setup lang="ts">
import hazyAlert from "@/components/common/HazyAlert.vue";
import HazyButton from "@/components/common/HazyButton.vue";
import { ipcInvoke, ipcSend } from "@/utils/ipc";
import { Icon } from "@iconify/vue";
import { onMounted, reactive, ref } from "vue";
import type { Instance, Timeline, User } from "@shared/types/store";

const state = reactive({
  user: undefined as User | undefined,
  timeline: undefined as Timeline | undefined,
  instance: undefined as Instance | undefined,
  post: {
    isSending: false,
    error: "",
  },
});
const text = ref("");
const textCw = ref("");

const post = async () => {
  if (text) {
    state.post.isSending = true;
    const res = await ipcInvoke("api", {
      method: "misskey:createNote",
      instanceUrl: state.instance?.url,
      token: state.user?.token,
      i: state.user?.token,
      // visibility: "public",
      // visibleUserIds: [],
      text: text.value,
      cw: textCw.value || null,
      // localOnly: false,
      // noExtractMentions: false,
      // noExtractHashtags: false,
      // noExtractEmojis: false,
      // noExtractLinks: false,
      // poll: null,
      // replyId: null,
      // renoteId: null,
      // renote: null,
      // fileIds: [],
    });
    if (res.createdNote) {
      text.value = "";
      textCw.value = "";
      ipcSend("post:close");
    } else {
    }
    state.post.isSending = false;
  }
};

onMounted(async () => {
  const users = await ipcInvoke("db:get-users");
  const timelines = await ipcInvoke("db:get-timeline-all");
  const instances = await ipcInvoke("db:get-instance-all");
  state.timeline = timelines.find((timeline: any) => timeline.available);
  state.user = users.find((user: any) => user.id === state.timeline?.userId);
  state.instance = instances.find((instance: any) => instance.id === state.user?.instanceId);
});

document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" && e.shiftKey) || (e.key === "Enter" && e.metaKey)) {
    e.preventDefault();
    post();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    ipcSend("post:close");
  }
});
</script>

<template>
  <div class="post">
    <div class="post-form">
      <div class="tools">
        <img :src="state.user?.avatarUrl" class="hazy-avatar" />
        <span class="username">{{ state.user?.name }}@{{ state.instance?.url.replace("https://", "") }}</span>
        <HazyButton
          class="post-action size-small"
          @click="post"
          :disabled="text.length === 0 || state.post.isSending"
          :loading="state.post.isSending"
        >
          <span>Note</span>
          <Icon slot="icon" icon="mingcute:send-line" class="nn-icon size-xsmall" />
        </HazyButton>
      </div>
      <textarea class="nn-text-field post-field" v-model="text"></textarea>
      <hazyAlert class="mt-4" type="error" v-if="state.post.error">
        {{ state.post.error }}
      </hazyAlert>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: var(--hazy-background-color);
}
.tools {
  display: flex;
  gap: 8px;
  align-items: center;
  .post-action {
    margin: 0 0 0 auto;
    &:hover {
      background-color: var(--hazy-color-white-t1);
    }
  }
  .username {
    color: #fff;
    font-size: 0.8rem;
  }
}
.post-field {
  width: 100%;
  min-height: 120px;
  margin: 8px 0 0;
}
</style>
