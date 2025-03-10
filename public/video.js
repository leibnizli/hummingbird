const fs = require("fs");
const {clipboard} = require('electron');
const {shell} = require("electron");
const { webUtils } = require('electron')
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require("path");
// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);
var files = [];
let checkedData = [];
const status = document.getElementById('status');
const statusMP3 = document.getElementById('status-mp3');
const statusDelete = document.getElementById('status-delete');

function openFolder(path) {
  shell.openPath(path)
}

// 文件选择事件
const fileInput = document.getElementById('file');
if (fileInput) {
  fileInput.addEventListener('change', function(e) {
    console.log(this.files);
    files = Array.from(this.files).map((ele, i) => {
      return {
        path: webUtils.getPathForFile(ele),
        type: ele.type
      }
    });
  });
}

// 按钮点击事件处理
document.addEventListener('click', (e) => {
  const button = e.target.closest('[id]');
  if (!button) return;

  switch (button.id) {
    case 'mp3':
      if (files.length === 0) return;
      files.forEach((ele, i) => {
        let fileDirname = path.dirname(ele.path);
        let extension = path.extname(ele.path);
        let file = path.basename(ele.path, extension);
        let targetPath = path.join(fileDirname, `${file}.mp3`);
        ffmpeg()
          .input(ele.path)
          .outputOptions('-ab', '192k')
          .on('progress', (progress) => {
            if (progress.percent && statusMP3) {
              statusMP3.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
            }
          })
          .saveToFile(targetPath)
          .on('end', () => {
            if (statusMP3) {
              statusMP3.textContent = 'finished';
            }
            console.log('FFmpeg has finished.');
          })
          .on('error', (error) => {
            if (statusMP3) {
              statusMP3.textContent = 'error';
            }
          });
        if (i === 0) {
          openFolder(fileDirname);
        }
      });
      break;

    case 'delete':
      if (files.length === 0) return;
      files.forEach((ele, i) => {
        let fileDirname = path.dirname(ele.path);
        let extension = path.extname(ele.path);
        let file = path.basename(ele.path, extension);
        let targetPath = path.join(fileDirname, `${file}_no_audio.${extension}`);
        ffmpeg()
          .input(ele.path)
          .noAudio()
          .outputOptions('-codec', 'copy')
          .on('progress', (progress) => {
            if (progress.percent && statusDelete) {
              statusDelete.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
            }
          })
          .saveToFile(targetPath)
          .on('end', () => {
            if (statusDelete) {
              statusDelete.textContent = 'finished';
            }
            console.log('FFmpeg has finished.');
          })
          .on('error', (error) => {
            if (statusDelete) {
              statusDelete.textContent = 'error';
            }
          });
        if (i === 0) {
          openFolder(fileDirname);
        }
      });
      break;

    case 'export':
      checkedData = [];
      if (files.length > 0) {
        document.querySelectorAll("input[type='checkbox']").forEach((ele) => {
          if (ele.checked) {
            checkedData.push(ele.value);
          }
        });
        if (checkedData.length === 0) return;
        Convert();
      }
      break;
  }
});

function Convert() {
  files.forEach((ele, i) => {
    let fileDirname = path.dirname(ele.path);
    let extension = path.extname(ele.path);
    let file = path.basename(ele.path, extension);
    checkedData.forEach((checkEle) => {
      let targetPath = path.join(fileDirname, `${file}.${checkEle}`);
      console.log(checkEle);
      if (ele.type.indexOf(checkEle) > -1) return;
      switch (checkEle) {
        case "mp4":
          ffmpeg()
            .input(ele.path)
            .outputOptions('-vcodec', 'h264')
            .on('progress', (progress) => {
              if (progress.percent && status) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              if (status) {
                status.textContent = 'finished';
              }
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              if (status) {
                status.textContent = 'error';
              }
            });
          break;
        case "mov":
          ffmpeg()
            .input(ele.path)
            .on('progress', (progress) => {
              if (progress.percent && status) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              if (status) {
                status.textContent = 'finished';
              }
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              if (status) {
                status.textContent = 'error';
              }
            });
          break;
        case "avi":
          ffmpeg()
            .input(ele.path)
            .on('progress', (progress) => {
              if (progress.percent && status) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              if (status) {
                status.textContent = 'finished';
              }
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              if (status) {
                status.textContent = 'error';
              }
            });
          break;
        case "gif":
          ffmpeg()
            .input(ele.path)
            .on('progress', (progress) => {
              if (progress.percent && status) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              if (status) {
                status.textContent = 'finished';
              }
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              if (status) {
                status.textContent = 'error';
              }
            });
          break;
        default:
          break;
      }
    })
    if (i === 0) {
      openFolder(fileDirname);
    }
  });
}
