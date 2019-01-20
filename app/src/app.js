const fs = require("fs");
const path = require('path');

const {ipcRenderer} = require('electron');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');

const Pie = require("./components/pie/index.js");
let jpgValue, webpValue, backup;

ipcRenderer.on('quality', function (e, arg1, arg2) {
    jpgValue = arg1;
    webpValue = arg2;
});
ipcRenderer.on('backup', function (e, arg1) {
    backup = arg1;
});

function App(el, options) {
    this.$el = $(el);
    this.options = options;
    this.status = "waiting";
    this.filesArray = [];
    this.diff = 0;
    this.Timer=null;
    this.statusHtml = {
        waiting: '<div class="ui-area-tip ui-area-waiting"></div>',
        drop: '<div class="pie" id="pie">\
            <div class="pie-progress">\
                <div class="pie-progress-fill"></div>\
            </div>\
        </div>\
        <p class="ui-area-tip ui-area-progress pie-percent"></p>'
    }
    this._init();
}

App.prototype = {
    _init: function () {
        this._updateState();
        this.$el.find(".ui-area-waiting").html("将图形文件拖放至此");
        this.$el.on("dragenter", ".ui-area-drop", (e) => {
            e.preventDefault();
            $(e.target).addClass("ui-area-drop-have");
            this.$el.find(".ui-area-waiting").html("松开鼠标,就开始处理了");
        });
        this.$el.on("dragleave", ".ui-area-drop", (e) => {
            e.preventDefault();
            $(e.target).removeClass("ui-area-drop-have");
            this.$el.find(".ui-area-waiting").html("将图形文件拖放至此");
        });
        this.$el.on("drop", ".ui-area-drop", (e) => {
            $(e.target).removeClass("ui-area-drop-have");
            this.filesArray = [];
            this.diff = 0;
            this._filterFiles(e.originalEvent.dataTransfer);


        });
    },
    _filterFiles: function (dataTransfer) {
        const items = dataTransfer.items;
        if (items.length === 0) {
            this.$el.find(".ui-area-waiting").html("将图形文件拖放至此");
            return false;
        }
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry();
            if (entry) {
                this._traverseFileTree(entry);
            }
        }
    },
    _traverseFileTree: function (item, path) {
        path = path || "";
        if (item.isFile) {
            // Get file
            item.file((file) => {
                if (!this.time) {
                    this.time = Date.now();
                }
                clearTimeout(this.Timer);
                this.Timer = setTimeout(() => {
                    this.status = "drop";
                    this._updateState();
                    this._delFiles(this.filesArray);
                },100);
                this.time = Date.now();
                if (file.type.indexOf("image") > -1 || file.type.indexOf("css") > -1 || file.type.indexOf("javascript") > -1 || file.type.indexOf("html") > -1) {
                    this.filesArray.push({
                        size: file.size,
                        name: file.name,
                        path: file.path,
                        type: file.type
                    });
                }
            });
        } else if (item.isDirectory) {
            // Get folder contents
            const dirReader = item.createReader();
            dirReader.readEntries((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    this._traverseFileTree(entries[i], path + item.name + "/");
                }
            });
        }
    },
    _delFiles: function () {
        let pie = new Pie(),
            index = 0,
            self = this,
            len = this.filesArray.length;
        pie.set(0);
        (function filesHandle() {
            const filePath = self.filesArray[index].path,
                fileDirname = path.dirname(filePath),
                fileBasename = path.basename(filePath),
                fileSourcePath = path.join(fileDirname, 'source', fileBasename);
            //writeFile
            if (backup) {
                //mkdir
                self._mkdirSync(path.join(fileDirname, 'source'));
                if (self.filesArray[index].type.indexOf("image") > -1) {
                    !fs.existsSync(fileSourcePath) && fs.writeFileSync(fileSourcePath, fs.readFileSync(filePath));
                } else {
                    fs.writeFileSync(fileSourcePath, fs.readFileSync(filePath));
                }
            }


            switch (self.filesArray[index].type) {

                case "image/svg+xml":
                    imagemin([filePath], fileDirname, {
                        plugins: [
                            imageminSvgo({})
                        ]
                    }).then(files => {
                        runSucceed(files);
                    }, err => {
                        runSkip(err)
                    });
                    break;
                case "image/jpeg":
                    imagemin([filePath], fileDirname, {
                        plugins: [
                            imageminJpegtran({progressive: true}),
                            imageminMozjpeg({
                                tune: 'psnr',
                                quality: jpgValue || 85
                            })
                        ]
                    }).then(files => {
                        runSucceed(files);
                    }, err => {
                        runSkip(err)
                    });
                    break;
                case "image/png":
                    imagemin([filePath], fileDirname, {
                        plugins: [
                            imageminOptipng({optimizationLevel: 2}),
                            imageminPngquant({quality: '65-85', speed: 3})
                        ]
                    }).then(files => {
                        runSucceed(files);
                    }, err => {
                        runSkip(err)
                    });
                    break;
                case "image/gif":
                    imagemin([filePath], fileDirname, {
                        plugins: [imageminGifsicle()]
                    }).then(files => {
                        runSucceed(files);
                    }, err => {
                        runSkip(err)
                    });
                    break;
                case "image/webp":
                    imagemin([filePath], fileDirname, {
                        plugins: [
                            imageminWebp({quality: webpValue || 85})
                        ]
                    }).then(files => {
                        runSucceed(files);
                    }, err => {
                        runSkip(err)
                    });
                    break;
                case "text/css":
                    gulp.src(filePath).pipe(cleanCSS({compatibility: 'ie8'})).pipe(rename({suffix: '.min'})).pipe(gulp.dest(fileDirname)).on('end', function () {
                        runSucceed()
                    });
                    break;
                //case "text/javascript":
                case "text/javascript":
                    gulp.src(filePath).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest(fileDirname)).on('end', function () {
                        runSucceed()
                    });
                    break;
                case "text/html":
                    gulp.src(filePath).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest(fileDirname)).on('end', function () {
                        runSucceed()
                    });
                    break;
            }

            function runSucceed(files) {
                if (files) {
                    self.filesArray[index].optimized = files[0].data.length;
                } else {
                    self.filesArray[index].optimized = Math.floor(self.filesArray[index].size / 2);
                }
                //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
                index++;
                pie.set(((index / len) * 100).toFixed(0));
                if (index >= len) {
                    self._dropOver(len, files);
                    return;
                }
                filesHandle();
            }

            function runSkip(err) {
                self.filesArray[index].optimized = self.filesArray[index].size;
                index++;
                pie.set(((index / len) * 100).toFixed(0));
                if (index >= len) {
                    self._dropOver(len);
                    return;
                }
                filesHandle();
            }
        })();
    },
    _dropOver: function (num, files) {
        this.status = "waiting";
        this._updateState();
        this.filesArray.forEach(function (file) {
            this.diff += file.size - file.optimized;
        }.bind(this));
        this.$el.find(".ui-area-waiting").html("已处理" + num + "个文件,压缩空间" + (this.diff / (1024)).toFixed(1) + 'KB');
        localStorage.setItem("count", window.shareCount + 1);
        localStorage.setItem("size", window.shareSize + 1);
        ipcRenderer.send('set-share', window.shareCount + 1, window.shareSize + this.diff);
    },
    _mkdirSync: function (path) {
        try {
            fs.mkdirSync(path)
        } catch (e) {
            if (e.code != 'EEXIST') throw e;
        }
    },
    _updateState: function () {
        this.$el.find(".ui-area-main").html(this.statusHtml[this.status]);
    }
}
module.exports = App;
