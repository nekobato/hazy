import {
  misskeyCheckMiAuth,
  misskeyCreateReaction,
  misskeyDeleteReaction,
  misskeyCreateNote,
  misskeyGetEmojis,
  misskeyGetTimelineGlobal,
  misskeyGetTimelineHome,
  misskeyGetTimelineLocal,
  misskeyGetNoteReactions,
  misskeyGetNote,
  misskeyGetMeta,
} from "./misskey";

export const apiRequest = {
  ["misskey:checkMiAuth"]: misskeyCheckMiAuth,
  ["misskey:getEmojis"]: misskeyGetEmojis,
  ["misskey:getTimelineHome"]: misskeyGetTimelineHome,
  ["misskey:getTimelineLocal"]: misskeyGetTimelineLocal,
  ["misskey:getTimelineGlobal"]: misskeyGetTimelineGlobal,
  ["misskey:createReaction"]: misskeyCreateReaction,
  ["misskey:deleteReaction"]: misskeyDeleteReaction,
  ["misskey:getNoteReactions"]: misskeyGetNoteReactions,
  ["misskey:getNote"]: misskeyGetNote,
  ["misskey:getMeta"]: misskeyGetMeta,
  ["misskey:createNote"]: misskeyCreateNote,
};
