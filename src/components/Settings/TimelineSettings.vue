<script setup lang="ts">
import { useStore } from "@/store";
import { useTimelineStore } from "@/store/timeline";
import type { Timeline } from "@shared/types/store";
import TimelineForm from "./TimelineForm.vue";

const store = useStore();
const timelineStore = useTimelineStore();

const onUpdateTimeline = async (timeline: Timeline) => {
  await timelineStore.updateTimeline({
    id: timeline.id,
    userId: timeline.userId,
    channel: timeline?.channel,
    options: timeline?.options,
    available: timeline?.available,
  });
};
</script>

<template>
  <div class="account-settings hazy-post-list" v-if="store.$state.users.length">
    <h2 class="hazy-field-group-title">タイムライン</h2>
    <div v-for="timeline in store.timelines" :key="timeline.id">
      <TimelineForm :timeline="timeline" @updateTimeline="onUpdateTimeline" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account-settings {
  width: 100%;
}
</style>
