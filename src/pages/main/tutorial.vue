<script setup lang="ts">
import { Icon } from "@iconify/vue";
import TutorialAvatar from "@/components/Tutorial/TutorialAvatar.vue";
import WindowHeader from "@/components/WindowHeader.vue";
</script>
<template>
  <div class="tutorial hazy-post-container">
    <WindowHeader windowType="tutorial" />
    <div class="hazy-post-list">
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">Hazy Streamのチュートリアルだよ</p>
      </div>
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">
          hazyはMisskeyのタイムラインをコンパクトにして、ながら見に特化したTwitterクライアントだよ。タイムラインを表示しながら他の作業をすることができるよ。書く能力はまだあんまりないよ。
        </p>
      </div>
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">
          hazyは起動していることを周りに悟られないように、Dockには出てこないよ。タスクバーに現れたアイコンを押すとメニューが出てきて、ここでモードや画面の表示を切り替えられるよ。設定もここからだね。
        </p>
      </div>
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">
          hazyには可視, 霞<Icon icon="ion:eye-outline" class="nn-icon" />, 不可視<Icon
            icon="ion:eye-off"
            class="nn-icon"
          />のモードがあるよ。可視は普通のウィンドウと同じで、霞は半透明で見えるけど触れないモード。霞モードの透明度は設定から変更できるよ。不可視は隠れてるけどタイムラインは動いてるよ。
        </p>
      </div>
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">
          モードの切り替えはグローバルキーボードショートカットで指定もできるよ。緊急の時には使ってね。
        </p>
      </div>
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">
          まずは設定からアカウントを追加してね。そして表示したいタイムラインを設定したら使えるようになるよ。
        </p>
      </div>
      <div class="hazy-post">
        <TutorialAvatar class="hazy-avatar" />
        <p class="hazy-post-body no-clamp">
          何かおかしなことがあったらフォーラムで共有してね！あと腕に覚えのある人は自分でコードを書いてくれてもいいよ。
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tutorial {
  background-color: var(--hazy-background-color);
}
.hazy-post {
  display: flex;
  align-items: flex-start;
}
.hazy-post-body {
  .nn-icon {
    width: auto;
    height: var(--post-body--line-height);
    margin: 0 2px -4px;
    line-height: var(--post-body--line-height);
  }
}
</style>
