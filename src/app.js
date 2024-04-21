import i18n from 'i18n';
import {getUserHome} from "./util";
import configuration from "../configuration";

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const fs = require("fs");
const path = require('path');
const {ipcRenderer} = require('electron');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminWebp = require('imagemin-webp');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');
const mime = require('mime');
// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

let appPath = "";
const lang = navigator.language
ipcRenderer.on('appPath', (event, p) => {
  appPath = p
  console.log(`App path: ${appPath}`)
  /* i18n config */
  i18n.configure({
    updateFiles: false,
    locales: ['en-US', 'zh-CN'],
    directory: path.join(appPath, 'locales'),
    defaultLocale: /zh/.test(lang) ? 'zh-CN' : 'en-US'
  });
  new App("#ui-app");
});
console.log(__dirname + '/locales')
const Pie = require("./components/pie");
let jpgValue, webpValue, backup, maxWidth = configuration.get('maxWidth') || 0,
  maxHeight = configuration.get('maxHeight') || 0;
let maxHeightVideo = configuration.get('maxHeightVideo') || 0;

ipcRenderer.on('quality', function (e, arg1, arg2) {
  jpgValue = arg1;
  webpValue = arg2;
});
ipcRenderer.on('backup', function (e, arg1) {
  backup = arg1;
});

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
ipcRenderer.on('maxHeightVideo', function (e, arg1) {
  maxHeightVideo = arg1;
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
    waiting: '<div class="ui-area-icon"><img width="60" src="data:image/svg+xml,%3Csvg viewBox=\'0 0 1024 1024\' xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cpath fill=\'%2340648a60\' d=\'M481.28 715.947a32 32 0 0022.613 9.386h16.214a32.853 32.853 0 0022.613-9.386L761.6 496.64a21.333 21.333 0 000-30.293l-30.293-30.294a20.907 20.907 0 00-29.867 0l-146.773 147.2v-433.92A21.333 21.333 0 00533.333 128h-42.666a21.333 21.333 0 00-21.334 21.333v433.92l-146.773-147.2a21.333 21.333 0 00-30.293 0L262.4 466.347a21.333 21.333 0 000 30.293zM512 625.92zm384 184.747V661.333A21.333 21.333 0 00874.667 640H832a21.333 21.333 0 00-21.333 21.333v149.334H213.333V661.333A21.333 21.333 0 00192 640h-42.667A21.333 21.333 0 00128 661.333v149.334A85.333 85.333 0 00213.333 896h597.334A85.333 85.333 0 00896 810.667z\'/%3E%3C/svg%3E"></div><div class="ui-area-tip ui-area-waiting"></div>',
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
    this.$el.find(".ui-area-waiting").html(i18n.__('waiting'));
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
      this.$el.find(".ui-area-waiting").html(i18n.__('dragenter'));
    });
    this.$el.on("dragleave", ".ui-area-drop", (e) => {
      e.preventDefault();
      $(e.target).removeClass("ui-area-drop-have");
      this.$el.find(".ui-area-waiting").html(i18n.__('waiting'));
    });
    this.$el.on("drop", ".ui-area-drop", (e) => {
      $(e.target).removeClass("ui-area-drop-have");
      this.filesArray = [];
      this.diff = 0;
      this._filterFiles(e.originalEvent.dataTransfer.items);
    });
  },
  _filterFiles: function (items) {
    if (items.length === 0) {
      this.$el.find(".ui-area-waiting").html(i18n.__('waiting'));
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
  _traverseFileTree: function (item) {
    const self = this;
    if (item.isFile) {
      // Get file
      item.file((file) => {
        // console.log('file',file)
        clearTimeout(this.Timer);
        this.Timer = setTimeout(() => {
          if (this.filesArray.length > 0) {
            this.status = "drop";
            this._updateState();
            this._delFiles(this.filesArray);
          } else {
            this.$el.find(".ui-area-waiting").html(i18n.__('waiting'));
          }
        }, 100);
        if (file.type.indexOf("image") > -1 || file.type.indexOf("css") > -1 || file.type.indexOf("javascript") > -1 || file.type.indexOf("html") > -1 || file.type.indexOf("mp4") > -1) {
          this.filesArray.push({
            size: file.size,
            name: file.name,
            path: file.path,
            type: file.type
          });
        }
        if (file.path.match(/\.(mov)$/)) {
          this.filesArray.push({
            size: file.size,
            name: file.name,
            path: file.path,
            type: 'video/mov'
          });
        }
      });
    } else if (item.isDirectory) {
      // Get folder contents
      const dirReader = item.createReader();
      const readEntries = function () {
        dirReader.readEntries(function (entries) {
          if (entries.length) {
            for (let i = 0; i < entries.length; i++) {
              self._traverseFileTree(entries[i]);
            }
            readEntries();
          }
        });
      };
      readEntries();
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
      const filePath = self.filesArray[i].path;
      const fileDirname = path.dirname(filePath);
      const fileBasename = path.basename(filePath);
      const extension = path.extname(filePath);
      const fileSourcePath = path.join(fileDirname, 'source', fileBasename);

      const name = path.basename(filePath, `${extension}`);
      const targetPath = path.join(fileDirname, `${name}.min${extension}`);
      const options = [];
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
          self._sharp(filePath).finally(() => {
            sharp(filePath).jpeg({
              mozjpeg: true,
              progressive: true,
              quality: jpgValue || 80
            })
              .toBuffer(function (err, buffer) {
                if (err) {
                  runSkip(i, err)
                }
                fs.writeFile(filePath, buffer, function (e) {
                  runSucceed(i, [{data: buffer}], "img");
                });
              });
          });
          break;
        case "image/png":
          self._sharp(filePath).finally(
            () => {
              imagemin([filePath], fileDirname, {
                plugins: [
                  imageminOptipng({optimizationLevel: 2}),//OptiPNG 无损压缩算法
                  imageminPngquant({
                    quality: [0.6, 0.85],
                  })//Pngquant 有损压缩算法
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
        case "video/mp4":
          options.push('-crf 28');
          if (maxHeightVideo > 0) {
            options.push(`-vf scale=-2:${maxHeightVideo}`);
          }
          ffmpeg().input(filePath).fps(30).outputOptions(options).on('progress', (progress) => {
            if (progress.percent) {
              pie.set(((p / len) * 100 + 1 / len * progress.percent).toFixed(0));
            }
          }).saveToFile(targetPath).on('end', () => {
            console.log('FFmpeg has finished.');
            runSucceed(i, [
              {size: getFilesizeInBytes(targetPath)}
            ],);
          }).on('error', (error) => {
            runSkip(i, error)
          });
          break;
        case "video/mov":
          options.push('-crf 28');
          options.push('-c:v libx264');
          options.push('-c:a copy');
          if (maxHeightVideo > 0) {
            options.push(`-vf scale=-2:${maxHeightVideo}`);
          }
          ffmpeg().input(filePath).fps(30).outputOptions(options).on('progress', (progress) => {
            if (progress.percent) {
              pie.set(((p / len) * 100 + 1 / len * progress.percent).toFixed(0));
            }
          }).saveToFile(targetPath).on('end', () => {
            console.log('FFmpeg has finished.');
            runSucceed(i, [
              {size: getFilesizeInBytes(targetPath)}
            ],);
          }).on('error', (error) => {
            runSkip(i, error)
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
      const fileDiff = file.size - file.optimized;
      log += `${file.time} ${file.name} ${file.size}B - ${file.optimized}B = ${fileDiff}B ${this.skip ? "skip" : ""} \n`
    }.bind(this));
    this.$el.find(".ui-area-waiting").html(`${num} ${i18n.__('after')} ${(this.diff / (1024)).toFixed(3)}KB`);
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
