<script setup lang="ts">
import { TimelineSetting, useStore } from "@/store";
import { useTimelineStore } from "@/store/timeline";
import { useUsersStore } from "@/store/users";
import { ElOption, ElSelect } from "element-plus";
import SectionTitle from "../Post/SectionTitle.vue";
import HazySelect from "../common/HazySelect.vue";

const channelList = [
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
    value: "misskey:listTimeline",
  },
  {
    label: "アンテナ...",
    value: "misskey:antennaTimeline",
  },
  {
    label: "チャンネル...",
    value: "misskey:channelTimeline",
  },
] as const;

const store = useStore();
const usersStore = useUsersStore();
const timelineStore = useTimelineStore();

const accountOptions = usersStore.users.map((user) => ({
  label: user.name,
  value: user.id,
}));

const timelineOptions = channelList.map((channel) => ({
  label: channel.label,
  value: channel.value,
}));

const onChangeUser = async (timelineId: string) => {
  const newTimeline = store.timelines.find((timeline) => timeline.id === timelineId);
  if (newTimeline) {
    await updateTimeline(newTimeline);
  }
};

const onChangeChannel = async (timelineId: string) => {
  const newTimeline = store.timelines.find((timeline) => timeline.id === timelineId);
  if (newTimeline) {
    await updateTimeline(newTimeline);
  }
};

const updateTimeline = async (timeline: TimelineSetting) => {
  await timelineStore.updateTimeline({
    id: timeline.id,
    userId: timeline.userId,
    channel: timeline?.channel,
    options: timeline?.options,
  });
};
</script>

<template>
  <div class="account-settings hazy-post-list">
    <SectionTitle title="タイムライン" />
    <div class="accounts-container" v-for="timeline in store.timelines" :key="timeline.id">
      <div class="hazy-post account indent-1">
        <div class="content">
          <span class="label">アカウント</span>
        </div>
        <div class="attachments form-actions">
          <HazySelect placeholder="--" :options="accountOptions" @change="onChangeUser(timeline.id)" class="select" />
        </div>
      </div>
      <div class="hazy-post account indent-1">
        <div class="content">
          <span class="label">チャンネル</span>
        </div>
        <div class="attachments form-actions">
          <HazySelect
            placeholder="--"
            :options="timelineOptions"
            @change="onChangeChannel(timeline.id)"
            class="select"
          />
        </div>
      </div>
      <div class="hazy-post account indent-1" v-if="false">
        <div class="content">
          <span class="label">検索</span>
        </div>
        <div class="attachments form-actions">
          <input class="nn-text-field" type="search" />
        </div>
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
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  > button {
    flex: 0 0 auto;
  }
}
.hazy-post {
  &.indent-1 {
    padding-left: 16px;
  }
}
.form-actions {
  .select {
    width: 240px;
  }
}
</style>