const {app, BrowserWindow, ipcMain, dialog, shell, Menu} = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path')
const log = require('electron-log');
const configuration = require("./configuration");
const express = require('express')
const server = express()
const port = 3373
// 指定静态文件目录
server.use(express.static('public'));

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const isMac = process.platform === 'darwin'

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let settingsWindow = null,
  mainWindow = null,
  convertWindow = null;
app.on('window-all-closed', function () {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
  }
  app.quit();
});
if (!configuration.get('jpg')) {
  configuration.set('jpg', 85);
}
if (!configuration.get('webp')) {
  configuration.set('webp', 85);
}
if (!configuration.get('count')) {
  configuration.set('count', 0);
}
if (!configuration.get('size')) {
  configuration.set('size', 0);
}
if (!configuration.get('backup')) {
  configuration.set('backup', false);
}
console.log('__dirname',__dirname,path.join(__dirname, 'locales'));
// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function () {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({
    icon: './src/images/icon.png',
    title: 'Hummingbird',
    width: 320,
    height: 267,
    frame: false,
    resizable: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  });
  let locate = "";
  if (app.getLocale() === "zh-CN") {
    locate = "-zh-CN";
  }
  // 加载应用的 index.html
  mainWindow.loadURL(`http://localhost:3373` + `/index${locate}.html`);
  // 打开开发工具
  // mainWindow.openDevToolss();
  // 当 window 被关闭，这个事件会被发出
  mainWindow.on('closed', function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，通常会把多个 window 对象存放在一个数组里面，但这次不是。
    mainWindow = null;
  });
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.send('quality', configuration.get('jpg'), configuration.get('webp'));
    mainWindow.webContents.send('mainWindow-share', configuration.get('count'), configuration.get('size'));
    mainWindow.webContents.send('backup', configuration.get('backup'));
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
});
ipcMain.on('close-main-window', function () {
  app.quit();
});
ipcMain.on('main-minimized', function () {
  mainWindow.minimize();
});
ipcMain.on('open-convert-window', function () {
  if (settingsWindow) {
    return;
  }
  convertWindow = new BrowserWindow({
    icon: './src/images/icon.png',
    title: 'Convert image format',
    width: 480,
    height: 340,
    frame: true,
    resizable: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  });
  let locate = "";
  if (app.getLocale() === "zh-CN") {
    locate = "-zh-CN";
  }
  // 加载应用的 index.html
  convertWindow.loadURL(`http://localhost:3373` + `/convert${locate}.html`);

  // 打开开发工具
  // process.env.NODE_ENV === "dev" && convertWindow.openDevTools();
  // 当 window 被关闭，这个事件会被发出
  convertWindow.on('closed', function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，通常会把多个 window 对象存放在一个数组里面，但这次不是。
    convertWindow = null;
  });
  convertWindow.webContents.on('did-finish-load', function () {
  });
});

ipcMain.on('open-settings-window', function () {
  console.log('app.getLocale()', app.getLocale());
  if (settingsWindow) {
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 360,
    height: 380,
    icon: './src/images/icon.png',
    frame: true,
    title: 'Settings',
    resizable: false,
    'auto-hide-menu-bar': true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  });
  let locate = "";
  if (app.getLocale() === "zh-CN") {
    locate = "-zh-CN";
  }
  settingsWindow.loadURL(`http://localhost:3373` + `/settings${locate}.html`);
  // 打开开发工具
  //settingsWindow.openDevTools();

  settingsWindow.on('closed', function () {
    settingsWindow = null;
  });
  // settingsWindow.openDevTools();

  settingsWindow.webContents.on('did-finish-load', function () {
    //
  });
});
ipcMain.on('set-quality', function (event, arg1, arg2) {
  configuration.set(arg1, arg2);
  mainWindow.webContents.send('quality', configuration.get('jpg'), configuration.get('webp'));
});
ipcMain.on('maxWidth', function (event, value) {
  configuration.set('maxWidth', value);
  mainWindow.webContents.send('maxWidth', value);
});
ipcMain.on('maxHeight', function (event, value) {
  configuration.set('maxHeight', value);
  mainWindow.webContents.send('maxHeight', value);
});
ipcMain.on('backup', function (event, value) {
  configuration.set('backup', value);
  mainWindow.webContents.send('backup', value);
});
ipcMain.on('set-share', function (event, count, size) {
  configuration.set('count', count);
  configuration.set('size', size);
  mainWindow.webContents.send('mainWindow-share', count, size);
});
ipcMain.handle('dialog:openMultiFileSelect', () => {
  let options = {
    properties: ['openFile', 'multiSelections']
  };
  return dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    .then((result) => {
      // Bail early if user cancelled dialog
      if (result.canceled) { return }
      return result.filePaths;
    })
})
ipcMain.on('app_version', (event) => {
  console.log(app.getVersion())
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }]
    : []),
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ]
        : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ]
        : [
          { role: 'close' }
        ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Report An Issue..',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/leibnizli/hummingbird/issues')
        }
      },
      {
        label: 'Website',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://arayofsunshine.dev/hummingbird')
        }
      },
      {
        label: 'Buy Me A Coffee',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://buy.arayofsunshine.dev')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
