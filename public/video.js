const fs = require("fs");
const {clipboard} = require('electron');
const {shell} = require("electron");
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

//image/vnd.microsoft.icon
//image/vnd.microsoft.icon
$(document).on("change", '#file', function (e) {
  console.log(this.files)
  files = Array.from(this.files).map((ele, i) => {
    return {
      path: ele.path,
      type: ele.type
    }
  });
});
$(document).on("click", '#mp3', function (e) {
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
        if (progress.percent) {
          statusMP3.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
        }
      })
      .saveToFile(targetPath)
      .on('end', () => {
        statusMP3.textContent = 'finished';
        console.log('FFmpeg has finished.');
      })
      .on('error', (error) => {
        statusMP3.textContent = 'error';
      });
    if (i === 0) {
      openFolder(fileDirname);
    }
  });
});
$(document).on("click", '#delete', function (e) {
  if (files.length === 0) return;
  files.forEach((ele, i) => {
    let fileDirname = path.dirname(ele.path);
    let extension = path.extname(ele.path);
    let file = path.basename(ele.path, extension);
    let targetPath = path.join(fileDirname, `${file}_no_audio.${extension}`);
    ffmpeg()
      .input(ele.path)
      // Tell FFmpeg to ignore the audio track
      .noAudio()
      // Copy the video without re-encoding
      .outputOptions('-codec', 'copy')
      .on('progress', (progress) => {
        if (progress.percent) {
          statusDelete.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
        }
      })
      .saveToFile(targetPath)
      .on('end', () => {
        statusDelete.textContent = 'finished';
        console.log('FFmpeg has finished.');
      })
      .on('error', (error) => {
        statusDelete.textContent = 'error';
      });
    if (i === 0) {
      openFolder(fileDirname);
    }
  });
});
// files = files.filter((ele)=>{
//   return ele.type === "video/mp4"
// });
$(document).on("click", '#export', function (e) {
  checkedData = [];
  if (files.length > 0) {
    $("input[type='checkbox']").each((i, ele) => {
      if ($(ele).prop('checked')) {
        checkedData.push($(ele).val());
      }
    });
    if (checkedData.length === 0) return;
    Convert();
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
              if (progress.percent) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              status.textContent = 'finished';
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              status.textContent = 'error';
            });
          break;
        case "mov":
          ffmpeg()
            .input(ele.path)
            // .outputOptions('-vcodec', 'h264')
            .on('progress', (progress) => {
              if (progress.percent) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              status.textContent = 'finished';
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              status.textContent = 'error';
            });
          break;
        case "avi":
          ffmpeg()
            .input(ele.path)
            // .outputOptions('-vcodec', 'h264')
            .on('progress', (progress) => {
              if (progress.percent) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              status.textContent = 'finished';
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              status.textContent = 'error';
            });
          break;
        case "gif":
          ffmpeg()
            .input(ele.path)
            .on('progress', (progress) => {
              if (progress.percent) {
                status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
              }
            })
            .saveToFile(targetPath)
            .on('end', () => {
              status.textContent = 'finished';
              console.log('FFmpeg has finished.');
            })
            .on('error', (error) => {
              status.textContent = 'error';
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
