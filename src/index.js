const fs = require("fs");
const {shell,ipcRenderer} = require('electron')
import "./index.css";
import {getUserHome} from "./util"
//drag
$(document).on({
    dragleave: function(e) {
        e.preventDefault();
    },
    drop: function(e) {
        e.preventDefault();
    },
    dragenter: function(e) {
        e.preventDefault();
    },
    dragover: function(e) {
        e.preventDefault();
    }
});
$(document).on("click", "#settings", function(e) {
    ipcRenderer.send('open-settings-window');
});
$(document).on("click", "#log", function(e) {
  shell.openPath(`${getUserHome()}/hummingbird-log.txt`)
});
$(document).on("click", "#issues", function(e) {
    shell.openExternal("https://github.com/leibnizli/hummingbird/issues");
});
window.shareCount = window.shareSize = 0;
ipcRenderer.on('mainWindow-share', function(e, count, size) {
    window.shareCount = count;
    window.shareSize = size;
});
$(document).on("click", "#share", function(e) {
    shell.openExternal(`http://twitter.com/share?text=Hummingbird App has helped me process pictures ${window.shareCount} times and compressed the space to ${(window.shareSize / (1024 * 1024)).toFixed(4)}M&url=https://github.com/leibnizli/hummingbird`);
});
$(document).on("click", "#minimized", function(e) {
    ipcRenderer.send('main-minimized');
});
$(document).on("click", "#close", function(e) {
    ipcRenderer.send('close-main-window');
});
if (navigator.userAgent.indexOf("Windows") > -1) {
    $("#ui-app").css({
        "border": "solid 1px #7d95ad"
    })
}
const App = require("./app.js");
new App("#ui-app");
