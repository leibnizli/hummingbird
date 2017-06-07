var fs = require("fs");
const {shell,ipcRenderer} = require('electron')
require("./lib/jquery.js");
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

$(document).on("click", ".ui-settings", function(e) {
    ipcRenderer.send('open-settings-window');
});
$(document).on("click", ".ui-issues", function(e) {
    shell.openExternal("https://github.com/stormtea123/hummingbird");
});
window.shareCount = window.shareSize = 0;
ipcRenderer.on('mainWindow-share', function(e, count, size) {
    window.shareCount = count;
    window.shareSize = size;
});
$(document).on("click", ".ui-share", function(e) {
    shell.openExternal('http://service.weibo.com/share/share.php?url=https://github.com/stormtea123/hummingbird&ralateUid=1564456012&language=zh_cn&title=蜂鸟客户端已经帮我处理图片' + window.shareCount + '次，压缩空间' + (window.shareSize / (1024 * 1024)).toFixed(4) + 'M，好人一生平安&pic=https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/hummingbird.jpg&searchPic=false&style=number');
});
$(document).on("click", ".ui-minimized", function(e) {
    ipcRenderer.send('main-minimized');
});
$(document).on("click", ".ui-close", function(e) {
    ipcRenderer.send('close-main-window');
});
if (navigator.userAgent.indexOf("Windows") > -1) {
    $("#ui-app").css({
        "border": "solid 1px #7d95ad"
    })
}
var App = require("./app.js");
new App("#ui-app");
//设置参数
require("./settings.js");