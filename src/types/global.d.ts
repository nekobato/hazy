import { type IpcRendererEvent } from "electron";

declare global {
  interface Window {
    ipc: {
      send: (event: string, payload?: any) => void;
      invoke: (event: string, payload?: any) => Promise<any>;
      on: (event: string, callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
    };
  }
}
