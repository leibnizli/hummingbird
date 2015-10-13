var fs = require("fs");
var shell = require('shell');
var ipc = require('ipc');
require("./lib/jquery.js");
// pie
require("./components/pie/style.css");
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
    ipc.send('open-settings-window');
});
$(document).on("click", ".ui-issues", function(e) {
    shell.openExternal("https://github.com/stormtea123/hummingbird");
});
window.shareCount = window.shareSize = 0;
ipc.on('mainWindow-share', function(count, size) {
    window.shareCount = count;
    window.shareSize = size;
});
$(document).on("click", ".ui-share", function(e) {
    shell.openExternal('http://service.weibo.com/share/share.php?url=https://github.com/stormtea123/hummingbird&ralateUid=1564456012&language=zh_cn&title=蜂鸟客户端已经帮我处理图片' + window.shareCount + '次，压缩空间' + (window.shareSize / (1024 * 1024)).toFixed(4) + 'M，好人一生平安&pic=https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/hummingbird.jpg&searchPic=false&style=number');
});
$(document).on("click", ".ui-minimized", function(e) {
    ipc.send('main-minimized');
});
$(document).on("click", ".ui-close", function(e) {
    ipc.send('close-main-window');
});
if (navigator.userAgent.indexOf("Windows") > -1) {
    $("#ui-app").css({
        "border": "solid 1px #7d95ad"
    })
}
var App = require("./app.js");
new App("#ui-app");
require("./settings.js");