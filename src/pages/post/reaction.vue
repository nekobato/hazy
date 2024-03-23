<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import type { MisskeyEntities } from "@shared/types/misskey";
import { PropType, computed, ref, watch } from "vue";
import { ipcSend } from "@/utils/ipc";

type PageProps = {
  instanceUrl: string;
  token: string;
  noteId: string;
  emojis: MisskeyEntities.EmojiSimple[];
};

const histories = useStorage<MisskeyEntities.EmojiSimple[]>("reaction-histories", []);

const search = ref("");
const searchInput = ref<HTMLInputElement | null>(null);

const props = defineProps({
  data: {
    type: Object as PropType<PageProps>,
    required: true,
  },
});

const categoryFilter = ref<string[]>([]);

const categories = computed(() => {
  const categories = new Set<string>();
  for (const emoji of props.data.emojis || []) {
    categories.add(emoji.category || "");
  }
  return Array.from(categories);
});

const filteredEmojis = computed(() => {
  return (
    props.data.emojis
      ?.filter((emoji) => {
        if (categoryFilter.value.length === 0) return true;
        return categoryFilter.value.includes(emoji.category || "");
      })
      // from search
      .filter((emoji) => {
        if (search.value === "") return true;
        return emoji.name.includes(search.value);
      })
  );
});

const selectCategory = (category: string) => {
  if (categoryFilter.value.includes(category)) {
    categoryFilter.value = categoryFilter.value.filter((c) => c !== category);
  } else {
    categoryFilter.value.push(category);
  }
};

const selectEmoji = async (emoji: MisskeyEntities.EmojiSimple) => {
  ipcSend("main:reaction", {
    postId: props.data.noteId,
    reaction: `:${emoji.name}@.:`,
  });
  ipcSend("post:close");
};

const onInputSearchEmoji = () => {
  search.value = search.value.trim();
  if (search.value === "") return;
  categoryFilter.value = [];
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    ipcSend("post:close");
  }
});

window.ipc?.on("post:reaction", () => {
  search.value === "";
});

watch(
  () => props.data.noteId,
  () => {
    if (!props.data.noteId) {
      ipcSend("post:close");
    }

    searchInput.value?.focus();
    search.value === "";
  },
);
</script>

<template>
  <div class="page">
    <ul class="category-list">
      <li v-for="category in categories">
        <button
          class="nn-button size-small"
          @click="selectCategory(category)"
          :class="{ selected: categoryFilter.includes(category) }"
        >
          <span>{{ category }}</span>
        </button>
      </li>
    </ul>
    <div class="emojis-container">
      <div class="search-container">
        <input
          class="nn-text-field"
          type="search"
          placeholder="検索"
          v-model="search"
          @input="onInputSearchEmoji"
          ref="searchInput"
        />
      </div>
      <div class="emoji-list-group">
        <div class="history-list-container">
          <ul class="emoji-list">
            <li v-for="emoji in histories">
              <button class="nn-button size-small reaction-button" @click="selectEmoji(emoji)">
                <img :src="emoji.url" :alt="emoji.name" />
              </button>
            </li>
          </ul>
        </div>
        <ul class="emoji-list">
          <li v-for="emoji in filteredEmojis">
            <button class="nn-button size-small reaction-button" @click="selectEmoji(emoji)">
              <img :src="emoji.url" :alt="emoji.name" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.reaction-button {
  height: 32px;
  padding: 0;
  border-color: var(--hazy-color-white-t1);
  > img {
    width: auto;
    height: 100%;
  }
  &:hover {
    border-color: var(--hazy-color-white-t2);
  }
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 40%;
  height: 100%;
  margin: 0;
  padding: 8px;
  overflow-y: scroll;
  list-style: none;

  > li {
    display: inline-flex;
    padding: 0 4px;
    color: #343434;
    font-size: var(--font-size-14);

    .nn-button {
      justify-content: flex-start;
      font-size: var(--font-size-12);
      &.selected {
        color: #343434;
        background-color: #fff;
      }
      > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-right: 1px solid var(--hazy-color-white-t1);
      }
      > img {
        width: auto;
        height: 24px;
      }
    }
  }
}
.emojis-container {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  overflow-y: scroll;
}
.search-container {
  padding: 8px;
  border-bottom: 1px solid var(--hazy-color-white-t1);
}

.emoji-list-group {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  list-style: none;
}
.emoji-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-content: flex-start;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  > li {
    display: inline-flex;
    flex: 0 0 auto;
  }
}
</style>
