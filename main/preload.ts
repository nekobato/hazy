import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld("ipc", {
  send(event: string, payload: any) {
    ipcRenderer.send("renderer-event", event, payload);
  },
  async invoke(event: string, payload: any) {
    const result = await ipcRenderer.invoke("renderer-event", event, payload);
    console.log("result", event, result);
    return result;
  },
  on(event: string, callback: (event: IpcRendererEvent, ...args: any[]) => void) {
    ipcRenderer.on(event, callback);
  },
});
