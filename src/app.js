var fs = require("fs");
var path = require('path');

var ipc = require('ipc');
var Imagemin = require('imagemin');
var ImageminPngquant = require('imagemin-pngquant');
var ImageminWebp = require('imagemin-webp');
var ImageminMozjpeg = require('imagemin-mozjpeg');
var Pie = require("./components/pie/index.js");
var jpgValue, webpValue;

ipc.on('quality', function(arg1, arg2) {
    jpgValue = arg1;
    webpValue= arg2;
});

function App(el,options) {
    this.$el = $(el);
    this.options = options;
    this.status = "waiting";
    this.filesArray = [];
    this.diff = 0;
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
    _init: function() {
        var self = this;
        self._updateState();
        self.$el.find(".ui-area-waiting").html("将图形文件拖放至此");
        this.$el.on("dragenter", ".ui-area-drop", function(e) {
            e.preventDefault();
            $(this).addClass("ui-area-drop-have");
            self.$el.find(".ui-area-waiting").html("松开鼠标,就开始处理了");
        });
        this.$el.on("dragleave", ".ui-area-drop", function(e) {
            e.preventDefault();
            $(this).removeClass("ui-area-drop-have");
            self.$el.find(".ui-area-waiting").html("将图形文件拖放至此");
        });
        this.$el.on("drop", ".ui-area-drop", function(e) {
            $(this).removeClass("ui-area-drop-have");
            self.filesArray = [];
            self.diff = 0;
            self._filterFiles(e.originalEvent.dataTransfer.files);
            if (self.filesArray.length <= 0) {
                self.$el.find(".ui-area-waiting").html("将图形文件拖放至此");
                return false;
            };
            self.status = "drop";
            self._updateState();
            self._delFiles(self.filesArray);
        });
    },
    _filterFiles: function(files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.indexOf("image") === -1) {
                continue;
            }
            this.filesArray.push({
                size: file.size,
                name: file.name,
                path: file.path,
                type: file.type
            });
        }
    },
    _delFiles: function() {
        var pie = new Pie(),
            index = 0,
            self = this,
            len = self.filesArray.length;
        pie.set(0);
        (function filesHandle() {
            var filePath = self.filesArray[index].path,
                fileDirname = path.dirname(filePath),
                fileBasename = path.basename(filePath),
                fileSourcePath = path.join(fileDirname, 'source', fileBasename);
            //mkdir
            self._mkdirSync(path.join(fileDirname, 'source'));
            //writeFile
            !fs.existsSync(fileSourcePath) && fs.writeFileSync(fileSourcePath, fs.readFileSync(filePath));
            var imagemin = new Imagemin().src(filePath).dest(fileDirname);
            switch (self.filesArray[index].type) {
                case "image/svg+xml":
                    imagemin.use(Imagemin.svgo());
                    break;
                case "image/jpeg":
                    imagemin.use(Imagemin.jpegtran({
                        progressive: true
                    }));
                    imagemin.use(ImageminMozjpeg({
                        tune: 'psnr',
                        quality: jpgValue || 85
                    }));
                    break;
                case "image/png":
                    imagemin.use(Imagemin.optipng({
                        optimizationLevel: 2
                    })).use(ImageminPngquant({
                        quality: '65-85',
                        speed: 3
                    }));
                    break;
                case "image/gif":
                    imagemin.use(Imagemin.gifsicle());
                    break;
                case "image/webp":
                    imagemin.use(ImageminWebp({
                        quality: webpValue || 85
                    }));
                    break;
            }
            imagemin.run(function(err, data) {
                self.filesArray[index].optimized = data[0]._contents.length;
                index++;
                pie.set(((index / len) * 100).toFixed(0));
                if (index >= len) {
                    self._dropOver(len);
                    return;
                };
                filesHandle();
            });
        })();
    },
    _dropOver: function(amount) {
        this.status = "waiting";
        this._updateState();
        this.filesArray.forEach(function(file) {
            this.diff += file.size - file.optimized;
        }.bind(this));
        this.$el.find(".ui-area-waiting").html("已处理" + amount + "个文件,压缩空间" + (this.diff / (1024)).toFixed(1) + 'KB');
    },
    _mkdirSync: function(path) {
        try {
            fs.mkdirSync(path)
        } catch (e) {
            if (e.code != 'EEXIST') throw e;
        }
    },
    _updateState: function() {
        this.$el.find(".ui-area-main").html(this.statusHtml[this.status]);
    }
}
module.exports = App;