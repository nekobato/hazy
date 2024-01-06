import { entities } from "misskey-js";
import * as mfm from "mfm-js";

export type MisskeyNote = entities.Note & {
  reactionEmojis: {
    [key: string]: string;
  };
  emojis: {
    [key: string]: string;
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

export { api as MisskeyApi, entities as MisskeyEntities };
