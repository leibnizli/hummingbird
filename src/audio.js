const WaveSurfer = require('wavesurfer.js');
const TimelinePlugin = require('wavesurfer.js/dist/plugins/timeline.esm.js');
const Minimap = require('wavesurfer.js/dist/plugins/minimap.esm.js');
const RegionsPlugin = require('wavesurfer.js/dist/plugins/regions.esm.js');
const os =  require('os');
const fs = require("fs");
const {shell} = require("electron");
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require("path");

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

const getDesktopOrHomeDir = () => {
  const homeDir = path.resolve(os.homedir())
  const desktopDir = path.resolve(os.homedir(), 'Desktop')
  if (!fs.existsSync(desktopDir)) {
    return homeDir;
  }
  return desktopDir;
}


let files = [{
  path: path.join(__dirname, '/hummingbird-test-audio.mp3'),
  type: 'audio/mpeg'
}];
let checkedData = [];
const status = document.getElementById('status');
const audioCut = $("#audioCut");

function openFolder(path) {
  shell.openPath(path)
}

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  scrollParent: true,
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: './hummingbird-test-audio.mp3',
  plugins: [
    TimelinePlugin.create(),
    Minimap.create({
      height: 20,
      waveColor: '#ddd',
      progressColor: '#999',
      // the Minimap takes all the same options as the WaveSurfer itself
    })
  ],
});
wavesurfer.on('interaction', () => {
  wavesurfer.play();
});
wavesurfer.on('finish', () => {
  if (loop) {

  } else {
    wavesurfer.setTime(0);
  }

});
// Initialize the Regions plugin
const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());

wavesurfer.on('decode', () => {
  // Regions
  // wsRegions.addRegion({
  //   start: 0,
  //   end: 10,
  //   content: '',
  //   color: 'rgb(0 254 143 / 0.5)',
  //   resize: true,
  // });
});
wsRegions.enableDragSelection({
  color: 'rgb(0 254 143 / 0.3)',
});
wsRegions.on('region-updated', (region) => {
  console.log('Updated region', region)
});
// Update the zoom level on slider change
wavesurfer.once('decode', () => {
  const slider = document.querySelector('input[type="range"]')
  slider.addEventListener('input', (e) => {
    const minPxPerSec = e.target.valueAsNumber
    wavesurfer.zoom(minPxPerSec)
  });
});
// Give regions a random color when they are created
const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`
// Loop a region on click
let loop = false;
// Toggle looping with a checkbox
document.querySelector('input[type="checkbox"]').onclick = (e) => {
  loop = e.target.checked
}

let activeRegion = null;
wsRegions.on('region-in', (region) => {
  console.log('region-in', region);
  activeRegion = region;
});
wsRegions.on('region-out', (region) => {
  console.log('region-out', region)
  if (activeRegion === region) {
    if (loop) {
      region.play();
    } else {
      activeRegion = null;
    }
  }
});
wsRegions.on('region-clicked', (region, e) => {
  e.stopPropagation() // prevent triggering a click on the waveform
  activeRegion = region;
  region.play();
  wsRegions.getRegions().forEach((el, i) => {
    if (el.start === region.start) {
      el.setOptions({color: 'rgb(0 254 143 / 0.8)'});
    } else {
      el.setOptions({color: 'rgb(0 254 143 / 0.3)'});
    }
  });
});
// Reset the active region when the user clicks anywhere in the waveform
wavesurfer.on('interaction', () => {
  activeRegion = null;
});
document.addEventListener('keydown', function (e) {
  e.preventDefault();
  if (e.key === ' ') {
    console.log(e.key)
    // 在这里处理空格键按下事件
    console.log('Space key pressed');
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
    } else {
      wavesurfer.play();
    }
  }
  if (e.key === 'Backspace') {
    console.log(e.key)
    if (activeRegion) {
      activeRegion.remove();
    }
    // wsRegions.clearRegions();
  }
});
$(document).on("change", '#file', function (e) {
  console.log(this.files)
  files = Array.from(this.files).map((ele, i) => {
    return {
      path: ele.path,
      type: ele.type
    }
  });
  wsRegions.clearRegions();
  if (files.length === 1) {
    wavesurfer.load(`file://${files[0].path}`);
    audioCut.show();
  }
  if (files.length > 1) {
    audioCut.hide();
  }
});
$(document).on("click", '#export', function (e) {
  checkedData = [];
  if (files.length > 0) {
    $("input[type='checkbox']").each((i, ele) => {
      if ($(ele).prop('checked')) {
        checkedData.push($(ele).val());
      }
    });
    if (checkedData.length === 0) return;
    Convert();
  }
});

function Convert() {
  const segments = [];
  wsRegions.getRegions().forEach((el, i) => {
    segments.push([el.start, el.end]);
  });
  if (segments.length > 0) {
    const ele = files[0];
    let fileDirname = path.dirname(ele.path);
    let extension = path.extname(ele.path);
    let file = path.basename(ele.path, extension);
    if (file === 'hummingbird-test-audio') {
      fileDirname = getDesktopOrHomeDir();
    }
    checkedData.forEach((checkEle) => {
      switch (checkEle) {
        case "mp3":
          segments.forEach((seg) => {
            console.log(seg);
            ffmpeg()
              .input(ele.path)
              .outputOptions(`-ss`, `${seg[0]}`, `-to`, `${seg[1]}`)
              .on('progress', (progress) => {
                if (progress.percent) {
                  status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
                }
              })
              .saveToFile(path.join(fileDirname, `${file}_output_${seg[0]}.${checkEle}`))
              .on('end', () => {
                status.textContent = 'finished';
                console.log('FFmpeg has finished.');
              })
              .on('error', (error) => {
                status.textContent = 'error';
              });
          });
          break;
        case "wav":
          segments.forEach((seg) => {
            console.log(seg);
            ffmpeg()
              .input(ele.path)
              .outputOptions(`-ss`, `${seg[0]}`, `-to`, `${seg[1]}`)
              .on('progress', (progress) => {
                if (progress.percent) {
                  status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
                }
              })
              .saveToFile(path.join(fileDirname, `${file}_output_${seg[0]}.${checkEle}`))
              .on('end', () => {
                status.textContent = 'finished';
                console.log('FFmpeg has finished.');
                openFolder(fileDirname);
              })
              .on('error', (error) => {
                status.textContent = 'error';
              });
          });
          break;
        default:
          break;
      }
    });
    openFolder(fileDirname);
  } else {
    files.forEach((ele, i) => {
      let fileDirname = path.dirname(ele.path);
      let extension = path.extname(ele.path);
      let file = path.basename(ele.path, extension);
      if (file === 'hummingbird-test-audio') {
        fileDirname = getDesktopOrHomeDir();
      }
      checkedData.forEach((checkEle) => {
        let targetPath = path.join(fileDirname, `${file}.${checkEle}`);
        switch (checkEle) {
          case "mp3":
            if (ele.type.indexOf('mpeg') > -1) return;
            ffmpeg()
              .input(ele.path)
              .on('progress', (progress) => {
                if (progress.percent) {
                  status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
                }
              })
              .saveToFile(targetPath)
              .on('end', () => {
                status.textContent = 'finished';
                console.log('FFmpeg has finished.');
              })
              .on('error', (error) => {
                status.textContent = 'error';
              });
            break;
          case "wav":
            if (ele.type.indexOf('wav') > -1) return;
            ffmpeg()
              .input(ele.path)
              .on('progress', (progress) => {
                if (progress.percent) {
                  status.textContent = `Processing: ${Math.floor(progress.percent)}% done`;
                }
              })
              .saveToFile(targetPath)
              .on('end', () => {
                status.textContent = 'finished';
                console.log('FFmpeg has finished.');
              })
              .on('error', (error) => {
                status.textContent = 'error';
              });
            break;
          default:
            break;
        }
      });
      if (i === 0) {
        openFolder(fileDirname);
      }
    });
  }

}

