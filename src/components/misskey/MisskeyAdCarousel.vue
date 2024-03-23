<script lang="ts" setup>
import { MisskeyAd } from "@shared/types/misskey";
import { ElCarousel, ElCarouselItem } from "element-plus";
import { PropType } from "vue";

defineProps({
  items: {
    type: Array as PropType<MisskeyAd[]>,
    required: true,
  },
});
</script>
<template>
  <div class="ad-container">
    <ElCarousel class="carousel misskey-ad-carousel" :autoplay="true" :interval="5000" arrow="always">
      <ElCarouselItem class="carousel-item" v-for="(item, index) in items" :key="index">
        <a :href="item.url" target="_blank" rel="noopener noreferrer">
          <img :src="item.imageUrl" :alt="`ad ${index + 1}`" />
        </a>
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>
<style lang="scss">
.ad-container {
  position: relative;
  width: 100%;
  margin: 0;
  background-color: transparent;
  background-color: var(--hazy-background-color);
  border: 1px solid var(--hazy-border-color);
  overflow: hidden;
  border-radius: 8px;
}
.misskey-ad-carousel {
  /* carousel height */
  height: 90px;
  .el-carousel__container {
    height: 100%;
  }
  .el-carousel__indicators {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    --el-carousel-indicator-width: 16px;
  }
}
</style>
<style lang="scss" scoped>
.carousel {
  height: 120px;
  position: relative;

  .carousel-item {
    display: flex;
    height: 120px;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .el-carousel__indicators {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
  }
}
</style>
