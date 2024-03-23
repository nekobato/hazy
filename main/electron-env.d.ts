/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    DIST: string;
    VITE_PUBLIC: string;
  }
}

interface Window {
  ipc: {
    send: (event: string, payload?: any) => void;
    invoke: (event: string, payload?: any) => Promise<any>;
    on: (event: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
  };
}
