import "./settings.css";
import configuration from "../configuration";
import { shell, IpcRenderer } from "electron";
// 类型声明
interface Configuration {
  get(key: string): string | number | boolean;
  set(key: string, value: string | number | boolean): void;
}

interface HTMLInputWithDataset extends HTMLInputElement {
  dataset: {
    target: string;
  };
}

// 从 electron 获取 ipcRenderer
const { ipcRenderer }: { ipcRenderer: IpcRenderer } = require('electron');

/**
 * 设置输入元素的值，并同步更新目标元素
 * @param el 输入元素
 * @param value 要设置的值
 */
function set(el: HTMLInputWithDataset, value: string | number): void {
  el.value = String(value);
  const targetEl = document.getElementById(el.dataset.target);
  if (targetEl instanceof HTMLInputElement) {
    targetEl.value = String(value);
  }
}

// 初始化设置值
const backupInput = document.querySelector("input[name='backup']") as HTMLInputElement;
const maxWidthInput = document.getElementById("maxWidth") as HTMLInputElement;
const maxHeightVideoInput = document.getElementById("maxHeightVideo") as HTMLInputElement;
const maxHeightInput = document.getElementById("maxHeight") as HTMLInputElement;

if (backupInput && maxWidthInput && maxHeightVideoInput && maxHeightInput) {
  backupInput.checked = configuration.get('backup') as boolean;
  maxWidthInput.value = String(configuration.get('maxWidth'));
  maxHeightVideoInput.value = String(configuration.get('maxHeightVideo'));
  maxHeightInput.value = String(configuration.get('maxHeight'));
}

const arg = [configuration.get('jpg'), configuration.get('webp')];

document.querySelectorAll<HTMLInputWithDataset>(".settings-range").forEach((item, i) => {
  set(item, arg[i]);
});

// 事件监听
document.addEventListener("change", (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.matches("input[name='backup']")) {
    ipcRenderer.send('backup', target.checked);
  }
});

document.addEventListener("input", (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.matches("#maxWidth")) {
    ipcRenderer.send('maxWidth', target.value);
  } else if (target.matches("#maxHeightVideo")) {
    ipcRenderer.send('maxHeightVideo', target.value);
  } else if (target.matches("#maxHeight")) {
    ipcRenderer.send('maxHeight', target.value);
  }
});

document.addEventListener("change", (e: Event) => {
  const target = e.target as HTMLInputWithDataset;
  if (target.matches('.settings-range')) {
    const value = target.value;
    const targetKey = target.dataset.target;
    set(target, value);
    ipcRenderer.send('set-quality', targetKey, Number(value));
  }
});

// Buy button click event (currently commented out)
document.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.matches('#buy')) {
    // shell.openExternal("https://buy.arayofsunshine.dev");
  }
});

