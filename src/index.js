import path from "path";
const fs = require("fs");
const {shell, ipcRenderer} = require('electron')
import "./index.css";
import {getUserHome} from "./util.js"

const logPath = path.join(getUserHome(), 'hummingbird-log.txt');
// 检测文件是否存在
fs.access(logPath, fs.constants.F_OK, (err) => {
  if (err) {
    // 如果文件不存在，则创建一个空文件
    fs.writeFile(logPath, '----log----\n', (err) => {
      if (err) {
        console.error('Error creating file:', err);
      } else {
        console.log('File created successfully.');
      }
    });
  } else {
    console.log('File already exists.');
  }
});

// 阻止默认的拖拽行为
document.addEventListener('dragleave', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());
document.addEventListener('dragenter', (e) => e.preventDefault());
document.addEventListener('dragover', (e) => e.preventDefault());

// 按钮点击事件
document.addEventListener('click', (e) => {
  // 获取最近的带有 id 的父元素
  const button = e.target.closest('[id]');
  if (!button) return; // 如果没有找到带 id 的元素，直接返回

  switch (button.id) {
    case 'settings':
      ipcRenderer.send('open-settings-window');
      break;
    case 'convert':
      ipcRenderer.send('open-convert-window');
      break;
    case 'code':
      ipcRenderer.send('open-code-window');
      break;
    case 'video':
      ipcRenderer.send('open-video-window');
      break;
    case 'audio':
      ipcRenderer.send('open-audio-window');
      break;
    case 'log':
      shell.openPath(logPath);
      break;
    case 'issues':
      shell.openExternal("https://github.com/leibnizli/hummingbird/issues");
      break;
    case 'share':
      // shell.openExternal(`http://twitter.com/share?text=Hummingbird App has helped me process pictures ${window.shareCount} times and compressed the space ${(window.shareSize / (1024 * 1024)).toFixed(4)}M&url=https://github.com/leibnizli/hummingbird`);
      break;
    case 'minimized':
      ipcRenderer.send('main-minimized');
      break;
    case 'close':
      ipcRenderer.send('close-main-window');
      break;
  }
});

window.shareCount = window.shareSize = 0;
ipcRenderer.on('share-data', function (e, count, size) {
  window.shareCount = count;
  window.shareSize = size;
});

navigator.userAgentData.getHighEntropyValues(["platformVersion"])
  .then(ua => {
    if (navigator.userAgentData.platform === "Windows") {
      const majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
      if (majorPlatformVersion >= 13) {
        console.log("Windows 11 or later");
      } else if (majorPlatformVersion > 0) {
        console.log("Windows 10");
      } else {
        console.log("Before Windows 10");
        const uiApp = document.getElementById('ui-app');
        if (uiApp) {
          uiApp.style.border = "solid 1px #7d95ad";
        }
      }
    } else {
      console.log("Not running on Windows");
    }
  });

require("./app.js");

