<script setup lang="ts">
import { useStore } from "@/store";
import { useTimelineStore } from "@/store/timeline";
import { Icon } from "@iconify/vue";
import { computed, onMounted, ref, watch } from "vue";
import type { MisskeyChannel } from "@shared/types/misskey";
import type { ChannelName, Timeline } from "@shared/types/store";
import HazySelect from "../common/HazySelect.vue";

const props = defineProps<{
  timeline: Timeline;
}>();

const emit = defineEmits<{
  updateTimeline: [Timeline];
}>();

const store = useStore();
const timelineStore = useTimelineStore();

const streamOptions: {
  label: string;
  value: ChannelName;
}[] = [
  {
    label: "ホーム",
    value: "misskey:homeTimeline",
  },
  {
    label: "ローカル",
    value: "misskey:localTimeline",
  },
  {
    label: "ソーシャル",
    value: "misskey:socialTimeline",
  },
  {
    label: "グローバル",
    value: "misskey:globalTimeline",
  },
  {
    label: "リスト...",
    value: "misskey:list",
  },
  // {
  //   label: "アンテナ...",
  //   value: "misskey:antenna",
  // },
  {
    label: "チャンネル...",
    value: "misskey:channel",
  },
  {
    label: "検索...",
    value: "misskey:search",
  },
];

const followedMisskeyChannels = ref<MisskeyChannel[]>([]);
const misskeyChannelOptions = computed(() =>
  followedMisskeyChannels.value?.length > 0
    ? followedMisskeyChannels.value.map((channel) => ({
        label: channel.name,
        value: channel.id,
      }))
    : [],
);

const accountOptions = computed(() =>
  store.users.map((user) => ({
    label:
      user.name +
      "@" +
      store.instances.find((instance) => instance.id === user.instanceId)?.url.replace("https://", ""),
    value: user.id,
  })),
);

const onChangeUser = async (e: InputEvent) => {
  const userId = (e.target as HTMLInputElement).value;

  emit("updateTimeline", {
    ...props.timeline,
    userId,
    options: {},
  });
};

const onChangeStream = async (e: InputEvent) => {
  const stream = (e.target as HTMLInputElement).value as ChannelName;

  emit("updateTimeline", {
    ...props.timeline,
    channel: stream,
    options: {},
  });
};

const onChangeChannel = async ({ target }: InputEvent) => {
  const channelId = (target as HTMLInputElement).value;
  emit("updateTimeline", {
    ...props.timeline,
    options: {
      channelId,
    },
  });
};

watch(
  () => props.timeline.channel,
  async (channel) => {
    if (channel === "misskey:channel") {
      followedMisskeyChannels.value = await timelineStore.getFollowedChannels();
    }
  },
);

onMounted(async () => {
  if (props.timeline.channel === "misskey:channel") {
    followedMisskeyChannels.value = await timelineStore.getFollowedChannels();
  }
});
</script>

<template>
  <div class="accounts-container">
    <div class="hazy-post account indent-1">
      <div class="content">
        <Icon icon="mingcute:user-1-line" class="nn-icon size-small" />
        <span class="label">アカウント</span>
      </div>
      <div class="attachments form-actions">
        <HazySelect
          name="user"
          :options="accountOptions"
          :value="props.timeline.userId"
          @change="onChangeUser"
          placeholder="--"
          class="select"
        />
      </div>
    </div>
    <div class="hazy-post account indent-1">
      <div class="content">
        <Icon icon="mingcute:list-check-3-line" class="nn-icon size-small" />
        <span class="label">タイムライン</span>
      </div>
      <div class="attachments form-actions">
        <HazySelect
          name="channel"
          :options="streamOptions"
          :value="props.timeline.channel"
          @change="onChangeStream"
          placeholder="--"
          class="select"
        />
      </div>
    </div>
    <div class="hazy-post account indent-2" v-if="props.timeline.channel === 'misskey:channel'">
      <div class="content">
        <Icon icon="mingcute:tv-2-line" class="nn-icon size-small" />
        <span class="label">チャンネル</span>
      </div>
      <div class="attachments form-actions">
        <HazySelect
          v-if="misskeyChannelOptions.length"
          name="channel"
          :options="misskeyChannelOptions"
          :value="props.timeline.options?.channelId"
          @change="onChangeChannel"
          placeholder="--"
          class="select"
        />
      </div>
    </div>
    <div class="hazy-post account indent-2" v-if="props.timeline.channel === 'misskey:search'">
      <div class="content">
        <span class="label">検索</span>
      </div>
      <div class="attachments form-actions">
        <input class="nn-text-field" type="search" />
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
  display: flex;
  align-items: center;
  color: #fff;
  font-size: var(--font-size-14);

  & > * {
    flex: 0 0 auto;
  }

  .nn-icon + .label {
    margin-left: 4px;
  }
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
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  > button {
    flex: 0 0 auto;
  }
}
.form-actions {
  width: 200px;
  .select {
    width: 100%;
  }
}
.hazy-post {
  border: none;
}
</style>
