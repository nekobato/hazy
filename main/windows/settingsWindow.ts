import { join } from "path";
import { BrowserWindow } from "electron";
import { pageRoot, preload } from "../static";

const pageName = "/settings";

export function createSettingsWindow() {
  const win = new BrowserWindow({
    height: 320,
    width: 540,
    show: true,
    resizable: true,
    webPreferences: {
      preload: preload,
    },
    center: true,
    frame: false,
    skipTaskbar: true,
    fullscreenable: false,
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL(pageRoot.development + "#" + pageName);
    // win.webContents.openDevTools();
  } else {
    win.loadFile(join(pageRoot.production), { hash: pageName });
  }

  return win;
}
