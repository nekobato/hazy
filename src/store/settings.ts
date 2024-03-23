import { ipcInvoke } from "@/utils/ipc";
import { defineStore } from "pinia";
import { useStore } from ".";
import type { Settings } from "@shared/types/store";

export const useSettingsStore = defineStore("settings", () => {
  const store = useStore();

  const setOpacity = async (opacity: number) => {
    store.$state.settings.opacity = opacity;
    return await ipcInvoke("settings:set", { key: "opacity", value: opacity.toString() });
  };

  const setHazyMode = async (mode: "show" | "haze" | "hide") => {
    store.$state.settings.hazyMode = mode;
    return await ipcInvoke("settings:set", { key: "hazyMode", value: mode });
  };

  const setMaxPostCount = async (count: number) => {
    store.$state.settings.maxPostCount = count;
    return await ipcInvoke("settings:set", { key: "maxPostCount", value: count.toString() });
  };

  const setPostStyle = async (style: Settings["postStyle"]) => {
    store.$state.settings.postStyle = style;
    return await ipcInvoke("settings:set", { key: "postStyle", value: style });
  };

  const setShortcutKey = async (key: keyof Settings["shortcuts"], value: string) => {
    store.$state.settings.shortcuts[key] = value;
    return await ipcInvoke("settings:set", { key: `shortcuts.${key}`, value });
  };

  const setMisskeyHideCw = async (value: boolean) => {
    store.$state.settings.misskey.hideCw = value;
    return await ipcInvoke("settings:set", { key: "misskey.hideCw", value: value });
  };

  const setMisskeyShowReactions = async (value: boolean) => {
    store.$state.settings.misskey.showReactions = value;
    return await ipcInvoke("settings:set", { key: "misskey.showReactions", value: value });
  };

  return {
    setOpacity,
    setHazyMode,
    setMaxPostCount,
    setPostStyle,
    setShortcutKey,
    setMisskeyHideCw,
    setMisskeyShowReactions,
  };
});
