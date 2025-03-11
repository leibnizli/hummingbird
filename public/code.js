const fs = require("fs");
const { clipboard } = require('electron');
const {shell} = require("electron");
const { webUtils } = require('electron')

// @ts-check

/**
 * @typedef {Object} FileInfo
 * @property {string} path - The file path
 * @property {string} type - The file type
 */

/**
 * Service for managing file operations
 */
class FileService {
  /** @type {FileInfo[]} */
  #files = [];

  /**
   * Updates the file list
   * @param {FileList} fileList - The list of files from input
   */
  setFiles(fileList) {
    this.#files = Array.from(fileList).map((file) => ({
      path: webUtils.getPathForFile(file),
      type: file.type
    }));
  }

  /**
   * Gets the current file list
   * @returns {FileInfo[]}
   */
  getFiles() {
    return this.#files;
  }
}

/**
 * Service for handling clipboard operations
 */
class ClipboardService {
  /**
   * Writes text to clipboard
   * @param {string} text 
   */
  writeToClipboard(text) {
    clipboard.writeText(text);
  }
}

/**
 * Service for external operations
 */
class ExternalService {
  /**
   * Opens external URL
   * @param {string} url 
   */
  openExternal(url) {
    shell.openExternal(url);
  }
}

/**
 * UI notification service
 */
class NotificationService {
  /** @type {HTMLElement|null} */
  #statusElement;

  constructor() {
    this.#statusElement = document.getElementById('status');
  }

  /**
   * Shows a temporary notification
   * @param {string} message 
   * @param {number} duration 
   */
  showTemporary(message, duration = 750) {
    if (!this.#statusElement) return;
    
    this.#statusElement.textContent = message;
    setTimeout(() => {
      if (this.#statusElement) {
        this.#statusElement.textContent = '';
      }
    }, duration);
  }
}

/**
 * Main application controller
 */
class AppController {
  /** @type {FileService} */
  #fileService;
  /** @type {ClipboardService} */
  #clipboardService;
  /** @type {ExternalService} */
  #externalService;
  /** @type {NotificationService} */
  #notificationService;

  constructor() {
    this.#fileService = new FileService();
    this.#clipboardService = new ClipboardService();
    this.#externalService = new ExternalService();
    this.#notificationService = new NotificationService();
    
    this.#initializeEventListeners();
  }

  /**
   * Initializes all event listeners
   * @private
   */
  #initializeEventListeners() {
    this.#initializeFileInput();
    this.#initializeButtonHandlers();
  }

  /**
   * Initializes file input handler
   * @private
   */
  #initializeFileInput() {
    const fileInput = document.getElementById('file');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
      // @ts-ignore
      const files = e.target.files;
      if (files) {
        this.#fileService.setFiles(files);
      }
    });
  }

  /**
   * Initializes button click handlers
   * @private
   */
  #initializeButtonHandlers() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[id]');
      if (!button) return;

      const handlers = {
        'getBase64': () => this.#handleBase64Conversion(),
        'how': () => this.#externalService.openExternal('https://arayofsunshine.dev/blog/base64'),
        'gadgets': () => this.#externalService.openExternal('https://gadgets.arayofsunshine.dev')
      };

      // @ts-ignore
      const handler = handlers[button.id];
      if (handler) {
        handler();
      }
    });
  }

  /**
   * Handles base64 conversion and clipboard copy
   * @private
   */
  #handleBase64Conversion() {
    const files = this.#fileService.getFiles();
    if (files.length === 0) return;

    try {
      const pngData = fs.readFileSync(files[0].path);
      const base64Data = pngData.toString('base64');
      this.#clipboardService.writeToClipboard(base64Data);
      this.#notificationService.showTemporary('Copied.');
    } catch (error) {
      console.error('Failed to convert file:', error);
      this.#notificationService.showTemporary('Error converting file.');
    }
  }
}

// Initialize the application
new AppController();
