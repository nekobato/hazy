import { join } from "path";
import electron, { BrowserWindow, screen } from "electron";
import { getSettingAll } from "../db";
import { pageRoot, preload } from "../static";

const pageName = "/main";

export function createMainWindow() {
  const settings = getSettingAll();
  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: settings.windowSize.width || 360,
    height: settings.windowSize.height || screen.getPrimaryDisplay().workAreaSize.height - 24, // size of Mac tray size
    minWidth: 360,
    minHeight: 240,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      preload: preload,
    },
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: false,
    roundedCorners: false,
    show: true,
    icon: join("build", `app_icon.png`),
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL(join(pageRoot.development, pageName));
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(pageRoot.production), { hash: pageName });
    win.webContents.openDevTools();
  }

  win.on("ready-to-show", () => {
    win.show();
  });

  win.webContents?.on("will-navigate", (e, url) => {
    e.preventDefault();
    console.log("will-navigate", url);
    electron.shell.openExternal(url);
  });

  return win;
}
