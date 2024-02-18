const fs = require("fs");
const { app, clipboard } = require('electron');
const path = require("path");
const {execSync} = require('child_process');
const {shell} = require("electron");
const sharp = require('sharp');
const toIco = require('to-ico');
const {exec} = require('child_process');
const isMac = process.platform === 'darwin'
var files = [];
var checkedData = [];

// accept=".png, .webp .jpeg .jpg .gif .tiff .avif"
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
  files = files.filter((ele) => {
    return ele.type !== ""
  });
  if (isMac && files.length === 1) {
    $("#getBase64").show();
  } else {
    $("#getBase64").hide();
  }
  if (isMac && files.length === 1 && files[0].type === "image/png") {
    $("#icnsItem").show();
  } else {
    $("#icnsItem").hide();
  }
});
$(document).on("click", '#getBase64', function (e) {
  const pngData = fs.readFileSync(files[0].path);
  // 将PNG数据转换为Base64编码
  const base64Data = pngData.toString('base64');
  clipboard.writeText(base64Data);
  console.log('Base64 encoded image:', base64Data);
});
$(document).on("click", '#export', function (e) {
  checkedData = []
  if (files.length > 0) {
    $("input[type='checkbox']").each((i, ele) => {
      if ($(ele).prop('checked')) {
        checkedData.push($(ele).val());
      }
    });
    Convert();
  }
});

function writeFile(targetPath, buffer) {
  fs.writeFile(targetPath, buffer, function (e) {
    console.log(`Image has been ${targetPath}`);
  });
}

function generateFavicon(sourcePath, destPath) {
  const image = fs.readFileSync(sourcePath);

  toIco([image], {
    sizes: [16, 24, 32, 48, 64, 128, 256],
    resize: true
  }).then(result => {
    fs.writeFileSync(destPath, result);
    console.log(`Image has been ${destPath}`);
  });
}

const tempDir = 'temp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// 调整大小的图像尺寸
const sizes = [16, 32, 64, 128, 256, 512];

// 调整大小的函数
async function resizeImage(inputPath, size, outputPath) {
  await sharp(inputPath)
    .resize(size, size)
    .toFile(outputPath);
}
function Convert() {
  if (checkedData.length === 0) return;
  if (files.length === 0) return;
  files.forEach((ele, i) => {
    let fileDirname = path.dirname(ele.path);
    let extension = path.extname(ele.path);
    let file = path.basename(ele.path, extension);
    checkedData.forEach((checkEle) => {
      let targetPath = path.join(fileDirname, `${file}.${checkEle}`);
      console.log(checkEle);
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
          generateFavicon(ele.path, targetPath)
          break;
        case "icns":
          console.log(__dirname)
          const iconsetFolderPath = path.join(fileDirname, 'icons.iconset');
          try {
            // 执行每个命令
            execSync(`mkdir ${iconsetFolderPath}`);
            execSync(`sips -z 16 16 ${ele.path} -o ${iconsetFolderPath}/icon_16x16.png`);
            execSync(`sips -z 32 32 ${ele.path} -o ${iconsetFolderPath}/icon_16x16@2x.png`);
            execSync(`sips -z 32 32 ${ele.path} -o ${iconsetFolderPath}/icon_32x32.png`);
            execSync(`sips -z 64 64 ${ele.path} -o ${iconsetFolderPath}/icon_32x32@2x.png`);
            execSync(`sips -z 128 128 ${ele.path} -o ${iconsetFolderPath}/icon_128x128.png`);
            execSync(`sips -z 256 256 ${ele.path} -o ${iconsetFolderPath}/icon_128x128@2x.png`);
            execSync(`sips -z 256 256 ${ele.path} -o ${iconsetFolderPath}/icon_256x256.png`);
            execSync(`sips -z 512 512 ${ele.path} -o ${iconsetFolderPath}/icon_256x256@2x.png`);
            execSync(`sips -z 512 512 ${ele.path} -o ${iconsetFolderPath}/icon_512x512.png`);
            execSync(`sips -z 1024 1024 ${ele.path} -o ${iconsetFolderPath}/icon_512x512@2x.png`);
            execSync(`iconutil -c icns ${iconsetFolderPath} -o ${targetPath}`);
            execSync(`rm -r ${iconsetFolderPath}`);

            console.log('All commands executed successfully');
          } catch (error) {
            console.error(`Error executing command: ${error.message}`);
          }

          break;
      }
    })
    if (i === 0) {
      openFolder(fileDirname);
    }
  });

}

