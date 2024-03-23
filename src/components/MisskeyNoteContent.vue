<script setup lang="ts">
import { emojisObject2Array, parseMisskeyText } from "@/utils/misskey";
import { Icon } from "@iconify/vue";
import type { MisskeyNote } from "@shared/types/misskey";
import { computed, ref, type PropType } from "vue";
import Mfm from "./misskey/Mfm.vue";

const props = defineProps({
  note: {
    type: Object as PropType<MisskeyNote>,
    required: true,
  },
  type: {
    type: String as PropType<"note" | "reply" | "renote" | "renoted" | "quote" | "quoted" | undefined>,
    required: true,
  },
  lineStyle: {
    type: String as PropType<"all" | "line-1" | "line-2" | "line-3">,
    required: true,
  },
  currentInstanceUrl: {
    type: String as PropType<string>,
    required: false,
  },
  emojis: {
    type: Array as PropType<{ name: string; url: string }[]>,
    default: {},
    required: true,
  },
  hideCw: {
    type: Boolean as PropType<boolean>,
    default: false,
    required: true,
  },
  noParent: {
    type: Boolean as PropType<boolean>,
    default: false,
    required: false,
  },
});

const emit = defineEmits(["openUserPage"]);

const noteEmojis = computed(() => {
  const remoteEmojis = emojisObject2Array(props.note.reactionEmojis);
  const localEmojis = props.emojis || [];
  return [...remoteEmojis, ...localEmojis];
});

const renoteUsername = computed(() => {
  const note = props.note as MisskeyNote;
  if (!note?.user.name) return note?.user.username;
  if (note && noteEmojis.value) {
    return parseMisskeyText(note.user.name, noteEmojis.value);
  }
});

const host = computed(() => {
  return props.note.user.host ? "https://" + props.note.user.host : props.currentInstanceUrl;
});

const isContentVisible = computed(() => {
  return props.type !== "renote";
});

const openUserPage = (user: MisskeyNote["user"]) => {
  emit("openUserPage", user);
};

const lineClass = computed(() => {
  switch (props.lineStyle) {
    case "all":
      return "line-all";
    case "line-1":
      return "line-1";
    case "line-2":
      return "line-2";
    case "line-3":
      return "line-3";
  }
});

const canReadAll = ref(false);

const isTextVisible = () => {
  return !props.note?.cw || !props.hideCw || canReadAll.value;
};
</script>

<template>
  <div class="note-content" :class="[props.type, { 'no-parent': props.noParent }]">
    <div class="hazy-post-info" v-if="isContentVisible">
      <span class="username" v-html="renoteUsername" @click="openUserPage(props.note.user)" />
    </div>
    <div class="hazy-post-content">
      <Icon icon="mingcute:refresh-3-line" class="post-type-mark" v-if="props.type === 'quoted'" />
      <img
        class="hazy-avatar"
        :class="{ mini: props.type === 'renote' }"
        :src="props.note.user.avatarUrl || ''"
        alt=""
        @click="openUserPage(props.note.user)"
      />
      <div class="text-container" :class="[lineClass]" v-if="isContentVisible">
        <Mfm
          class="cw"
          :text="props.note?.cw || ''"
          :emojis="noteEmojis"
          :host="host"
          :post-style="props.lineStyle"
          v-if="props.note?.cw"
        />
        <button class="nn-button size-xsmall read-all" v-if="props.note?.cw && props.hideCw">続きを見る</button>
        <Mfm
          class="text"
          :text="props.note?.text || ''"
          :emojis="noteEmojis"
          :host="host"
          :post-style="props.lineStyle"
          v-show="isTextVisible"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.username {
  img.emoji {
    width: var(--font-size-12);
    height: var(--font-size-12);
    margin-bottom: -2px;
  }
}
</style>

<style lang="scss" scoped>
.note-content {
  &.renote {
    height: 0;
  }
  &.quoted:not(.no-parent) {
    margin-top: 4px;
    padding-top: 4px;
    /* dashed boarder */
    background-image: linear-gradient(
      to right,
      var(--hazy-color-white-t2),
      var(--hazy-color-white-t2) 4px,
      transparent 4px,
      transparent 6px
    );
    background-repeat: repeat-x;
    background-size: 8px 1px;
  }
}
.post-type-mark {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
}
.username {
  display: block;
  color: var(--hazy-color-white-t5);
  font-weight: bold;
  font-size: var(--font-size-10);
  line-height: var(--font-size-10);
  white-space: nowrap;
}

.username,
.hazy-avatar {
  cursor: pointer;
}

.hazy-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: 0 0 auto 0;
  object-fit: cover;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 50%;
  &.mini {
    position: relative;
    top: 24px;
    width: 20px;
    height: 20px;
  }

  & + * {
    margin-left: 8px;
  }
}

.hazy-post-content {
  display: flex;
  width: 100%;

  > .hazy-avatar {
    flex-shrink: 0;
  }
}
.hazy-post-info + .hazy-post-content {
  margin-top: 2px;
}
.renote > .hazy-post-body > .hazy-avatar {
  width: 20px;
  height: 20px;
}

.text-container {
  min-height: calc(0.8rem * 2);
  overflow: hidden;
  color: #efefef;
  font-size: 0.6rem;
  line-height: 0.8rem;
}

.line-all {
  display: block;
  .cw,
  .text {
    display: block;
  }
}
.line-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  .cw,
  .text {
    display: inline;
  }
}
.line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  .cw,
  .text {
    display: inline;
  }
}
.line-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  .cw,
  .text {
    display: inline;
  }
}
</style>
