import "./settings.css";
import configuration from "../configuration.js";
import { shell, IpcRenderer } from "electron";

// 使用 import 替代 require
import { ipcRenderer } from "electron";

// 定义配置项接口
interface Configuration {
  backup: boolean;
  maxWidth: number;
  maxHeightVideo: number;
  maxHeight: number;
  jpg: number;
  webp: number;
}

// 定义设置处理类
class SettingsHandler {
  private static set(el: HTMLInputElement, value: string): void {
    el.value = value;
    const targetEl = document.getElementById(el.dataset.target || '') as HTMLInputElement;
    if (targetEl) {
      targetEl.value = value;
    }
  }

  private static initializeSettings(): void {
    const backupInput = document.querySelector("input[name='backup']") as HTMLInputElement;
    if (backupInput) {
      backupInput.checked = configuration.get('backup');
    }

    const inputs: Record<string, string> = {
      "maxWidth": 'maxWidth',
      "maxHeightVideo": 'maxHeightVideo',
      "maxHeight": 'maxHeight'
    };

    Object.entries(inputs).forEach(([id, configKey]) => {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element) {
        element.value = configuration.get(configKey);
      }
    });

    const qualitySettings = [configuration.get('jpg'), configuration.get('webp')];
    document.querySelectorAll<HTMLInputElement>(".settings-range").forEach((item, i) => {
      this.set(item, qualitySettings[i]);
    });
  }

  private static setupEventListeners(): void {
    // 备份设置监听
    document.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input[name='backup']")) {
        ipcRenderer.send('backup', target.checked);
      }
    });

    // 尺寸设置监听
    document.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const sizeSettings: Record<string, string> = {
        "maxWidth": 'maxWidth',
        "maxHeightVideo": 'maxHeightVideo',
        "maxHeight": 'maxHeight'
      };

      const setting = sizeSettings[target.id];
      if (setting) {
        ipcRenderer.send(setting, target.value);
      }
    });

    // 质量设置监听
    document.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches('.settings-range')) {
        const value = target.value;
        const targetKey = target.dataset.target;
        this.set(target, value);
        if (targetKey) {
          ipcRenderer.send('set-quality', targetKey, Number(value));
        }
      }
    });

    // 购买按钮监听
    document.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.id === 'buy') {
        // shell.openExternal("https://buy.arayofsunshine.dev");
      }
    });
  }
  public static initialize(): void {
    this.initializeSettings();
    this.setupEventListeners();
  }
}

// 初始化设置
SettingsHandler.initialize();

