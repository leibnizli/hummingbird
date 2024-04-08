import path from "path";
const fs = require("fs");
const {shell, ipcRenderer} = require('electron')
import "./index.css";
import {getUserHome} from "./util"

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
//drag
$(document).on({
  dragleave: function (e) {
    e.preventDefault();
  },
  drop: function (e) {
    e.preventDefault();
  },
  dragenter: function (e) {
    e.preventDefault();
  },
  dragover: function (e) {
    e.preventDefault();
  }
});
$(document).on("click", "#settings", function (e) {
  ipcRenderer.send('open-settings-window');
});
$(document).on("click", "#convert", function (e) {
  ipcRenderer.send('open-convert-window');
});
$(document).on("click", "#code", function (e) {
  ipcRenderer.send('open-code-window');
});
$(document).on("click", "#video", function (e) {
  ipcRenderer.send('open-video-window');
});
$(document).on("click", "#font", function (e) {
  ipcRenderer.send('open-font-window');
});
$(document).on("click", "#log", function (e) {
  shell.openPath(logPath)
});
$(document).on("click", "#issues", function (e) {
  shell.openExternal("https://github.com/leibnizli/hummingbird/issues");
});
window.shareCount = window.shareSize = 0;
ipcRenderer.on('mainWindow-share', function (e, count, size) {
  window.shareCount = count;
  window.shareSize = size;
});
$(document).on("click", "#share", function (e) {
  shell.openExternal(`http://twitter.com/share?text=Hummingbird App has helped me process pictures ${window.shareCount} times and compressed the space to ${(window.shareSize / (1024 * 1024)).toFixed(4)}M&url=https://github.com/leibnizli/hummingbird`);
});
$(document).on("click", "#minimized", function (e) {
  ipcRenderer.send('main-minimized');
});
$(document).on("click", "#close", function (e) {
  ipcRenderer.send('close-main-window');
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
        $("#ui-app").css({
          "border": "solid 1px #7d95ad"
        });
      }
    } else {
      console.log("Not running on Windows");
    }
  });
require("./app.js");

