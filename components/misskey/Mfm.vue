<script lang="tsx">
import { defineComponent } from "vue";
import * as mfm from "mfm-js";
import { Settings } from "~/types/store";
import { PropType } from "vue";
import { MisskeyEntities } from "~/types/misskey";

export default defineComponent({
  name: "Mfm",
  props: {
    text: {
      type: String,
      required: true,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    clamp: {
      type: Boolean,
      default: false,
    },
    host: {
      type: String,
      default: null,
    },
    nowrap: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Object,
      default: null,
    },
    isNote: {
      type: Boolean,
      default: true,
    },
    emojis: {
      type: Array as PropType<MisskeyEntities.CustomEmoji[]>,
      default: null,
    },
    postStyle: {
      type: String,
      default: "default" as Settings["postStyle"],
    },
  },
  render() {
    if (this.text == null || this.text === "") return null;

    const ast = (this.plain ? mfm.parseSimple : mfm.parse)(this.text);
    const enableAnimation = true; // TODO: settings

    console.log(this.text, ast);

    const structElement = (ast: mfm.MfmNode[]) =>
      ast.map((node) => {
        switch (node.type) {
          case "text":
            return <span>{node.props.text}</span>;
          case "bold":
            return <strong>{structElement(node.children)}</strong>;
          case "blockCode":
            return <pre class={`language-${node.props.lang}`}>{node.props.code}</pre>;
          case "center":
            return <div class="center">{structElement(node.children)}</div>;
          case "emojiCode":
            return (
              <img
                class="emoji"
                src={this.emojis?.find((emoji) => emoji.name === node.props.name)?.url}
                alt={node.props.name}
                title={node.props.name}
              />
            );
          case "fn":
            return (
              <span class="fn">
                {node.props.name}
                {node.children.length > 0 && (
                  <span class="fn-args">
                    (
                    {node.children.map((child) => (
                      <span class="fn-arg">{structElement([child])}</span>
                    ))}
                    )
                  </span>
                )}
              </span>
            );
          case "hashtag":
            return (
              <a href={`/search?q=${encodeURIComponent(node.props.tag)}`} class="hashtag">
                #{node.props.hashtag}
              </a>
            );
          case "inlineCode":
            return <code>{node.props.code}</code>;
          case "italic":
            return <em>{structElement(node.children)}</em>;
          case "link":
            return (
              <a href={node.props.url} target="_blank" rel="noopener noreferrer">
                {structElement(node.children)}
              </a>
            );
          case "mathBlock":
            return <div class="math">{node.props.formula}</div>;
          case "mathInline":
            return <span class="math">{node.props.formula}</span>;
          case "mention":
            return (
              <a href={`/${node.props.username}`} class="mention">
                @{node.props.username}
              </a>
            );
          case "plain":
            return <span>{structElement(node.children)}</span>;
          case "quote":
            return <blockquote>{structElement(node.children)}</blockquote>;
          case "search":
            return (
              <a href={`/search?q=${encodeURIComponent(node.props.query)}`} class="search">
                {node.props.query}
              </a>
            );
          case "small":
            return <small>{structElement(node.children)}</small>;
          case "strike":
            return <del>{structElement(node.children)}</del>;
          case "unicodeEmoji":
            return <span class="emoji">{node.props.emoji}</span>;
          case "url":
            return (
              <a href={node.props.url} target="_blank" rel="noopener noreferrer">
                {node.props.url}
              </a>
            );
          default:
            console.error("Unknown node type", node);
            break;
        }
      });

    return h("p", { class: ["hazy-post-body", { clamp: this.clamp }] }, structElement(ast));
  },
});
</script>
