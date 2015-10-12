var app = require('app'); // 控制应用生命周期的模块。
var BrowserWindow = require('browser-window'); // 创建原生浏览器窗口的模块
var configuration = require("./configuration");
var ipc = require('ipc'),
    settingsWindow = null,
    mainWindow = null;

app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});
if (!configuration.get('jpg')) {
    configuration.set('jpg', 85);
}
if (!configuration.get('webp')) {
    configuration.set('webp', 85);
}
// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
    

    
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        icon: './src/images/icon.png',
        title: '蜂鸟',
        width: 320,
        height: 267,
        frame: false
    });

    // 加载应用的 index.html
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // 打开开发工具
    mainWindow.openDevTools();
    // 当 window 被关闭，这个事件会被发出
    mainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，通常会把多个 window 对象存放在一个数组里面，但这次不是。
        mainWindow = null;
    });
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('quality', configuration.get('jpg'),configuration.get('webp'));
    });
});

ipc.on('close-main-window', function () {
    app.quit();
});
ipc.on('main-minimized', function () {
    mainWindow.minimize();
});
ipc.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }
    settingsWindow = new BrowserWindow({
        icon: './src/images/icon.png',
        frame: true,
        title: '设置 - 蜂鸟',
        height: 254,
        resizable: false,
        width: 339
    });
    settingsWindow.loadUrl('file://' + __dirname + '/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
    //settingsWindow.openDevTools();

    settingsWindow.webContents.on('did-finish-load', function() {
        settingsWindow.webContents.send('settings-quality', configuration.get('jpg'),configuration.get('webp'));
    });
});
ipc.on('set-configuration', function (event, arg1,arg2) {
    configuration.set(arg1, arg2);
    mainWindow.webContents.send('quality', configuration.get('jpg'),configuration.get('webp'));
});