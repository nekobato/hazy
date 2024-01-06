<script setup lang="ts">
import { useStore } from "@/store";
import { useSettingsStore } from "@/store/settings";
import { Icon } from "@iconify/vue";
import type { Settings } from "@shared/types/store";
import SectionTitle from "../Post/SectionTitle.vue";
import HazySelect from "../common/HazySelect.vue";

const store = useStore();
const settingsStore = useSettingsStore();

// const shortcuts = reactive<Settings["shortcuts"]>({
//   toggleTimeline: store.settings?.shortcuts.toggleTimeline || "",
// });

const onChangeOpacity = async (e: Event) => {
  await settingsStore.setOpacity(Number((e.target as HTMLInputElement)?.value));
};

const onChangeMaxPostCount = async (e: Event) => {
  await settingsStore.setMaxPostCount(Number((e.target as HTMLInputElement)?.value));
};

const postStyleOptions = [
  {
    label: "全て表示",
    value: "all",
  },
  {
    label: "3行",
    value: "line-3",
  },
  {
    label: "2行",
    value: "line-2",
  },
  {
    label: "1行",
    value: "line-1",
  },
];

const onChangePostStyle = (e: InputEvent) => {
  settingsStore.setPostStyle((e.target as HTMLInputElement)?.value as Settings["postStyle"]);
};

// const onKeyDownOn = (key: keyof Settings["shortcuts"]) => async (e: KeyboardEvent) => {
//   e.preventDefault();

//   let shortcut = "";
//   shortcut += e.metaKey ? "Meta+" : "";
//   shortcut += e.ctrlKey ? "Ctrl+" : "";
//   shortcut += e.shiftKey ? "Shift+" : "";
//   shortcut += e.altKey ? "Alt+" : "";

//   if (e.key !== "Meta" && e.key !== "Ctrl" && e.key !== "Shift" && e.key !== "Alt") {
//     shortcut += e.key === " " ? "Space" : e.key;
//   }

//   shortcuts[key] = shortcut;
// };

// const onChangeShortcut = async (key: keyof Settings["shortcuts"]) => {
//   if (!/\+$/.test(shortcuts[key])) {
//     await settingsStore.setShortcutKey(key, shortcuts[key]);
//   }
// };

const onChangeHideCw = async (e: Event) => {
  await settingsStore.setMisskeyHideCw(!(e.target as HTMLInputElement)?.checked);
};
</script>

<template>
  <div class="account-settings hazy-post-list" v-if="store.settings">
    <SectionTitle title="設定" />
    <div class="hazy-post indent-1">
      <div class="content">
        <span class="title"><Icon icon="mingcute:ghost-line" class="nn-icon size-small" /><span>の透明度</span></span>
      </div>
      <div class="form-actions">
        <input
          type="range"
          min="0"
          max="100"
          class="nn-range"
          :value="store.settings.opacity"
          @input="onChangeOpacity"
        />
        <input
          type="number"
          min="0"
          max="100"
          class="nn-text-field"
          :value="store.settings.opacity"
          @change="onChangeOpacity"
        />
      </div>
    </div>

    <div class="hazy-post indent-1">
      <div class="content">
        <span class="title">タイムラインの最大表示数</span>
      </div>
      <div class="form-actions">
        <input
          type="number"
          min="10"
          max="2000"
          class="nn-text-field max-post-count"
          :value="store.settings.maxPostCount"
          @change="onChangeMaxPostCount"
        />
      </div>
    </div>

    <div class="hazy-post indent-1">
      <div class="content">
        <span class="title">ノートの表示スタイル</span>
      </div>
      <div class="form-actions">
        <HazySelect
          name="postStyle"
          :options="postStyleOptions"
          :value="store.settings.postStyle"
          @change="onChangePostStyle"
        />
      </div>
    </div>

    <!-- <SectionTitle title="グローバルショートカットキー" />
    <div class="hazy-post indent-1">
      <div class="content">
        <span class="title">タイムライン表示/非表示切り替え</span>
      </div>
      <div class="form-actions">
        <input
          type="text"
          readonly
          class="nn-text-field shortcut-key"
          v-model="shortcuts.toggleTimeline"
          @keydown="onKeyDownOn('toggleTimeline')($event)"
          @input="onChangeShortcut('toggleTimeline')"
        />
      </div>
    </div> -->
    <SectionTitle title="Misskey" />
    <div class="hazy-post indent-1">
      <div class="content">
        <span class="title">隠された文字をデフォルトで表示する</span>
      </div>
      <div class="form-actions">
        <label class="nn-checkbox">
          <input type="checkbox" :value="!store.settings.misskey?.hideCw" @change="onChangeHideCw" />
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account-settings {
  width: 100%;
}

.content {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  .title {
    display: inline-flex;
    align-items: center;
    color: var(--color-text-body);
    font-weight: bold;
    font-size: 14px;
  }
}

.hazy-post {
  display: flex;
  border: none;
}

.max-post-count {
  width: 80px;
}
.shortcut-key {
  width: 120px;
  font-size: var(--font-size-12);
}
</style>
