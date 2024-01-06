import { autoUpdater } from "electron-updater";
import log from "electron-log";

export const checkUpdate = () => {
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-available", () => {
    log.info(process.pid, "Update available.");
  });
  autoUpdater.on("update-not-available", () => {
    log.info(process.pid, "Update not available.");
  });
  autoUpdater.on("error", (err) => {
    log.error(process.pid, err);
  });

  return autoUpdater;
};
