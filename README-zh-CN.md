简体中文 | [English](./README.md)

# <img alt="hummingbird-h1" src="https://github.com/leibnizli/hummingbird/assets/1193966/8a1a4c5b-e69b-4788-961b-60d9d323781c" width="240">

* **Hummingbird**使用智能压缩技术来减少文件的文件大小，支持：jpg、png、webp、svg、gif、gif、css、js、html。
* **Hummingbird**可以转换不同格式的图片，支持：.png、 .webp、 .jpeg、 .jpg、 .gif、 .tiff、 .avif。
* **Hummingbird**可以导出不同格式的图片，支持：.png、 .webp、 .jpeg、 .jpg、 .gif、 .tiff、 .avif、 .ico、.icns(仅苹果系统)格式的图片。

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/1b290851-cb03-46b1-ab3b-b34ef907d552" width="432">

* jpg/png/webp/svg/gif/html压缩后会替换掉当前文件，css/js压缩后会生成一个带.min的新文件
* 可以在设置中开启备份，开启后会自动在当前目录新建`source`文件夹并备份处理前的文件

## 安装

* [什么是Apple Silicon？](https://arayofsunshine.dev/zh-Hans/blog/apple-silicon)
* [macOS App打不开](https://arayofsunshine.dev//zh-Hans/blog/macos-app-cannot-be-opened)

### 最新版本 v4.5.0

#### 从GitHub下载

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS**</a>
* <a href="https://github.com/leibnizli/hummingbird/releases">**Windows**</a> (>=10)

#### 从Cloudflare下载

* <a href="https://static.arayofsunshine.dev/hummingbird-4.5.0-arm64.dmg">**macOS**</a>（Apple Silicon）
* <a href="https://static.arayofsunshine.dev/hummingbird-4.5.0.dmg">**macOS**</a>（Intel）
* <a href="https://static.arayofsunshine.dev/hummingbird.Setup.4.5.0.exe">**Windows**</a>（>=10）

### 旧版本 v3.0.0

#### 从Google网盘下载

* <a href="https://drive.google.com/file/d/1eMLdviqWVWRv8gXT_d1W1uUZoIwIumVS/view?usp=drive_link">**Windows**</a>（v3.0.0，适用于windows老版本，win7，win8）

#### 从百度网盘下载

* <a href="https://pan.baidu.com/s/1146zRGqLFlDR27a7rUgr5w">**Windows**</a>（v3.0.0，适用于windows老版本，win7，win8）


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
            <td>25kb</td>
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

### 图片格式转换

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/f143c02d-acc9-4b16-91ca-5a6cb2d3327f" width="480">

