import electron, { app, dialog } from "electron";

type MenuTemplate = (electron.MenuItemConstructorOptions | electron.MenuItem)[];

const menuTemplate = ({ mainWindow }: { mainWindow: electron.BrowserWindow | null }): MenuTemplate => [
  // @ts-ignore: appMenu is not defined in d.ts
  {
    label: "hazy",
    submenu: [
      {
        label: "About Hazy",
        click: () => {
          dialog.showMessageBox({
            type: "info",
            icon: `${__dirname}/../public/icons/png/128x128.png`,
            title: "Hazy",
            message: `Hazy`,
            detail: `Version: ${app.getVersion()}\n\nhttps://github.com/nekobato/hazy/`,
          });
        },
      },
      {
        type: "separator",
      },
      {
        id: "reload",
        label: "Reload Timeline",
        click: () => {
          mainWindow?.webContents.reload();
        },
      },
      {
        type: "separator",
      },
      {
        id: "quit",
        label: "Quit Hazy",
        role: "quit",
      },
    ],
  },
  {
    label: "Edit",
    role: "editMenu",
  },
  // @ts-ignore: viewMenu is not defined in d.ts
  {
    label: "View",
    role: "viewMenu",
  },
];

export default menuTemplate;
