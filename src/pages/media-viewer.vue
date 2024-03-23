<script setup lang="ts">
import { ipcSend } from "@/utils/ipc";
import { reactive } from "vue";
import Loading from "@/components/common/HazyLoading.vue";

const getMediaWindowSize = (maxWidth: number, maxHeight: number, width?: number, height?: number) => {
  if (!width || !height) return { width: 0, height: 0 };

  let contractionRatio = 1;
  const widthRatio = (maxWidth * 0.8) / width;
  const heightRatio = (maxHeight * 0.8) / height;
  contractionRatio = 1 > widthRatio ? widthRatio : 1;
  contractionRatio = 1 > heightRatio && widthRatio > heightRatio ? heightRatio : contractionRatio;
  return { width: width * contractionRatio, height: height * contractionRatio };
};

type Media = {
  type: "image" | "video" | "audio";
  url: string;
  thumbnailUrl: string;
  size: { width: number; height: number };
  maxSize: { width: number; height: number };
};

const state = reactive({
  media: {} as Media,
  size: { width: 0, height: 0 },
  isLoading: true,
});

const onReady = () => {
  state.isLoading = false;
};

window.ipc?.on("media-viewer:open", (_, data: Media) => {
  state.media = data;
  state.size = getMediaWindowSize(data.maxSize.width, data.maxSize.height, data.size?.width, data.size?.height);

  if (data.type === "video") {
    // state.variants = data.variants;
  }
});

const closeWindow = () => {
  ipcSend("media-viewer:close");
  // reset state
  state.media = {} as Media;
  state.size = { width: 0, height: 0 };
  state.isLoading = true;
};
</script>

<template>
  <div class="media-viewer" @click="closeWindow">
    <video
      v-if="state.media.type === 'video'"
      :src="state.media.url"
      :width="state.size?.width || undefined"
      :height="state.size?.height || undefined"
      autoplay
      controls
      @canplay="onReady"
    />
    <img
      v-if="state.media.type === 'image'"
      :src="state.media.url"
      :width="state.size?.width || undefined"
      :height="state.size?.height || undefined"
      @load="onReady"
    />
    <audio v-if="state.media.type === 'audio'" :src="state.media.url" @load="onReady" />
    <Loading class="loading" v-if="state.isLoading" />
  </div>
</template>
<style lang="scss" scoped>
.media-viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
img,
video,
audio {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
</style>
