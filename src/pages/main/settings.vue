<script setup lang="ts">
import AccountSettings from "@/components/Settings/AccountSettings.vue";
import ApplicationInformation from "@/components/Settings/ApplicationInformation.vue";
import ApplicationSettings from "@/components/Settings/ApplicationSettings.vue";
import FieldRow from "@/components/Settings/FieldRow.vue";
import TimelineSettings from "@/components/Settings/TimelineSettings.vue";
import WindowHeader from "@/components/WindowHeader.vue";
</script>

<template>
  <div class="settings">
    <WindowHeader windowType="settings" />
    <div class="hazy-scroller">
      <FieldRow />
      <FieldRow :indent="1" />
      <FieldRow :indent="1" />
      <AccountSettings />
      <TimelineSettings />
      <ApplicationSettings />
      <ApplicationInformation />
    </div>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}
.hazy-scroller {
  border: 1px solid var(--hazy-border-color);
}
</style>
