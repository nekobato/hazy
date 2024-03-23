import { type MisskeyNote as MisskeyNoteType } from "@shared/types/misskey";
import PostList from "./PostList.vue";
import MisskeyNote from "./MisskeyNote.vue";
import type { StoryObj, Meta } from "@storybook/vue3";

type Story = StoryObj<typeof MisskeyNote>;

const meta: Meta<typeof MisskeyNote> = {
  component: MisskeyNote,
  title: "MisskeyNote",
};

export default meta;

const text =
  "Misskeyはフリーかつオープンなプロジェクトで、誰でも自由にMisskeyを使ったサーバーを作成できるため、既に様々なサーバーがインターネット上に公開されています。また重要な特徴として、MisskeyはActivityPubと呼ばれる分散通信プロトコルを実装しているので、どのサーバーを選んでも他のサーバーのユーザーとやりとりすることができます。これが分散型と言われる所以で、単一の運営者によって単一のURLで公開されるような、Twitterなどの他サービスとは根本的に異なっています。サーバーによって主な話題のテーマやユーザー層、言語などは異なり、自分にあったサーバーを探すのも楽しみのひとつです(もちろん自分のサーバーを作るのも一興です)。";

const note: MisskeyNoteType = {
  id: "1",
  createdAt: "2021-07-01T00:00:00.000Z",
  text: text,
  user: {
    id: "1",
    name: "User Name",
    username: "user",
    avatarUrl: "https://picsum.photos/128",
    host: null,
    avatarBlurhash: null,
    avatarDecorations: [],
    emojis: {},
    onlineStatus: "active",
  },
  emojis: {},
  files: [],
  userId: "1",
  visibility: "public",
  reactionAcceptance: "all",
  reactionEmojis: {},
  reactions: {},
  renoteCount: 0,
  repliesCount: 0,
} as MisskeyNoteType;

const reactions = {
  "👍": 10,
  "👎": 5,
};

export const Default: Story = {
  args: {
    post: note,
    emojis: [],
    lineStyle: "all",
    currentInstanceUrl: "https://misskey.io",
    hideCw: false,
  },
};

export const Renote: Story = {
  args: {
    post: { ...note, ...{ renote: note }, text: "" },
    emojis: [],
    lineStyle: "all",
    currentInstanceUrl: "https://misskey.io",
    hideCw: false,
  },
};

export const Quote: Story = {
  args: {
    post: { ...note, ...{ renote: note } },
    emojis: [],
    lineStyle: "all",
    currentInstanceUrl: "https://misskey.io",
    hideCw: false,
  },
};

export const WithCw: Story = {
  args: {
    post: note,
    emojis: [],
    lineStyle: "all",
    currentInstanceUrl: "https://misskey.io",
    hideCw: false,
  },
};

export const WithEmoji: Story = {
  args: {
    post: { ...note, ...{ reactions: reactions } },
    emojis: [],
    lineStyle: "all",
    currentInstanceUrl: "https://misskey.io",
    hideCw: false,
  },
};

export const NoteList: Story = {
  render: (args) => ({
    components: { PostList, MisskeyNote },
    setup() {
      return { args };
    },
    template:
      "<PostList><MisskeyNote v-bind='args' /><MisskeyNote v-bind='args' /><MisskeyNote v-bind='args' /><MisskeyNote v-bind='args' /></PostList>",
  }),
  args: {
    post: note,
    emojis: [],
    lineStyle: "all",
    currentInstanceUrl: "https://misskey.io",
    hideCw: false,
  },
};

export const NoteListLoading: Story = {
  render: (args) => ({
    components: { PostList, MisskeyNote },
    setup() {
      return { args };
    },
    template: "<PostList status='loading' ></PostList>",
  }),
};
