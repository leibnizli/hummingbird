/**
 * Main entry file for the Hummingbird application
 */
import path from 'path';
import fs from 'fs/promises';
import { shell, ipcRenderer } from 'electron';
import { getUserHome } from './util.js';
import './index.css';

// Constants
const LOG_FILE_NAME = 'hummingbird-log.txt';
const INITIAL_LOG_CONTENT = '----log----\n';
const GITHUB_ISSUES_URL = 'https://github.com/leibnizli/hummingbird/issues';

interface ShareData {
  count: number;
  size: number;
}

interface WindowState {
  shareCount: number;
  shareSize: number;
}

interface NavigatorUABrandVersion {
  brand: string;
  version: string;
}

interface UADataValues {
  brands?: NavigatorUABrandVersion[];
  mobile?: boolean;
  platform?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
  platformVersion?: string;
  uaFullVersion?: string;
}

interface NavigatorUAData {
  readonly brands: NavigatorUABrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
}

declare global {
  interface Window extends WindowState {
    shareCount: number;
    shareSize: number;
  }

  interface Navigator {
    readonly userAgentData?: NavigatorUAData;
  }
}

// Initialize window state
window.shareCount = 0;
window.shareSize = 0;

/**
 * Path to the application's log file
 */
const logPath = path.join(getUserHome(), LOG_FILE_NAME)
/**
 * Initialize log file if it doesn't exist
 */
async function initializeLogFile(): Promise<void> {
  try {
    await fs.access(logPath);
    console.log('Log file already exists.');
  } catch {
    try {
      await fs.writeFile(logPath, INITIAL_LOG_CONTENT);
      console.log('Log file created successfully.');
    } catch (error) {
      console.error('Error creating log file:', error);
    }
  }
}

/**
 * Prevent default drag and drop behavior
 */
function preventDefaultDragAndDrop(): void {
  const events = ['dragleave', 'drop', 'dragenter', 'dragover'];
  events.forEach(event => {
    document.addEventListener(event, (e) => e.preventDefault());
  });
}

/**
 * Handle button click events
 */
function handleButtonClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const button = target.closest('[id]') as HTMLElement;
  if (!button) return;

  const buttonActions: Record<string, () => void> = {
    settings: () => ipcRenderer.send('open-settings-window'),
    convert: () => ipcRenderer.send('open-convert-window'),
    code: () => ipcRenderer.send('open-code-window'),
    video: () => ipcRenderer.send('open-video-window'),
    audio: () => ipcRenderer.send('open-audio-window'),
    log: () => shell.openPath(logPath),
    issues: () => shell.openExternal(GITHUB_ISSUES_URL),
    share: () => {
      // Commented out for future implementation
      // const shareText = `Hummingbird App has helped me process pictures ${window.shareCount} times and compressed the space ${(window.shareSize / (1024 * 1024)).toFixed(4)}M`;
      // shell.openExternal(`http://twitter.com/share?text=${shareText}&url=https://github.com/leibnizli/hummingbird`);
    },
    minimized: () => ipcRenderer.send('main-minimized'),
    close: () => ipcRenderer.send('close-main-window'),
  };

  const action = buttonActions[button.id];
  if (action) {
    action();
  }
}

/**
 * Handle share data updates from IPC
 */
function setupShareDataListener(): void {
  ipcRenderer.on('share-data', (_event, count: number, size: number) => {
    window.shareCount = count;
    window.shareSize = size;
  });
}

/**
 * Check Windows version and apply UI adjustments if necessary
 */
async function checkWindowsVersion(): Promise<void> {
  try {
    const userAgentData = navigator.userAgentData;
    if (!userAgentData) {
      console.log('userAgentData is not supported');
      return;
    }

    const ua = await userAgentData.getHighEntropyValues(['platformVersion']);
    if (userAgentData.platform === 'Windows') {
      const majorPlatformVersion = parseInt((ua.platformVersion ?? '0').split('.')[0], 10);

      if (majorPlatformVersion >= 13) {
        console.log('Windows 11 or later');
      } else if (majorPlatformVersion > 0) {
        console.log('Windows 10');
      } else {
        console.log('Before Windows 10');
        const uiApp = document.getElementById('ui-app');
        if (uiApp) {
          uiApp.style.border = 'solid 1px #7d95ad';
        }
      }
    } else {
      console.log('Not running on Windows');
    }
  } catch (error) {
    console.error('Error checking Windows version:', error);
  }
}

/**
 * Initialize the application
 */
async function initialize(): Promise<void> {
  await initializeLogFile();
  preventDefaultDragAndDrop();
  document.addEventListener('click', handleButtonClick);
  setupShareDataListener();
  await checkWindowsVersion();

  // Initialize app
  require('./app.js');
}

// Start the application
initialize().catch(error => {
  console.error('Failed to initialize application:', error);
});

