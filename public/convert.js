const fs = require("fs");
const { app, clipboard } = require('electron');
const { webUtils } = require('electron')
const { promisify } = require('util');
const heicConvert = require('heic-convert');
const path = require("path");
const {execSync} = require('child_process');
const {shell} = require("electron");
const sharp = require('sharp');
const toIco = require('to-ico');
var files = [];
var checkedData = [];

function openFolder(path) {
  shell.openPath(path)
}

// 文件选择事件
const fileInput = document.getElementById('file');
if (fileInput) {
  fileInput.addEventListener('change', function(e) {
    console.log(this.files);
    const convertLog = document.getElementById('convertLog');
    if (convertLog) {
      convertLog.innerHTML = '';
    }
    files = Array.from(this.files).map((ele, i) => {
      return {
        path: webUtils.getPathForFile(ele),
        type: ele.type
      }
    });
    files = files.filter((ele) => {
      return ele.type !== ""
    });
  });
}

// 按钮点击事件处理
document.addEventListener('click', (e) => {
  const button = e.target.closest('[id]');
  if (!button) return;

  switch (button.id) {
    case 'export':
      checkedData = [];
      if (files.length > 0) {
        document.querySelectorAll("input[type='checkbox']").forEach((ele) => {
          if (ele.checked) {
            checkedData.push(ele.value);
          }
        });
        Convert();
      }
      break;
  }
});

function writeFile(targetPath, buffer) {
  fs.writeFile(targetPath, buffer, function (e) {
    console.log(`Image has been ${targetPath}`);
  });
}

function generateFavicon(sourcePath, destPath) {
  const image = fs.readFileSync(sourcePath);
  const convertLog = document.getElementById('convertLog');

  toIco([image], {
    sizes: [16, 24, 32, 48, 64, 128, 256],
    resize: true
  }).then(result => {
    fs.writeFileSync(destPath, result);
    console.log(`Image has been ${destPath}`);
  }).catch((err) => {
    if (convertLog) {
      convertLog.innerHTML = `${err}`;
    }
  });
}

function Convert() {
  if (checkedData.length === 0) return;
  if (files.length === 0) return;
  console.log(files,'files')
  const convertLog = document.getElementById('convertLog');

  files.forEach((ele, i) => {
    let fileDirname = path.dirname(ele.path);
    let extension = path.extname(ele.path);
    let file = path.basename(ele.path, extension);
    checkedData.forEach((checkEle) => {
      let targetPath = path.join(fileDirname, `${file}.${checkEle}`);
      console.log(checkEle);
      if (ele.type.indexOf(checkEle) > -1) return;
      if (ele.type === "image/heic") {
        switch (checkEle) {
          case "jpeg":
            (async () => {
              const inputBuffer = await promisify(fs.readFile)(ele.path);
              const outputBuffer = await heicConvert({
                buffer: inputBuffer, // the HEIC file buffer
                format: 'JPEG',      // output format
              });
              await promisify(fs.writeFile)(targetPath, outputBuffer);
            })();
            break;
          case "png":
            (async () => {
              const inputBuffer = await promisify(fs.readFile)(ele.path);
              const outputBuffer = await heicConvert({
                buffer: inputBuffer, // the HEIC file buffer
                format: 'PNG',      // output format
              });
              await promisify(fs.writeFile)(targetPath, outputBuffer);
            })();
            break;
          default:
            break;
        }
      } else {
        switch (checkEle) {
          case "jpeg":
            sharp(ele.path)
              .jpeg({
                quality: 100,
                chromaSubsampling: '4:4:4'
              })
              .toBuffer(function (err, buffer) {
                writeFile(targetPath, buffer);
              });
            break;
          case "png":
            sharp(ele.path)
              .png()
              .toBuffer(function (err, buffer) {
                writeFile(targetPath, buffer);
              });
            break;
          case "webp":
            sharp(ele.path)
              .webp({lossless: true})
              .toBuffer(function (err, buffer) {
                writeFile(targetPath, buffer);
              });
            break;
          case "gif":
            sharp(ele.path)
              .gif()
              .toBuffer(function (err, buffer) {
                writeFile(targetPath, buffer);
              });
            break;
          case "tiff":
            sharp(ele.path)
              .tiff({
                compression: 'lzw',
                bitdepth: 1
              })
              .toBuffer(function (err, buffer) {
                writeFile(targetPath, buffer);
              });
            break;
          case "avif":
            sharp(ele.path)
              .avif({effort: 2})
              .toBuffer(function (err, buffer) {
                writeFile(targetPath, buffer);
              });
            break;
          case "ico":
            if (ele.type === "image/png") {
              generateFavicon(ele.path, targetPath)
            }
            break;
          case "icns":
            if (ele.type === "image/png") {
              const iconsetFolderPath = path.join(fileDirname, 'icons.iconset');
              if (!fs.existsSync(iconsetFolderPath)) {
                fs.mkdirSync(iconsetFolderPath);
              }
              try {
                // 执行每个命令
                execSync(`sips -z 16 16 "${ele.path}" -o "${iconsetFolderPath}/icon_16x16.png"`);
                execSync(`sips -z 32 32 "${ele.path}" -o "${iconsetFolderPath}/icon_16x16@2x.png"`);
                execSync(`sips -z 32 32 "${ele.path}" -o "${iconsetFolderPath}/icon_32x32.png"`);
                execSync(`sips -z 64 64 "${ele.path}" -o "${iconsetFolderPath}/icon_32x32@2x.png"`);
                execSync(`sips -z 128 128 "${ele.path}" -o "${iconsetFolderPath}/icon_128x128.png"`);
                execSync(`sips -z 256 256 "${ele.path}" -o "${iconsetFolderPath}/icon_128x128@2x.png"`);
                execSync(`sips -z 256 256 "${ele.path}" -o "${iconsetFolderPath}/icon_256x256.png"`);
                execSync(`sips -z 512 512 "${ele.path}" -o "${iconsetFolderPath}/icon_256x256@2x.png"`);
                execSync(`sips -z 512 512 "${ele.path}" -o "${iconsetFolderPath}/icon_512x512.png"`);
                execSync(`sips -z 1024 1024 "${ele.path}" -o "${iconsetFolderPath}/icon_512x512@2x.png"`);
                execSync(`iconutil -c icns "${iconsetFolderPath}" -o "${targetPath}"`);
                execSync(`rm -r "${iconsetFolderPath}"`);

                console.log('All commands executed successfully');
              } catch (error) {
                if (convertLog) {
                  convertLog.innerHTML = `Error executing command: ${error.message}`;
                }
                console.error(`Error executing command: ${error.message}`);
              }
            }
            break;
          default:
            break;
        }
      }
    })
    if (i === 0) {
      openFolder(fileDirname);
    }
  });
}
