import { entities } from "misskey-js";
import * as mfm from "mfm-js";

export type MisskeyNote = entities.Note & {
  reactionEmojis: {
    [key: string]: string;
  };
  renote?: MisskeyNote["renote"] & {
    reactionEmojis: {
      [key: string]: string;
    };
  };
};

export type MisskeyChannel = {
  bannerUrl: string;
  color: string;
  createdAt: string;
  description: string;
  hasUnreadNote: boolean;
  id: string;
  isArchived: boolean;
  isFavorited: boolean;
  isFollowing: boolean;
  lastNotedAt: string;
  name: string;
  notesCount: number;
  pinnedNoteIds: string[];
  userId: string;
  usersCount: number;
};

export type MisskeyInstance = {
  id: string;
  type: "misskey";
  name: string;
  url: string;
  iconUrl: string;
  ads?: {
    dayOfWeek: 0;
    id: string;
    imageUrl: string;
    place: string;
    ratio: number;
    url: string;
  };
};

export type MisskeyAd = {
  dayOfWeek: 0;
  id: string;
  imageUrl: string;
  place: string;
  ratio: number;
  url: string;
};

export { api as MisskeyApi, entities as MisskeyEntities };
