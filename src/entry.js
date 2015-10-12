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
$(document).on("click", ".ui-share", function(e) {
    //"http://service.weibo.com/share/share.php?url=蜂鸟https://github.com/stormtea123/hummingbird&ralateUid=1564456012&language=zh_cn&title= 已经帮我处理图片21次，压缩空间1G，好人一生平安&pic=https://www.baidu.com/img/bdlogo.png&searchPic=false&style=number"
    shell.openExternal("https://github.com/stormtea123/hummingbird");
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
