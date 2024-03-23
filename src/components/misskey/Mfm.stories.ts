import Mfm from "./Mfm.vue";
import type { StoryObj, Meta } from "@storybook/vue3";

type Story = StoryObj<typeof Mfm>;

const meta: Meta<typeof Mfm> = {
  component: Mfm,
  title: "Mfm",
};

export default meta;

export const Default: Story = {
  args: {
    text: "Hello, world!",
  },
};

export const Text: Story = {
  args: {
    text: "Normal Text",
  },
};

export const Bold: Story = {
  args: {
    text: "**Bold Text**",
  },
};

export const Italic: Story = {
  args: {
    text: "<i>斜め</i>",
  },
};

export const Strike: Story = {
  args: {
    text: "~~打ち消し~~",
  },
};

// `inline code (JavaScript highlight)`

export const InlineCode: Story = {
  args: {
    text: "`inline code`",
  },
};

// URL
export const Url: Story = {
  args: {
    text: "https://example.com",
  },
};

export const BlockCode: Story = {
  args: {
    text: "```javascript\nconst a = 1;\n```",
  },
};

// 中央揃え(ブロック要素)
export const Center: Story = {
  args: {
    text: "<center>\n中央揃え\n</center>",
  },
};

// Search
export const Search: Story = {
  args: {
    text: "misskey 検索",
    host: "https://misskey.io",
  },
};

// small
export const Small: Story = {
  args: {
    text: "プリンはmisskey開発者の好物<small>だった気がする…</small>",
  },
};

// 背景色
export const BackgroundColor: Story = {
  args: {
    text: "$[fg.color=f00 赤字]\n$[bg.color=ff0 黄背景]",
  },
};

// blur
export const Blur: Story = {
  args: {
    text: "もりもり$[blur あ]んこ",
  },
};

// Font
export const Font: Story = {
  args: {
    text: "$[font.cursive MisskeyでFediverseの世界が広がります]",
  },
};

// Flip
export const Flip: Story = {
  args: {
    text: "$[flip MisskeyでFediverseの世界が広がります]",
  },
};

// 角度変更
export const Rotate: Story = {
  args: {
    text: "$[rotate.deg=30 misskey]",
  },
};

// 日時
export const Date: Story = {
  args: {
    text: "$[unixtime 1700000000]",
  },
};

// ruby
export const Ruby: Story = {
  args: {
    text: "漢字$[ruby かんじ]",
  },
};

// 位置変更
export const Position: Story = {
  args: {
    text: "$[position.x=100 y=100 位置変更]",
  },
};

// 拡大
export const Scale: Story = {
  args: {
    text: "$[scale.x=2 y=2 拡大]",
  },
};

// シンプル拡大
export const FnX: Story = {
  args: {
    text: "$[x2 x2] $[x3 x3] $[x4 x4]",
  },
};

// アニメーション(びよんびよん)
export const Animation: Story = {
  args: {
    text: "$[animation.bounce びよんびよん]",
  },
};

// アニメーション(じゃーん)
export const Animation2: Story = {
  args: {
    text: "$[tada 🍮] $[tada.speed=5s 🍮]",
  },
};

// アニメーション(ジャンプ)
export const Animation3: Story = {
  args: {
    text: "$[jump 🍮] $[jump.speed=5s 🍮]",
  },
};

// アニメーション(バウンド)
export const Animation4: Story = {
  args: {
    text: "$[bounce 🍮] $[bounce.speed=5s 🍮]",
  },
};

// アニメーション(回転)
export const Animation5: Story = {
  args: {
    text: `$[spin 🍮] $[spin.left 🍮] $[spin.alternate 🍮]\n
      $[spin.x 🍮] $[spin.x,left 🍮] $[spin.x,alternate 🍮]\n
      $[spin.y 🍮] $[spin.y,left 🍮] $[spin.y,alternate 🍮]\n
      $[spin.speed=5s 🍮]`,
  },
};

// アニメーション(ぶるぶる)
export const Animation6: Story = {
  args: {
    text: "$[shake 🍮] $[shake.speed=5s 🍮]",
  },
};

// アニメーション(ブレ)
export const Animation7: Story = {
  args: {
    text: "$[twitch 🍮] $[twitch.speed=5s 🍮]",
  },
};

// レインボー装飾
export const Rainbow: Story = {
  args: {
    text: "$[rainbow $[fg.color=f0f 色付き文字]]",
  },
};

// キラキラ装飾
export const Sparkle: Story = {
  args: {
    text: "$[sparkle 🍮]",
  },
};
