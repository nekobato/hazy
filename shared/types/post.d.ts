export type Post = {
  id: string;
  cw: string | null;
  text: string;
  repost?: Post;
  user: { id: string | number; name: string; avatarUrl: string };
  attachments?: Attachment[];
  myReaction?: string;
  reactions: { [key: string]: number };
  replyId: string | null;
};

export type AttachmentType = "image" | "video" | "audio" | "url" | "poll";

export type Attachment = {
  type: AttachmentType;
  url?: string;
  thumbnailUrl?: string;
  size?: { width: number; height: number };
  poll?: {
    choices: string[];
    expire: number;
    multiple: boolean;
    votes: { [key: string]: string[] };
  };
  isSensitive?: boolean;
};
