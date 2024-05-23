简体中文 | [English](./README.md)

# <img alt="hummingbird-h1" src="https://github.com/leibnizli/hummingbird/assets/1193966/8a1a4c5b-e69b-4788-961b-60d9d323781c" width="240">

1. **Hummingbird**使用智能压缩技术来减少文件的大小，支持：jpg、png、webp、svg、gif、gif、css、js、html、mp4、mov，可以设置压缩的同时等比例缩放图片或视频的尺寸。可以拖放文件夹压缩。
2. **Hummingbird**可以转换不同格式的图片，支持：png、webp、jpeg、jpg、gif、tiff、 avif、heic，可以导出不同格式的图片，支持：png、 webp、 jpeg、 jpg、 gif、 tiff、 avif、 ico、icns(仅苹果系统)格式的图片。
3. **Hummingbird**可以从视频中提取音频，可以将视频中的音频删除，可以将视频转换为gif，可以转换视频格式，支持mp4、mov、avi。
4. 可以裁取音频中的一段或多段，可以批量转换音频为mp3、wav格式。
5. **Hummingbird**可以快速获取文件的Base64编码，支持：png、webp、jpeg、jpg、gif、tiff、avif、svg、ttf、woff、woff2。
6. **Hummingbird**可以处理字体文件，其前身是[Panda](https://github.com/leibnizli/panda)。
   * 合并，可将svg文件批量拼合为字体文件
   * 修改，可对字体追加、删除、替换、导出字形，例如：替换字体中的指定字形
   * 裁剪，从字体中过滤出需要的字形（过滤8.1M的中文字体，需等待时间约6s）
7. **Hummingbird**可以查看压缩文件的历史记录。

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/bd27ac90-bb06-42d4-aef0-7a7825328d90" width="432">

* jpg、png、webp、svg、gif、html压缩后会替换掉当前文件，可以在设置中开启备份，开启后会自动在当前目录新建`source`文件夹并备份处理前的文件。
* css、js、mp4压缩后会生成一个带.min的新文件。

## 安装

* [什么是Apple Silicon？](https://arayofsunshine.dev/zh-Hans/blog/apple-silicon)
* [macOS App打不开](https://arayofsunshine.dev/zh-Hans/blog/macos-app-cannot-be-opened)

### 最新版本

#### 从GitHub下载

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS**</a>（Apple Silicon, arm64）
* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS**</a>（Intel）
* <a href="https://github.com/leibnizli/hummingbird/releases">**Windows**</a> (>=10)

#### 从Cloudflare下载

* <a href="https://static.arayofsunshine.dev/hummingbird-5.2.0-arm64.dmg">**macOS**</a>（Apple Silicon）
* <a href="https://static.arayofsunshine.dev/hummingbird-5.2.0.dmg">**macOS**</a>（Intel）
* <a href="https://static.arayofsunshine.dev/hummingbird%20Setup%205.2.0.exe">**Windows**</a>（>=10）

### 旧版本 v3.0.0

适用于windows老版本，win7，win8

* <a href="https://drive.google.com/file/d/1eMLdviqWVWRv8gXT_d1W1uUZoIwIumVS/view?usp=drive_link">**Windows**</a>（v3.0.0，Google网盘）
* <a href="https://pan.baidu.com/s/1146zRGqLFlDR27a7rUgr5w">**Windows**</a>（v3.0.0，百度网盘）


## 使用

### 压缩图片

#### jpg压缩对比

<table>
    <tbody>
        <tr>
            <td><img src="./demo/jpg-before.jpg" alt="" width="280" height="392"></td>
            <td><img src="./demo/jpg-after.jpg" alt="" width="280" height="392"></td>
        </tr>
        <tr>
            <td>前</td>
            <td>后</td>
        </tr>
        <tr>
            <td>41kb</td>
            <td>12kb</td>
        </tr>
    </tbody>
</table>

#### png压缩对比

对于png24通道透明有比较好的压缩效果

<table>
    <tbody>
        <tr>
            <td><img src="./demo/png-before.png" alt="" width="128" height="128"></td>
            <td><img src="./demo/png-after.png" alt="" width="128" height="128"></td>
        </tr>
        <tr>
            <td>前</td>
            <td>后</td>
        </tr>
        <tr>
            <td>28.9kb</td>
            <td>9.42kb</td>
        </tr>
    </tbody>
</table>

#### svg压缩对比

<table>
    <tbody>
        <tr>
            <td><img src="./demo/svg-before.svg" alt="" width="216" height="164"></td>
            <td><img src="./demo/svg-after.svg" alt="" width="216" height="164"></td>
        </tr>
        <tr>
            <td>前</td>
            <td>后</td>
        </tr>
        <tr>
            <td>5.47kb</td>
            <td>3.55kb</td>
        </tr>
    </tbody>
</table>

### 裁切音频

<img alt="audio" src="https://github.com/leibnizli/hummingbird/assets/1193966/9c8a9f07-fd62-416e-b536-57483730834f" width="300">

### 处理字体文件

<img alt="Processing font" src="https://github.com/leibnizli/hummingbird/assets/1193966/2f1347d4-8c7c-49c5-afa8-94ee44c95f2f" width="320">

