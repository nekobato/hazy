<script setup lang="ts">
import { information } from "@/store/information";
</script>

<template>
  <div class="information hazy-post-list">
    <h2 class="hazy-field-group-title">その他</h2>

    <div class="hazy-field-row indent-1">
      <div class="content">バージョン</div>
      <div class="form-actions">
        <span>{{ information.version }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.information {
  width: 100%;
}

.content {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  color: #fff;
  font-size: var(--font-size-14);
  .title {
    display: inline-flex;
    align-items: center;
    color: var(--color-text-body);
  }
}
.form-actions {
  color: var(--color-text-body);
  font-size: var(--font-size-16);
}
.hazy-post {
  display: flex;
  border: none;
}
</style>
