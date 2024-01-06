import type { Instance, Timeline, User, Settings } from "@shared/types/store";

export const ipcSend = (event: string, payload?: object) => {
  if (typeof window === "undefined") return;
  window.ipc?.send(event, JSON.stringify(payload));
};

interface IpcEventMaps {
  api: {
    args: any;
    result: any;
  };
  pipe: {
    args: any;
    result: any;
  };
  "db:get-users": {
    args: void;
    result: User[];
  };
  "db:upsert-user": {
    args: Omit<User, "id"> | Partial<User>;
    result: User;
  };
  "db:delete-user": {
    args: { id: string };
    result: void;
  };
  "db:get-timeline-all": {
    args: void;
    result: Timeline[];
  };
  "db:set-timeline": {
    args: Omit<Timeline, "id"> | (Partial<Timeline> & { id: string });
    result: void;
  };
  "db:delete-timeline": {
    args: { id: string };
    result: void;
  };
  "db:get-instance-all": {
    args: void;
    result: Instance[];
  };
  "db:upsert-instance": {
    args: (Partial<Instance> & { id: number }) | Omit<Instance, "id">;
    result: Instance;
  };
  "settings:set": {
    args: {
      key: string;
      value: any;
    };
    result: void;
  };
  "settings:all": {
    args: void;
    result: Settings;
  };
}

export const ipcInvoke = <T extends keyof IpcEventMaps>(
  event: T,
  payload?: IpcEventMaps[T]["args"],
): Promise<IpcEventMaps[T]["result"]> => {
  return window.ipc?.invoke(event, JSON.stringify(payload));
};
