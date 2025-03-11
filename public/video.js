// Constants and Types
const SUPPORTED_FORMATS = {
  MP4: {
    extension: 'mp4',
    options: {
      vcodec: 'h264'
    }
  },
  MP3: {
    extension: 'mp3',
    options: {
      ab: '192k'
    }
  },
  MOV: {
    extension: 'mov',
    options: {}
  },
  AVI: {
    extension: 'avi',
    options: {}
  },
  GIF: {
    extension: 'gif',
    options: {}
  }
};

// Core dependencies
const fs = require('fs');
const path = require('path');
const { clipboard, shell } = require('electron');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const { webUtils } = require('electron');

// FFmpeg configuration
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * @typedef {Object} FileInfo
 * @property {string} path - File path
 * @property {string} type - File MIME type
 */

/**
 * VideoProcessor class handles all video processing operations
 */
class VideoProcessor {
  constructor() {
    this.files = [];
    this.checkedFormats = [];
    this.statusElements = {
      main: document.getElementById('status'),
      mp3: document.getElementById('status-mp3'),
      delete: document.getElementById('status-delete')
    };
  }

  /**
   * Initialize event listeners
   */
  init() {
    this._initFileInput();
    this._initButtonListeners();
  }

  /**
   * @param {string} filePath - Path to open in system file explorer
   */
  static openFolder(filePath) {
    shell.openPath(filePath);
  }

  /**
   * @private
   * Updates status element with progress or completion message
   */
  _updateStatus(statusElement, message) {
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  /**
   * @private
   * Handles file conversion with FFmpeg
   */
  async _processVideo(inputPath, outputPath, options = {}, statusElement) {
    return new Promise((resolve, reject) => {
      const command = ffmpeg()
        .input(inputPath)
        .on('progress', (progress) => {
          if (progress.percent) {
            this._updateStatus(statusElement, `Processing: ${Math.floor(progress.percent)}% done`);
          }
        })
        .on('end', () => {
          this._updateStatus(statusElement, 'finished');
          resolve();
        })
        .on('error', (error) => {
          this._updateStatus(statusElement, 'error');
          reject(error);
        });

      // Apply additional options
      Object.entries(options).forEach(([key, value]) => {
        command.outputOptions(`-${key}`, value);
      });

      command.saveToFile(outputPath);
    });
  }

  /**
   * @private
   * Initialize file input handler
   */
  _initFileInput() {
    const fileInput = document.getElementById('file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.files = Array.from(e.target.files).map(file => ({
          path: webUtils.getPathForFile(file),
          type: file.type
        }));
      });
    }
  }

  /**
   * @private
   * Initialize button click handlers
   */
  _initButtonListeners() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[id]');
      console.log(button)
      if (!button) return;

      const handlers = {
        'mp3': () => this._handleMp3Conversion(),
        'delete': () => this._handleAudioDeletion(),
        'export': () => this._handleFormatConversion()
      };

      const handler = handlers[button.id];
      if (handler) {
        handler();
      }
    });
  }

  /**
   * @private
   * Handles conversion of video/audio files to MP3 format
   */
  async _handleMp3Conversion() {
    if (this.files.length === 0) return;

    for (const [index, file] of this.files.entries()) {
      const fileDirname = path.dirname(file.path);
      const extension = path.extname(file.path);
      const fileName = path.basename(file.path, extension);
      const targetPath = path.join(fileDirname, `${fileName}.mp3`);

      try {
        await this._processVideo(
          file.path,
          targetPath,
          SUPPORTED_FORMATS.MP3.options,
          this.statusElements.mp3
        );

        if (index === 0) {
          VideoProcessor.openFolder(fileDirname);
        }
      } catch (error) {
        console.error('MP3 conversion failed:', error);
      }
    }
  }

  /**
   * @private
   * Handles removal of audio from video files
   */
  async _handleAudioDeletion() {
    if (this.files.length === 0) return;

    for (const [index, file] of this.files.entries()) {
      const fileDirname = path.dirname(file.path);
      const extension = path.extname(file.path);
      const fileName = path.basename(file.path, extension);
      const targetPath = path.join(fileDirname, `${fileName}_no_audio${extension}`);

      try {
        const command = ffmpeg()
          .input(file.path)
          .noAudio()
          .outputOptions('-codec', 'copy')
          .on('progress', (progress) => {
            if (progress.percent) {
              this._updateStatus(
                this.statusElements.delete,
                `Processing: ${Math.floor(progress.percent)}% done`
              );
            }
          })
          .on('end', () => {
            this._updateStatus(this.statusElements.delete, 'finished');
          })
          .on('error', (error) => {
            this._updateStatus(this.statusElements.delete, 'error');
            console.error('Audio removal failed:', error);
          });

        command.saveToFile(targetPath);

        if (index === 0) {
          VideoProcessor.openFolder(fileDirname);
        }
      } catch (error) {
        console.error('Audio removal failed:', error);
      }
    }
  }

  /**
   * @private
   * Collects selected format options from checkboxes
   * @returns {string[]} Array of selected format extensions
   */
  _getSelectedFormats() {
    const checkedFormats = [];
    document.querySelectorAll("input[type='checkbox']").forEach((element) => {
      if (element.checked) {
        checkedFormats.push(element.value);
      }
    });
    return checkedFormats;
  }

  /**
   * @private
   * Handles conversion of files to selected formats
   */
  async _handleFormatConversion() {
    if (this.files.length === 0) return;

    const selectedFormats = this._getSelectedFormats();
    if (selectedFormats.length === 0) return;

    for (const [fileIndex, file] of this.files.entries()) {
      const fileDirname = path.dirname(file.path);
      const extension = path.extname(file.path);
      const fileName = path.basename(file.path, extension);

      for (const format of selectedFormats) {
        // Skip if source file is already in target format
        if (file.type.includes(format)) continue;

        const targetPath = path.join(fileDirname, `${fileName}.${format}`);
        const formatKey = format.toUpperCase();
        const options = SUPPORTED_FORMATS[formatKey]?.options || {};

        try {
          await this._processVideo(
            file.path,
            targetPath,
            options,
            this.statusElements.main
          );
        } catch (error) {
          console.error(`Conversion to ${format} failed:`, error);
        }
      }

      if (fileIndex === 0) {
        VideoProcessor.openFolder(fileDirname);
      }
    }
  }
}

// Initialize the processor
const processor = new VideoProcessor();
processor.init();
