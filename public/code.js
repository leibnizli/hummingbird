const fs = require("fs");
const { clipboard } = require('electron');
const {shell} = require("electron");
const { webUtils } = require('electron')
var files = [];

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
    case 'getBase64':
      if (files.length === 0) return;
      const pngData = fs.readFileSync(files[0].path);
      // 将PNG数据转换为Base64编码
      const base64Data = pngData.toString('base64');
      clipboard.writeText(base64Data);
      console.log('Base64 encoded image:', base64Data);
      const status = document.getElementById('status');
      if (status) {
        status.textContent = 'Copied.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
      break;

    case 'how':
      shell.openExternal("https://arayofsunshine.dev/blog/base64");
      break;

    case 'gadgets':
      shell.openExternal("https://gadgets.arayofsunshine.dev");
      break;
  }
});
