<script setup lang="ts">
import { useStore } from "@/store";
import { useInstanceStore } from "@/store/instance";
import { useUsersStore } from "@/store/users";
import { useTimelineStore } from "@/store/timeline";
import { ipcInvoke, ipcSend } from "@/utils/ipc";
import { Icon } from "@iconify/vue";
import { nanoid } from "nanoid/non-secure";
import { ref } from "vue";
import SectionTitle from "../Post/SectionTitle.vue";

const store = useStore();
const usersStore = useUsersStore();
const timelineStore = useTimelineStore();
const instanceStore = useInstanceStore();

const state = ref({
  actions: {
    delete: {
      id: null as string | null,
    },
    newAccount: {
      misskey: {
        progress: "default" as "default" | "step1:instance" | "step2:confirm",
        instanceUrl: {
          value: "",
          error: "",
        },
        sessionId: "",
      },
    },
  },
});

const startAuth = (target: "misskey" | "mastodon") => {
  resetStatues();
  if (target === "misskey") {
    state.value.actions.newAccount.misskey.progress = "step1:instance";
  }
};

const checkMiAuth = async () => {
  const misskey = state.value.actions.newAccount.misskey;
  const check = await ipcInvoke("api", {
    method: "misskey:checkMiAuth",
    instanceUrl: misskey.instanceUrl.value,
    sessionId: misskey.sessionId,
  }).catch(() => {
    store.$state.errors.push({
      message: `${state.value.actions.newAccount.misskey.instanceUrl.value}の認証失敗`,
    });
  });

  usersStore.createUser({
    name: check.user.name,
    avatarUrl: check.user.avatarUrl,
    token: check.token,
    instanceUrl: misskey.instanceUrl.value,
  });
  state.value.actions.newAccount.misskey.progress = "default";
};

const startDeleteAccount = (id: string) => {
  resetStatues();
  state.value.actions.delete.id = id;
};

const confirmDeleteAccount = async () => {
  if (state.value.actions.delete.id) {
    usersStore.deleteUser(state.value.actions.delete.id);
    timelineStore.deleteTimelineByUserId(state.value.actions.delete.id);
  }
  state.value.actions.delete.id = null;
};

const openMisskeyAuthLink = () => {
  const misskey = state.value.actions.newAccount.misskey;
  misskey.sessionId = nanoid();
  /^https?:\/\//.test(misskey.instanceUrl.value) ||
    (misskey.instanceUrl.value = "https://" + misskey.instanceUrl.value);
  const url = instanceStore.getMisskeyAuthUrl(misskey.instanceUrl.value, misskey.sessionId);
  ipcSend("open-url", { url });
  misskey.progress = "step2:confirm";
};

const resetStatues = () => {
  state.value.actions.delete.id = null;
  state.value.actions.newAccount.misskey.progress = "default";
  state.value.actions.newAccount.misskey.instanceUrl.value = "";
  state.value.actions.newAccount.misskey.instanceUrl.error = "";
};
</script>

<template>
  <div class="account-settings hazy-post-list">
    <SectionTitle title="アカウント" />
    <div class="hazy-post account indent-1">
      <img src="/images/logo/misskey.png" class="hazy-avatar" />
      <div class="content">
        <span class="nickname">Misskey</span>
      </div>
    </div>
    <div class="accounts-container" v-for="user in store.users" :key="user.id">
      <div class="hazy-post account indent-1">
        <img :src="user.avatarUrl || ''" class="hazy-avatar" />
        <div class="content">
          <span class="nickname">{{ user.name }}</span>
          <span class="instance">@{{ usersStore.findInstance(user.instanceId)?.url.replace("https://", "") }}</span>
        </div>
        <div class="form-actions">
          <button
            class="nn-button size-small action"
            @click="startDeleteAccount(user.id)"
            v-if="!state.actions.delete.id"
          >
            <Icon icon="ion:trash" class="nn-icon" />
          </button>
          <button class="nn-button size-small action" @click="resetStatues" v-if="state.actions.delete.id === user.id">
            <Icon icon="ion:close" class="nn-icon" />
          </button>
        </div>
      </div>
      <div class="hazy-post account as-thread indent-1" v-if="state.actions.delete.id === user.id">
        <div class="content">
          <span class="nickname">確認：削除しますか？</span>
        </div>
        <div class="form-actions">
          <button class="nn-button size-small type-warning action" @click="confirmDeleteAccount()">
            <Icon icon="ion:checkmark-done" class="nn-icon" />
          </button>
        </div>
      </div>
    </div>
    <!-- new accounts -->
    <div class="hazy-post account indent-1">
      <div class="content">
        <span>アカウント追加</span>
      </div>
      <div class="form-actions">
        <button
          class="nn-button size-small action"
          v-if="state.actions.newAccount.misskey.progress === 'default'"
          @click="startAuth('misskey')"
        >
          <Icon icon="ion:plus" class="nn-icon" />
        </button>
        <button
          class="nn-button size-small action"
          v-if="state.actions.newAccount.misskey.progress !== 'default'"
          @click="resetStatues"
        >
          <Icon icon="ion:close" class="nn-icon" />
        </button>
      </div>
    </div>
    <div class="hazy-post as-thread indent-1" v-if="state.actions.newAccount.misskey.progress === 'step1:instance'">
      <div class="content">
        <div class="nn-form-item">
          <label class="nn-label">インスタンスURL</label>
          <input
            type="text"
            class="nn-text-field"
            v-model="state.actions.newAccount.misskey.instanceUrl.value"
            placeholder="https://..."
          />
        </div>
      </div>
      <div class="form-actions">
        <button class="nn-button size-small action" @click="openMisskeyAuthLink">
          <Icon icon="ion:open" class="nn-icon size-small" />
        </button>
      </div>
    </div>
    <div
      class="hazy-post account as-thread indent-1"
      v-if="state.actions.newAccount.misskey.progress === 'step2:confirm'"
    >
      <div class="content">
        <span>認証した？</span>
      </div>
      <div class="form-actions">
        <button class="nn-button size-small action" @click="startAuth('misskey')">戻る</button>
        <button class="nn-button size-small action" @click="checkMiAuth()">認証した</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account-settings {
  width: 100%;
}
.account {
  display: flex;
  gap: 8px;
  align-items: center;
}
.content {
  padding: 4px 0;
  color: #fff;
  font-size: var(--font-size-14);
}
.action {
  > svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}
.hazy-post {
  display: flex;
  border: none;
}
</style>
