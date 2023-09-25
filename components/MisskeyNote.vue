<script setup lang="ts">
import { useTimelineStore } from "@/store/timeline";
import { ipcSend } from "@/utils/ipc";
import { Icon } from "@iconify/vue";
import { PropType, computed } from "vue";
import { MisskeyNote } from "~/types/misskey";
import { parseMisskeyAttachments } from "~/utils/misskey";
import PostAttachment from "./PostAttachment.vue";

const timelineStore = useTimelineStore();

const props = defineProps({
  post: {
    type: Object as PropType<MisskeyNote>,
    required: true,
  },
});

const cwHtml = computed(() => {
  return parseMisskeyNoteText(props.post.cw, timelineStore.currentInstance?.misskey?.emojis || []);
});

const textHtml = computed(() => {
  return parseMisskeyNoteText(props.post.text, timelineStore.currentInstance?.misskey?.emojis || []);
});

const postType = computed(() => {
  if (props.post.renote) {
    if (props.post.text) {
      return "quote";
    } else {
      return "renote";
    }
  } else if (props.post.replyId) {
    return "reply";
  } else {
    return "post";
  }
});

const postAtttachments = computed(() => {
  if (props.post.files?.length) {
    return parseMisskeyAttachments(props.post.files);
  } else if (props.post.renote?.files?.length) {
    return parseMisskeyAttachments(props.post.renote.files);
  }
  return undefined;
});

const reactions = computed(() => {
  const reactions = (props.post.renote ? props.post.renote?.reactions : props.post.reactions) || {};
  return Object.keys(reactions)
    .map((key) => {
      const reactionName = key.replace(/:|@\./g, "");
      const localEmoji = timelineStore.currentInstance?.misskey?.emojis.find((emoji) => emoji.name === reactionName);
      return {
        name: key,
        url: localEmoji?.url || props.post.reactionEmojis[reactionName] || "",
        count: reactions[key],
        isRemote: !localEmoji,
      };
    })
    .sort((a, b) => b.count - a.count);
});

const openPost = () => {
  ipcSend("open-url", { url: new URL(`/notes/${props.post.id}`, timelineStore.currentInstance?.url).toString() });
};

const openReactionWindow = () => {
  ipcSend("post:reaction", { instanceUrl: timelineStore.currentInstance?.url, postId: props.post.id });
};

const onClickReaction = (postId: string, reaction: string) => {
  if (isMyReaction(reaction, props.post.myReaction)) {
    deleteReaction(postId);
  } else {
    // 既にreactionがある場合は削除してから追加
    if (props.post.myReaction) {
      deleteReaction(postId, false);
    }
    createReaction(postId, reaction);
  }

  timelineStore.updatePost({
    postId,
  });
};

const createReaction = (postId: string, reaction: string) => {
  timelineStore.createReaction({
    postId,
    reaction,
  });
};

const deleteReaction = (postId: string, noUpdate?: boolean) => {
  timelineStore.deleteReaction({
    postId,
    noUpdate,
  });
};

const isMyReaction = (reaction: string, myReaction?: string) => {
  if (!myReaction) return false;
  return reaction === myReaction;
};
</script>

<template>
  <div class="hazy-post" :class="[postType]">
    <div class="post-data-group">
      <div class="post-data">
        <div class="hazy-post-info">
          <span class="username" v-html="props.post.user.name" />
        </div>
        <div class="hazy-post-contents">
          <img class="hazy-avatar" :src="props.post.user.avatarUrl" alt="" />
          <p class="hazy-post-body" v-html="cwHtml" v-if="props.post.cw" />
          <p class="hazy-post-body" v-html="textHtml" v-if="props.post.text" />
        </div>
      </div>
      <div class="renote-data" v-if="props.post.renote">
        <div class="hazy-post-info">
          <span class="username" v-html="props.post.renote?.user.name" />
        </div>
        <div class="hazy-post-contents">
          <img class="hazy-avatar" :src="props.post.renote?.user.avatarUrl" alt="" />
          <p class="hazy-post-body" v-html="props.post.renote?.text" />
        </div>
      </div>
    </div>
    <div class="attachments" v-if="postAtttachments">
      <PostAttachment v-for="attachment in postAtttachments" :attachment="attachment" />
    </div>
    <div class="reactions">
      <button
        class="reaction"
        v-for="reaction in reactions"
        :class="{ remote: reaction.isRemote, reacted: isMyReaction(reaction.name, props.post.myReaction) }"
        @click="onClickReaction(props.post.id, reaction.name)"
      >
        <img :src="reaction.url" class="emoji" v-if="reaction.url" />
        <span class="emoji-default" v-else>{{ reaction.name }}</span>
        <span class="count">{{ reaction.count }}</span>
      </button>
    </div>
    <div class="hazy-post-actions">
      <button class="hazy-post-action" @click="openReactionWindow">
        <Icon class="nn-icon size-xsmall" icon="mingcute:add-fill" />
      </button>
      <button class="hazy-post-action" @click="openPost">
        <Icon class="nn-icon size-xsmall" icon="mingcute:external-link-line" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.username {
  color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
  font-size: var(--font-size-10);
  font-style: normal;
  line-height: var(--font-size-10);
  white-space: nowrap;

  img.emoji {
    width: var(--font-size-12);
    height: var(--font-size-12);
    margin-bottom: -2px;
  }
}
.post-data,
.renote-data {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.renote-data {
  margin-top: 4px;
  padding-left: 8px;
  &::before {
    position: absolute;
    left: 0;
    display: inline-flex;
    width: 4px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.32);
    border-radius: 2px;
    content: "";
  }
}

.hazy-post {
  &.renote {
    .post-data {
      .username {
        display: none;
      }
      .hazy-avatar {
        width: 20px;
        height: 20px;
      }
    }
    .renote-data {
      margin-top: -46px;
      padding-left: 12px;
      &::before {
        display: none;
      }
      .username {
        margin-left: -12px;
      }
    }
  }
}
.attachments {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  width: 100%;
  margin-top: 4px;
}
.reactions {
  display: flex;
  gap: 4px;
  width: 100%;
  margin-top: 4px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .reaction {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    height: 24px;
    padding: 0 2px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    &:not(.remote) {
      cursor: pointer;
      &:hover {
        border: 1px solid rgba(255, 255, 255, 0.4);
      }
    }
    &.reacted {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .emoji {
      height: 20px;
    }
    .emoji-default {
      color: #fff;
      font-size: 16px;
      line-height: 20px;
    }
    .count {
      margin-left: 4px;
      color: #fff;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>