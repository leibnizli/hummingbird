English | [简体中文](./README-zh-CN.md)

# <img alt="hummingbird-h1" src="https://github.com/leibnizli/hummingbird/assets/1193966/8a1a4c5b-e69b-4788-961b-60d9d323781c" width="240">

1. **Hummingbird** uses intelligent compression technology to reduce file size. It supports: jpg, png, webp, svg, gif, css, js, html, mp4, mov. You can set the size of the picture or video to be scaled equally at the same time as compression. Folder compression can be dragged and dropped.
2. **Hummingbird** can convert pictures in different formats, supports: png, webp, jpeg, jpg, gif, tiff, avif, heic, and can export pictures in different formats, supports: png, webp, jpeg, jpg, gif , tiff, avif, ico, icns (Apple system only) format pictures.
3. **Hummingbird** can extract audio from videos, delete audio from videos, convert videos to gif, and convert video formats, supporting mp4, mov, and avi.
4. One or more segments of audio can be cut, and can be converted to mp3, wav format.


<img src="https://github.com/leibnizli/hummingbird/assets/1193966/2a07f300-2d62-4624-9043-24d5daa6bd7a" width="424">

* jpg, png, webp, svg, gif, html will replace the current file after compression, Backup can be turned on in Settings, and hummingbird will back up the files to the `source` folder in the current directory.
* A new file with .min will be generated after css, js, mp4 compression.

## Install

### Latest version

#### Download from GitHub

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS**</a>（Apple Silicon, arm64）After installation, you need to allow Hummingbird to launch in `System Settings` → `Security & Privacy`.
* ~~**macOS**~~（Intel）
* <a href="https://github.com/leibnizli/hummingbird/releases/download/v5.3.0/hummingbird-Setup-5.3.0.exe">**Windows**</a> (>=10)
* <a href="https://apps.apple.com/us/app/hummingbird-video-compression/id6755109910">**iOS**</a>


### Old version v3.0.0

Suitable for old versions of windows, win7, win8

* <a href="https://drive.google.com/file/d/1eMLdviqWVWRv8gXT_d1W1uUZoIwIumVS/view?usp=drive_link">**Windows**</a>（v3.0.0，Google Drive）
* <a href="https://pan.baidu.com/s/1146zRGqLFlDR27a7rUgr5w">**Windows**</a>（v3.0.0，百度网盘）

## Help

* [What is Apple Silicon？](https://arayofsunshine.dev/blog/apple-silicon)
* [macOS App cannot be opened](https://arayofsunshine.dev/blog/macos-app-cannot-be-opened)


## Usage

### Reduce the file size

#### jpg

<table>
    <tbody>
        <tr>
            <td><img src="./demo/jpg-before.jpg" alt="" width="280" height="392"></td>
            <td><img src="./demo/jpg-after.jpg" alt="" width="280" height="392"></td>
        </tr>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
            <td>41kB</td>
            <td>12kB</td>
        </tr>
    </tbody>
</table>

#### png

<table>
    <tbody>
        <tr>
            <td><img src="./demo/png-before.png" alt="" width="128" height="128"></td>
            <td><img src="./demo/png-after.png" alt="" width="128" height="128"></td>
        </tr>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
            <td>28.9kB</td>
            <td>9.42kB</td>
        </tr>
    </tbody>
</table>

#### svg

<table>
    <tbody>
        <tr>
            <td><img src="./demo/svg-before.svg" alt="" width="216" height="164"></td>
            <td><img src="./demo/svg-after.svg" alt="" width="216" height="164"></td>
        </tr>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
            <td>5.47kB</td>
            <td>3.55kB</td>
        </tr>
    </tbody>
</table>

#### mov

<table>
    <tbody>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
            <td>1382.44MB</td>
            <td>37.95MB</td>
        </tr>
    </tbody>
</table>

### Crop audio

<img alt="audio" src="https://github.com/leibnizli/hummingbird/assets/1193966/9c8a9f07-fd62-416e-b536-57483730834f" width="300">


## Hidden functions

Access hidden functions through the menu bar entrance.

* **Hummingbird** can quickly obtain the Base64 encoding of files, supporting: png, webp, jpeg, jpg, gif, tiff, avi, svg, ttf, woff, woff2.
* **Hummingbird** can view the history of compressed files.