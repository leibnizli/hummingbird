import i18n from 'i18n';
import {getUserHome} from "./util"
import configuration from "../configuration";
const sharp = require('sharp');
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
const mime = require('mime');

/* i18n config */
const lang = navigator.language
i18n.configure({
  updateFiles: false,
  locales: ['en-US', 'zh-CN'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: /zh/.test(lang) ? 'zh-CN' : 'en-US'
});

const Pie = require("./components/pie");
let jpgValue, webpValue, backup, maxWidth = configuration.get('maxWidth') || 0,
  maxHeight = configuration.get('maxHeight') || 0;

ipcRenderer.on('quality', function (e, arg1, arg2) {
  jpgValue = arg1;
  webpValue = arg2;
});
ipcRenderer.on('backup', function (e, arg1) {
  backup = arg1;
});

let tip = ""

function setTip() {
  let $tip = $("#tip");
  $tip.html('');
  if (maxWidth > 0) {
    $tip.html(`maxWidth:${maxWidth}`)
  }
  if (maxHeight > 0) {
    $tip.html(`maxHeight:${maxHeight}`)
  }
  if (maxWidth > 0 && maxHeight > 0) {
    $tip.html(`maxWidth:${maxWidth} maxHeight:${maxHeight}`)
  }
}

setTip()
ipcRenderer.on('maxWidth', function (e, arg1) {
  maxWidth = arg1;
  setTip()
});
ipcRenderer.on('maxHeight', function (e, arg1) {
  maxHeight = arg1;
  setTip()
});

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  return stats.size;
}

function App(el, options) {
  this.$el = $(el);
  this.options = options;
  this.status = "waiting";
  this.filesArray = [];
  this.diff = 0;
  this.Timer = null;
  this.statusHtml = {
    waiting: '<div class="ui-area-icon"><img width="40" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KICA8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgogIDxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiAgIHg9IjAiIHk9IjAiICAgd2lkdGg9IjEwMHB4IiBoZWlnaHQ9IjEwMHB4IiAgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+CiAgPHBhdGggZmlsbD0iIzhCQTBCNyIgIGQ9Ik0yOTcgMzU2TDI5NyAzNTZRMjY4IDM1NiAyNjAgMzQwLjUgMjUyIDMyNSAyNzEgMzAxTDI3MSAzMDEgMzE4IDIzOSAzOTIgMTM5IDQxMCAxMTQgNDIwIDEwMlE0MjQgOTYgNDI5IDkwTDQyOSA5MFE0NTYgNTMgNDc3IDI3TDQ3NyAyN1E0ODYgMTQgNDk1LjUgOCA1MDUgMiA1MTMgMUw1MTMgMVE1MzEgMCA1NTEgMjQgNTcxIDQ4IDU5NyA4MiA2MjMgMTE2IDY1MCAxNTRMNjUwIDE1NCA2NzggMTkxUTY5MSAyMTAgNzA1IDIyOEw3MDUgMjI4UTcwOSAyMzQgNzE0IDIzOUw3MTQgMjM5IDcyMiAyNTAgNzMwIDI2MiA3NTMgMjkwUTc3NiAzMTkgNzcxIDMzOCA3NjYgMzU3IDczNiAzNTZMNzM2IDM1NlE3MTggMzU2IDY4OS41IDM1NyA2NjEgMzU4IDY0MiAzNThMNjQyIDM1OFE2MjEgMzU5IDYxNiAzNzEgNjExIDM4MyA2MTEgNDA1TDYxMSA0MDUgNjEyIDYyNiA2MTEgNjQ4UTYwOSA2NjAgNjAzIDY2OS41IDU5NyA2NzkgNTg2IDY4NS41IDU3NSA2OTIgNTU2IDY5Mkw1NTYgNjkyIDUxNSA2OTJRNDk3IDY5MyA0NzEgNjkzTDQ3MSA2OTNRNDM2IDY5MyA0MjQgNjc2LjUgNDEyIDY2MCA0MTIgNjI0TDQxMiA2MjQgNDEyIDUzMVE0MTEgNTAzIDQxMSA0NzZMNDExIDQ3NiA0MTEgNDI2UTQxMSA0MTAgNDA5LjUgMzk3LjUgNDA4IDM4NSA0MDUgMzc1TDQwNSAzNzVRMzk4IDM1NyAzNzYgMzU4TDM3NiAzNThRMzYwIDM1OCAzMzcuNSAzNTcgMzE1IDM1NiAyOTcgMzU2Wk0xMDA3IDg5N0wxMDA3IDg5N1ExMDE0IDkyMiAxMDA1IDk0NkwxMDA1IDk0NlExMDAyIDk1MyA5OTcuNSA5NjAuNSA5OTMgOTY4IDk4OCA5NzQuNSA5ODMgOTgxIDk3NiA5ODZMOTc2IDk4NlE5NjcgOTk1IDk1NS41IDEwMDIgOTQ0IDEwMDkgOTMwIDEwMTQgOTE2IDEwMTkgOTAxIDEwMjEuNSA4ODYgMTAyNCA4NzEgMTAyNEw4NzEgMTAyNCAxNTMgMTAyNFExMTUgMTAyNCA4NS41IDEwMTAgNTYgOTk2IDM4LjUgOTc2IDIxIDk1NiAxNS41IDkzMi41IDEwIDkwOSAxNyA4OTBMMTcgODkwIDMwIDg1OVEzNSA4NDUgNDMgODI3TDQzIDgyNyA1OCA3OTIgOTkgNjk1IDIxOSA2OTUgMTc0IDgyOCA4NTYgODI4IDgxMCA2OTUgOTI2IDY5NSA5NjYgNzkyUTk3MyA4MTEgOTgxIDgyOUw5ODEgODI5IDk5NCA4NjEgMTAwNCA4ODZRMTAwNyA4OTYgMTAwNyA4OTdaTTEwMDcgODk3TDEwMDcgODk3WiIvPgogIDwvc3ZnPgo="></div><div class="ui-area-tip ui-area-waiting"></div>',
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
    this.$el.find(".ui-area-waiting").html(i18n.__('drop'));
    this.$el.on("click", "#import", (e) => {
      e.preventDefault();
      ipcRenderer.invoke('dialog:openMultiFileSelect').then((paths) => {
        if (paths === undefined) {
          return
        } // Dialog was cancelled
        this.filesArray = [];
        this.diff = 0;
        this.status = "drop";
        this._updateState();
        for (let p of paths) {
          const mime_type = mime.getType(p);
          this.filesArray.push({
            size: getFilesizeInBytes(p),
            name: path.basename(p),
            path: p,
            type: mime_type
          });
        }
        //console.log(this.filesArray);
        this._delFiles(this.filesArray);
      });
    });
    this.$el.on("dragenter", ".ui-area-drop", (e) => {
      e.preventDefault();
      $(e.target).addClass("ui-area-drop-have");
      this.$el.find(".ui-area-waiting").html("Release the mouse, and the process begins");
    });
    this.$el.on("dragleave", ".ui-area-drop", (e) => {
      e.preventDefault();
      $(e.target).removeClass("ui-area-drop-have");
      this.$el.find(".ui-area-waiting").html("Drop one or more files or directories");
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
      this.$el.find(".ui-area-waiting").html("Drop one or more files or directories");
      return false;
    }
    if (!this.time) {
      this.time = Date.now();
    }
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        this._traverseFileTree(entry);
      }
    }
  },
  _traverseFileTree: function (item, path) {
    if (item.isFile) {
      // Get file
      item.file((file) => {
        clearTimeout(this.Timer);
        this.Timer = setTimeout(() => {
          this.status = "drop";
          this._updateState();
          this._delFiles(this.filesArray);
        }, 100);
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
          this._traverseFileTree(entries[i]);
        }
      });
    }
  },
  _sharp: function (filePath) {
    return new Promise((resolve, reject) => {
      if (maxWidth > 0 && maxHeight < 1) {
        // Read input image metadata
        sharp(filePath)
          .metadata()
          .then(metadata => {
            // If image width exceeds target width, resize it proportionally
            if (metadata.width > maxWidth) {
              return sharp(filePath)
                .resize({width: Number(maxWidth)})
                .toBuffer(function (err, buffer) {
                  fs.writeFile(filePath, buffer, function (e) {
                    console.log('Image has been resized to width ' + maxWidth + ' pixels');
                    resolve()
                  });
                })
            } else {
              console.log('Image width does not exceed ' + maxWidth + ' pixels, no resizing needed');
              resolve()
            }
          })
          .catch(err => {
            console.error('Failed to read image metadata:', err);
            reject()
          });
      } else if (maxWidth < 1 && maxHeight > 0) {
        // Read input image metadata
        sharp(filePath)
          .metadata()
          .then(metadata => {
            // If image width exceeds target width, resize it proportionally
            if (metadata.height > maxHeight) {
              return sharp(filePath)
                .resize({height: Number(maxHeight)})
                .toBuffer(function (err, buffer) {
                  fs.writeFile(filePath, buffer, function (e) {
                    console.log('Image has been resized to height ' + maxHeight + ' pixels');
                    resolve()
                  });
                })
            } else {
              console.log('Image width does not exceed ' + maxHeight + ' pixels, no resizing needed');
              resolve()
            }
          })
          .catch(err => {
            console.error('Failed to read image metadata:', err);
            reject()
          });
      } else if (maxWidth > 0 && maxHeight > 0) {
        sharp(filePath)
          .metadata()
          .then(metadata => {
            // If image width exceeds target width, resize it proportionally
            if (metadata.width > maxWidth) {
              return sharp(filePath)
                .resize({width: Number(maxWidth)})
                .toBuffer(function (err, buffer) {
                  fs.writeFile(filePath, buffer, function (e) {
                    console.log('Image has been resized to width ' + maxWidth + ' pixels');
                    resolve()
                  });
                })
            } else {
              console.log('Image width does not exceed ' + maxHeight + ' pixels, no resizing needed');
              resolve()
            }
          })
          .catch(err => {
            console.error('Failed to read image metadata:', err);
            reject()
          });
      } else {
        resolve()
      }
    });
  },
  _delFiles: function () {
    let p = 0;
    let pie = new Pie(),
      index = 0,
      self = this,
      len = this.filesArray.length;
    pie.set(0);
    const obj = new Proxy({count: 0}, {
      get: function (target, propKey, receiver) {
        return Reflect.get(target, propKey, receiver);
      },
      set: function (target, propKey, value, receiver) {
        Reflect.set(target, propKey, value, receiver);
        if (target.count < 5) {
          filesHandle(index)
        }
      }
    });

    function filesHandle(i) {
      if (i + 1 > len) return;
      index++;
      const filePath = self.filesArray[i].path,
        fileDirname = path.dirname(filePath),
        fileBasename = path.basename(filePath),
        fileSourcePath = path.join(fileDirname, 'source', fileBasename);
      //writeFile
      if (backup) {
        //mkdir
        self._mkdirSync(path.join(fileDirname, 'source'));
        if (self.filesArray[i].type.indexOf("image") > -1) {
          !fs.existsSync(fileSourcePath) && fs.writeFileSync(fileSourcePath, fs.readFileSync(filePath));
        } else {
          fs.writeFileSync(fileSourcePath, fs.readFileSync(filePath));
        }
      }
      switch (self.filesArray[i].type) {
        case "image/svg+xml":
          imagemin([filePath], fileDirname, {
            plugins: [
              imageminSvgo({})
            ]
          }).then(files => {
            runSucceed(i, [
              {size: getFilesizeInBytes(filePath)}
            ]);
          }, err => {
            runSkip(i, err)
          });
          break;
        case "image/jpeg":
          self._sharp(filePath).finally(
            () => {
              imagemin([filePath], fileDirname, {
                plugins: [
                  imageminJpegtran({progressive: true}),
                  imageminMozjpeg({
                    tune: 'psnr',
                    quality: jpgValue || 85
                  })
                ]
              }).then(files => {
                runSucceed(i, files, "img");
              }, err => {
                runSkip(i, err)
              });
            }
          );
          break;
        case "image/png":
          self._sharp(filePath).finally(
            () => {
              imagemin([filePath], fileDirname, {
                plugins: [
                  imageminOptipng({optimizationLevel: 2}),//OptiPNG 无损压缩算法
                  imageminPngquant({quality: '65-85', speed: 3})//Pngquant 有损压缩算法
                ]
              }).then(files => {
                runSucceed(i, files, "img");
              }, err => {
                runSkip(i, err)
              });
            }
          );
          break;
        case "image/gif":
          self._sharp(filePath).finally(
            () => {
              imagemin([filePath], fileDirname, {
                plugins: [imageminGifsicle()]
              }).then(files => {
                runSucceed(i, files, "img");
              }, err => {
                runSkip(i, err)
              });
            }
          )

          break;
        case "image/webp":
          self._sharp(filePath).finally(
            () => {
              imagemin([filePath], fileDirname, {
                plugins: [
                  imageminWebp({quality: webpValue || 85})
                ]
              }).then(files => {
                runSucceed(i, files, "img");
              }, err => {
                runSkip(i, err)
              });
            }
          )

          break;
        case "text/css":
          gulp.src(filePath).pipe(cleanCSS({compatibility: 'ie8'})).pipe(rename({suffix: '.min'})).pipe(gulp.dest(fileDirname)).on('end', function () {
            runSucceed(i, [
              {
                size: getFilesizeInBytes(
                  `${path.dirname(filePath)}/${path.parse(filePath).name}.min${path.parse(filePath).ext}`
                )
              }
            ]);
          });
          break;
        //case "text/javascript":
        case "text/javascript":
          gulp.src(filePath).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest(fileDirname)).on('end', function () {
            runSucceed(i, [
              {
                size: getFilesizeInBytes(
                  `${path.dirname(filePath)}/${path.parse(filePath).name}.min${path.parse(filePath).ext}`
                )
              }
            ]);
          });
          break;
        case "text/html":
          gulp.src(filePath).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest(fileDirname)).on('end', function () {
            runSucceed(i, [
              {size: getFilesizeInBytes(filePath)}
            ]);
          });
          break;
        default:
          runSkip(i);
      }
      obj.count++;
    }

    function runSucceed(i, files, type) {
      self.filesArray[i].time = new Date().toString();
      if (type === "img") {
        if (files) {
          self.filesArray[i].optimized = files[0] ? files[0].data.length : self.filesArray[i].size;
        }
      } else {
        self.filesArray[i].optimized = files[0] ? files[0].size : self.filesArray[i].size;
      }
      p++;
      pie.set(((p / len) * 100).toFixed(0));
      obj.count--;
      if (p >= len) {
        self._dropOver(len);
      }
    }

    function runSkip(i, err) {
      self.filesArray[i].time = new Date().toString();
      console.log(i, err)
      self.filesArray[i].skip = true;
      self.filesArray[i].optimized = self.filesArray[i].size;
      p++;
      pie.set(((p / len) * 100).toFixed(0));
      obj.count--;
      if (p >= len) {
        self._dropOver(len);
      }
    }

    if (len > 0) {
      filesHandle(0)
    }
  },
  _dropOver: function (num) {
    this.status = "waiting";
    this._updateState();
    console.log(this.filesArray)
    let log = "";
    this.filesArray.forEach(function (file) {
      this.diff += file.size - file.optimized;
      log += `${file.time} ${file.name} ${file.size}B - ${file.optimized}B = ${this.diff}B ${this.skip ? "skip" : ""} \n`
    }.bind(this));
    this.$el.find(".ui-area-waiting").html(`${num} files have been processed and the compressed space is ${(this.diff / (1024)).toFixed(3)}KB`);
    localStorage.setItem("count", window.shareCount + 1);
    localStorage.setItem("size", window.shareSize + 1);
    ipcRenderer.send('set-share', window.shareCount + 1, window.shareSize + this.diff);

    const maxSizeInBytes = 1024 * 1024; // 1MB
    const logPath = path.join(getUserHome(), 'hummingbird-log.txt');
    fs.stat(logPath, (err, stats) => {
      if (err) {
        console.error("Error occurred while getting file stats:", err);
        return;
      }
      if (stats.size > maxSizeInBytes) {
        // File size exceeds 1MB, clear its content
        fs.truncate(logPath, 0, (truncateErr) => {
          if (truncateErr) {
            console.error("Error occurred while truncating file:", truncateErr);
            return;
          }
          console.log("File content cleared successfully.");
        });
      }
      fs.appendFile(logPath, log, err => {
        if (err) {
          console.error(err);
        } else {
          // done!
        }
      });
    });
  },
  _mkdirSync: function (path) {
    try {
      fs.mkdirSync(path)
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
  },
  _updateState: function () {
    this.$el.find(".ui-area-main").html(this.statusHtml[this.status]);
  }
}
module.exports = App;
