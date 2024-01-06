import { ipcInvoke } from "@/utils/ipc";
import { MisskeyEntities } from "@shared/types/misskey";
import type { User } from "@shared/types/store";
import { defineStore } from "pinia";
import { useStore } from ".";
import { useInstanceStore } from "./instance";
import { useTimelineStore } from "./timeline";

export type NewUser = Omit<User, "id" | "instanceId"> & {
  instanceUrl: string;
};

export const useUsersStore = defineStore("users", () => {
  const store = useStore();
  const instanceStore = useInstanceStore();
  const timelineStore = useTimelineStore();

  const users = store.$state.users;
  const isEmpty = store.$state.users.length === 0;

  const deleteUser = async (id: string) => {
    await ipcInvoke("db:delete-user", { id });
    await store.initUsers();
    await timelineStore.deleteTimelineByUserId(id);
  };

  const createUser = async (user: NewUser) => {
    // Instanceが無ければ作成
    const instance =
      instanceStore.findInstance(user.instanceUrl) || (await instanceStore.createInstance(user.instanceUrl));

    if (!instance) {
      store.$state.errors.push({
        message: `${user.instanceUrl}のデータを作るのに失敗しちゃった`,
      });
      return;
    }

    // User作成
    await ipcInvoke("db:upsert-user", {
      name: user.name,
      avatarUrl: user.avatarUrl || "",
      token: user.token,
      instanceId: instance.id,
    });

    await store.initUsers();
    await store.initInstances();

    // Timelineの長さが0ならば作成
    if (store.timelines.length === 0) {
      await timelineStore.createTimeline({
        userId: store.users[0].id,
        channel: "misskey:homeTimeline",
        options: {},
        available: true,
      });
    }

    store.initTimelines();
  };

  const postMisskeyAuth = async ({ instanceUrl, sessionId }: { instanceUrl: string; sessionId: String }) => {
    const result: MisskeyEntities.User = await ipcInvoke("api", {
      method: "misskey:checkMiAuth",
      instanceUrl: instanceUrl,
      sessionId: sessionId,
    }).catch(() => {
      store.$state.errors.push({
        message: `${instanceUrl}の認証失敗`,
      });
    });
    return result;
  };

  const findInstance = (instanceId?: string) => {
    const instance = store.$state.instances.find((instance) => {
      return instance.id === instanceId;
    });
    return instance;
  };

  return { users, isEmpty, deleteUser, createUser, postMisskeyAuth, findInstance };
});
