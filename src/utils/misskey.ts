import type { Post } from "@shared/types/post";
import { useTimelineStore } from "@/store/timeline";
import type { MisskeyNote } from "@shared/types/misskey";

export const parseMisskeyAttachments = (files: MisskeyNote["files"]): Post["attachments"] => {
  return files.map((file) => {
    return {
      type: file.type.split("/")[0] as "image" | "video",
      url: file.url,
      thumbnailUrl: file.thumbnailUrl,
      size: {
        width: file.properties.width,
        height: file.properties.height,
      },
      isSensitive: file.isSensitive,
    };
  });
};

export const parseMisskeyText = (text: string | null, emojis: { name: string; url: string }[]): string => {
  return (
    text
      // 文中のURLをaタグに変換
      ?.replace(/(https?:\/\/[\w!?/+\-_~;.,*&@#$%()='[\]]+)/g, (_: any, p1: string) => {
        return `<a href="${p1}">${p1}</a>`;
      })
      // emojiをimgに変換
      ?.replace(/:(\w+):/g, (match: any, p1: string) => {
        const emoji = emojis.find((emoji) => emoji.name === p1);
        if (emoji) {
          return `<img src="${emoji.url}" alt="${emoji.name}" class="emoji" />`;
        } else {
          return match;
        }
      }) ?? ""
  );
};

export const isMyReaction = (reaction: string, myReaction?: string) => {
  if (!myReaction) return false;
  return reaction === myReaction;
};

export const createReaction = async (postId: string, reaction: string) => {
  const timelineStore = useTimelineStore();
  await timelineStore.createReaction({
    postId,
    reaction,
  });
  // Update reaction on Local
  const targetPost = timelineStore.current?.posts.find((post) => post.id === postId);
  if (targetPost) {
    targetPost.myReaction = reaction;
    if (!targetPost.reactions[reaction]) {
      targetPost.reactions[reaction] += 1;
    } else {
      targetPost.reactions[reaction] = 1;
    }
  }
};

export const deleteReaction = async (postId: string) => {
  const timelineStore = useTimelineStore();
  await timelineStore.deleteReaction({
    postId,
  });
  // Delete reaction on Local
  const targetPost = timelineStore.current?.posts.find((post) => post.id === postId);
  if (targetPost && targetPost.myReaction) {
    if (targetPost.reactions[targetPost.myReaction] === 1) {
      delete targetPost.reactions[targetPost.myReaction];
    } else {
      targetPost.reactions[targetPost.myReaction] -= 1;
    }
    targetPost.myReaction = undefined;
  }
};

export const emojisObject2Array = (emojis: { [name: string]: string }): { name: string; url: string }[] => {
  return Object.entries(emojis).map(([name, url]) => {
    return {
      name,
      url,
    };
  });
};
