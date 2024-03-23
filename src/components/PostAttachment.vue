<script setup lang="ts">
import type { Attachment } from "@shared/types/post";
import { ipcSend } from "@/utils/ipc";
import { Icon } from "@iconify/vue";
import { type PropType } from "vue";

defineProps({
  attachment: {
    type: Object as PropType<Attachment>,
    required: true,
  },
});

const attachmentAction = (attachment: Attachment) => {
  switch (attachment.type) {
    case "url":
      ipcSend("open-url", { url: attachment.url });
      break;
    case "poll":
      ipcSend("open-url", { url: attachment.url });
      break;
    default:
      ipcSend("media-viewer:open", attachment);
      break;
  }
};
</script>

<template>
  <button class="attachment" :class="[attachment.type]" @click="attachmentAction(attachment)">
    <Icon icon="mingcute:music-2-line" class="nn-icon size-small audio" v-if="attachment.type === 'audio'" />
    <Icon icon="mingcute:film-line" class="nn-icon size-small video" v-if="attachment.type === 'video'" />
    <img
      class="image"
      :src="attachment.thumbnailUrl"
      alt=""
      @click="attachmentAction(attachment)"
      :tabindex="0"
      v-if="attachment.type === 'image'"
    />
    <div class="sensitive-filter" v-if="attachment.isSensitive">
      <Icon icon="octicon:alert-16" class="nn-icon size-small attention" />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.attachment {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 24px;
  padding: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  &.video {
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  > .nn-icon {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.5);
  }
}
/* opacity: 0.5; */
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sensitive-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}
</style>
