<script setup lang="ts">
import hazyAlert from "@/components/common/HazyAlert.vue";
import HazyButton from "@/components/common/HazyButton.vue";
import { ipcInvoke, ipcSend } from "@/utils/ipc";
import { Icon } from "@iconify/vue";
import { onMounted, reactive, ref } from "vue";
import type { Instance, Timeline, User } from "@shared/types/store";
import { ElAvatar, ElButton, ElInput, ElOption, ElSelect, ElSwitch } from "element-plus";
import EmojiPicker from "@/features/misskey/post/EmojiPicker.vue";

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
const visibility = ref("public");
const universe = ref(false);
const reactionable = ref(false);

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

const onInput = (value: string) => {
  console.log(value);
  if (value[value.length - 1] === ":") {
  }
};

const showEmojiPicker = () => {
  ipcSend("emoji-picker:show");
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
    <div class="header">
      <ElAvatar :size="32" :src="state.user?.avatarUrl" class="hazy-avatar" />
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
    <div class="post-layout">
      <div class="tools">
        <ElButton class="tool-item">
          <Icon icon="mingcute:pic-line" />
        </ElButton>
        <ElButton class="tool-item">
          <Icon icon="mingcute:chart-horizontal-line" />
        </ElButton>
        <ElButton class="tool-item">
          <Icon icon="mingcute:eye-2-line" />
        </ElButton>
        <ElButton class="tool-item">
          <Icon icon="mingcute:at-line" />
        </ElButton>
        <ElButton class="tool-item">
          <Icon icon="mingcute:hashtag-line" />
        </ElButton>
        <ElButton class="tool-item">
          <Icon icon="mingcute:emoji-line" />
        </ElButton>
      </div>
      <div class="post-field-container">
        <ElInput class="post-field" :autosize="{ minRows: 2 }" type="textarea" v-model="text" @input="onInput" />
        <hazyAlert class="mt-4" type="error" v-if="state.post.error">
          {{ state.post.error }}
        </hazyAlert>
        <div class="post-settings">
          <div class="field-row">
            <span>公開範囲</span>
            <ElSelect class="input select" size="small" v-model="visibility">
              <ElOption value="public" label="パブリック" />
              <ElOption value="home" label="ホーム" />
              <ElOption value="followers" label="フォロワー" />
              <ElOption value="direct" label="ダイレクト" />
            </ElSelect>
          </div>
          <div class="field-row">
            <span>連合なし</span>
            <ElSwitch class="input" v-model="universe" />
          </div>
          <div class="field-row"></div>
          <div class="field-row">
            <span>リアクション受け入れ</span>
            <ElSwitch class="input" v-model="reactionable" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="emoji-picker-container">
    <div class="emoji-picker">
      <div class="emoji-picker-body">
        <EmojiPicker />
      </div>
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
.header {
  display: flex;
  align-items: center;
  gap: 8px;
  .hazy-avatar {
    border-radius: 50%;
  }
  .username {
    color: #fff;
    font-size: 0.8rem;
  }
  .post-action {
    margin: 0 0 0 auto;
    width: 120px;
    &:hover {
      background-color: var(--hazy-color-white-t1);
    }
  }
}
.post-layout {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 8px;
  align-items: start;
}
.tools {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  .tool-item {
    margin: 0;
  }
}
.post-field-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.post-field {
  width: 100%;
  margin: 8px 0 0;
}
.post-settings {
  margin: auto 0 0 auto;
  display: flex;
  flex-direction: column;
  width: 50%;
  .field-row {
    display: flex;
    align-items: center;
    width: 100%;
    span {
      color: #fff;
      font-size: 0.6rem;
    }
    .input {
      margin: 0 0 0 auto;
    }
    .select {
      width: 120px;
    }
  }
}
</style>
