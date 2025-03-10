import "./settings.css";
import configuration from "../configuration";
import {shell} from "electron";

const {ipcRenderer} = require('electron')

function set(el, value) {
  el.value = value;
  const targetEl = document.getElementById(el.dataset.target);
  if (targetEl) targetEl.value = value;
}

// 初始化设置值
document.querySelector("input[name='backup']").checked = configuration.get('backup');
document.getElementById("maxWidth").value = configuration.get('maxWidth');
document.getElementById("maxHeightVideo").value = configuration.get('maxHeightVideo');
document.getElementById("maxHeight").value = configuration.get('maxHeight');
const arg = [configuration.get('jpg'), configuration.get('webp')];

document.querySelectorAll(".settings-range").forEach((item, i) => {
  set(item, arg[i]);
});

// 事件监听
document.addEventListener("change", (e) => {
  if (e.target.matches("input[name='backup']")) {
    ipcRenderer.send('backup', e.target.checked);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.matches("#maxWidth")) {
    ipcRenderer.send('maxWidth', e.target.value);
  } else if (e.target.matches("#maxHeightVideo")) {
    ipcRenderer.send('maxHeightVideo', e.target.value);
  } else if (e.target.matches("#maxHeight")) {
    ipcRenderer.send('maxHeight', e.target.value);
  }
});

document.addEventListener("change", (e) => {
  if (e.target.matches('.settings-range')) {
    const value = e.target.value;
    const target = e.target.dataset.target;
    set(e.target, value);
    ipcRenderer.send('set-quality', target, Number(value));
  }
});

// Buy button click event (currently commented out)
document.addEventListener("click", (e) => {
  if (e.target.matches('#buy')) {
    // shell.openExternal("https://buy.arayofsunshine.dev");
  }
});

