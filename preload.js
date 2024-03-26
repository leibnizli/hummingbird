const { contextBridge } = require('electron/renderer');
const { app } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});
contextBridge.exposeInMainWorld('appPath', app.getAppPath());
