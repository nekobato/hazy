<script setup lang="ts">
import { useStore } from "@/store";
import { useSettingsStore } from "@/store/settings";
import { Icon } from "@iconify/vue";
import type { Settings } from "@shared/types/store";
import { ElSlider, ElSwitch, ElInputNumber, ElSelect, ElOption } from "element-plus";
import { watch } from "vue";

const store = useStore();
const settingsStore = useSettingsStore();

// const shortcuts = reactive<Settings["shortcuts"]>({
//   toggleTimeline: store.settings?.shortcuts.toggleTimeline || "",
// });

watch(
  () => store.settings?.opacity,
  async () => {
    await settingsStore.setOpacity(store.settings?.opacity);
  },
);

const onChangeMaxPostCount = async (value: number) => {
  await settingsStore.setMaxPostCount(value);
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

const onChangeHideCw = async (value: string | number | boolean) => {
  await settingsStore.setMisskeyHideCw(!value);
};

const onChangeShowReaction = async (value: string | number | boolean) => {
  await settingsStore.setMisskeyShowReactions(!!value);
};
</script>

<template>
  <div class="account-settings" v-if="store.settings">
    <h2 class="hazy-field-group-title">設定</h2>
    <div class="hazy-field-row indent-1 wrap">
      <div class="content">
        <span class="title"><Icon icon="mingcute:ghost-line" class="nn-icon size-small" /><span>の透明度</span></span>
      </div>
      <div class="actions">
        <ElSlider v-model="store.settings.opacity" :min="0" :max="100" show-input size="small" />
      </div>
    </div>

    <div class="hazy-field-row indent-1">
      <div class="content">
        <span class="title">タイムラインの最大表示数</span>
      </div>
      <div class="form-actions">
        <ElInputNumber
          class="action-field"
          :min="10"
          :max="2000"
          v-model="store.settings.maxPostCount"
          @change="(value) => onChangeMaxPostCount(Number(value))"
          size="small"
        />
      </div>
    </div>

    <div class="hazy-field-row indent-1">
      <div class="content">
        <span class="title">ノートの表示スタイル</span>
      </div>
      <div class="form-actions">
        <ElSelect
          class="action-field"
          :model-value="store.$state.settings.postStyle"
          size="small"
          @change="onChangePostStyle"
        >
          <ElOption
            v-for="option in postStyleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>
    </div>

    <!-- <SectionTitle title="グローバルショートカットキー" />
    <div class="hazy-field-row indent-1">
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
    <h2 class="hazy-field-group-title">Misskey</h2>
    <div class="hazy-field-row indent-1">
      <div class="content">
        <span class="title">隠された文字をデフォルトで表示する</span>
      </div>
      <div class="form-actions">
        <label class="nn-checkbox">
          <ElSwitch :model-value="!store.settings.misskey?.hideCw" @change="onChangeHideCw" />
        </label>
      </div>
    </div>
    <div class="hazy-field-row indent-1">
      <div class="content">
        <span class="title">リアクションを表示する</span>
      </div>
      <div class="form-actions">
        <label class="nn-checkbox">
          <ElSwitch :model-value="store.settings.misskey?.showReactions" @change="onChangeShowReaction" />
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

.hazy-field-row {
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
.action-field {
  width: 130px;
}
</style>
