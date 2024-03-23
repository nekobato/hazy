import electron, { app, BrowserWindow, dialog, globalShortcut, ipcMain, Menu, powerMonitor, protocol } from "electron";
import { createMainWindow } from "./windows/mainWindow";
import { createPostWindow } from "./windows/postWindow";
import { createMediaViewerWindow } from "./windows/mediaViewerWindow";
import { DEBUG, isMac } from "./env";
import { release } from "os";
import menuTemplate from "./menu";
import * as db from "./db";
import { apiRequest } from "./api";
import { checkUpdate } from "./autoupdate";
import type { Settings } from "../shared/types/store";

process.on("uncaughtException", function (error) {
  dialog.showErrorBox("Error", error.message);
});

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

checkUpdate();

let mainWindow: BrowserWindow | null = null;
let mediaViewerWindow: BrowserWindow | null = null;
let postWindow: BrowserWindow | null = null;

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

const initialize = async () => {
  const hazyMode = (await db.getSetting("hazyMode")) as Settings["hazyMode"];
  setMainWindowMode(hazyMode);
};

const setMainWindowMode = async (mode: string) => {
  switch (mode) {
    case "show":
    case "settings":
    case "tutorial":
      mainWindow?.show();
      mainWindow?.setAlwaysOnTop(false);
      mainWindow?.setIgnoreMouseEvents(false);
      mainWindow?.setOpacity(1);
      mainWindow?.setVisibleOnAllWorkspaces(false);
      break;
    case "haze":
      mainWindow?.show();
      mainWindow?.setAlwaysOnTop(true, "floating");
      mainWindow?.setIgnoreMouseEvents(true);
      mainWindow?.setVisibleOnAllWorkspaces(true);
      mainWindow?.blur();
      break;
    case "hide":
      mainWindow?.hide();
      break;
  }
};

const start = () => {
  const menu = Menu.buildFromTemplate(
    menuTemplate({
      mainWindow,
    }),
  );
  Menu.setApplicationMenu(menu);

  mainWindow = createMainWindow();
  mediaViewerWindow = createMediaViewerWindow();
  postWindow = createPostWindow();

  ipcMain.on("renderer-event", async (_, event: string, payload?: any) => {
    const data = payload ? JSON.parse(payload) : null;
    console.log(event);
    switch (event) {
      case "set-hazy-mode":
        setMainWindowMode(data.mode);
        db.setSetting("hazyMode", data.mode);
        mainWindow?.webContents.send("set-hazy-mode", data);
        break;
      case "open-url":
        electron.shell.openExternal(data.url);
        break;
      case "media-viewer:open":
        const pointerDisplay = electron.screen.getDisplayNearestPoint(electron.screen.getCursorScreenPoint());
        const workAreaSize = pointerDisplay.workAreaSize;
        mediaViewerWindow?.setPosition(pointerDisplay.bounds.x, pointerDisplay.bounds.y);
        mediaViewerWindow?.center();
        mediaViewerWindow?.webContents.send(event, { ...data, maxSize: workAreaSize });
        mediaViewerWindow?.show();
        break;
      case "media-viewer:close":
        mediaViewerWindow?.webContents.send(event, data);
        mediaViewerWindow?.hide();
        break;
      case "main:reload":
        db.setSetting("hazyMode", "show");
        mainWindow?.webContents.reload();
        break;
      case "main:reaction":
        console.log(data);
        mainWindow?.webContents.send(event, data);
        break;
      case "post:create":
        postWindow?.webContents.send(event, data);
        postWindow?.show();
        break;
      case "post:close":
        postWindow?.hide();
        break;
      case "post:reaction":
        postWindow?.webContents.send(event, data);
        postWindow?.show();
        break;
      case "stream:sub-note":
        // TODO: main processへ移植
        mainWindow?.webContents.send("stream:sub-note", data);
        break;
      case "stream:unsub-note":
        // TODO: main processへ移植
        mainWindow?.webContents.send("stream:unsub-note", data);
        break;
      case "quit":
        app.quit();
      case "test":
        console.log("test");
        break;
      default:
        throw new Error(`${event} is not defined event.`);
    }
  });

  // invoke
  ipcMain.handle("renderer-event", async (_, event: string, payload?: any) => {
    const data = payload ? JSON.parse(payload) : null;
    console.log(event, data);
    switch (event) {
      case "api":
        const method: keyof typeof apiRequest = data.method;
        if (apiRequest[method]) {
          const result = await apiRequest[method](data);
          return result || {};
        } else {
          throw new Error(`${data.method} is not defined method.`);
        }
      case "db:get-users":
        return db.getUserAll();
      case "db:upsert-user":
        return db.upsertUser(data);
      case "db:delete-user":
        return db.deleteUser(data.id);
      case "db:get-timeline-all":
        return db.getTimelineAll();
      case "db:set-timeline":
        return db.setTimeline(data);
      case "db:delete-timeline":
        return db.deleteTimeline(data.id);
      case "db:get-instance-all":
        return db.getInstanceAll();
      case "db:upsert-instance":
        return db.upsertInstance(data);
      case "settings:set":
        return db.setSetting(data.key, data.value);
      case "settings:all":
        return db.getSettingAll();
      default:
        throw new Error(`${event} is not defined event.`);
    }
  });

  mainWindow.on("resize", () => {
    const [width, height] = mainWindow?.getSize() || [0, 0];
    db.setSetting("windowSize", { width, height });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });

  powerMonitor.on("resume", () => {
    mainWindow?.webContents.send("resume-timeline");
  });

  initialize();
  console.log("initialized");
};

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("activate", async () => {
  if (mainWindow === null) {
    start();
  }
  const hazyMode = (await db.getSetting("hazyMode")) as Settings["hazyMode"];
  if (hazyMode === "haze" || hazyMode === "hide") {
    setMainWindowMode("show");
    mainWindow?.webContents.send("set-hazy-mode", { mode: "show" });
  }
});

app.on("window-all-closed", () => {
  if (isMac) {
    console.log("quit");
    app.quit();
  }
});

if (DEBUG) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

app.whenReady().then(start);
