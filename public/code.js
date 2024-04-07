const fs = require("fs");
const { clipboard } = require('electron');
const {shell} = require("electron");
var files = [];

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
$(document).on("click", '#getBase64', function (e) {
  if (files.length === 0) return;
  const pngData = fs.readFileSync(files[0].path);
  // 将PNG数据转换为Base64编码
  const base64Data = pngData.toString('base64');
  clipboard.writeText(base64Data);
  console.log('Base64 encoded image:', base64Data);
  const status = document.getElementById('status');
  status.textContent = 'Copied.';
  setTimeout(() => {
    status.textContent = '';
  }, 750);
});

$(document).on("click", '#how', function (e) {
  shell.openExternal("https://arayofsunshine.dev/blog/base64");
});
$(document).on("click", '#gadgets', function (e) {
  shell.openExternal("https://gadgets.arayofsunshine.dev");
});
