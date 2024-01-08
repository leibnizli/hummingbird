English | [简体中文](./README-zh-CN.md)

`Hummingbird` uses smart lossy compression techniques to reduce the file size of your files(jpg/png/webp/svg/gif/css/js/html).

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/5e44fd5e-15f9-4ba5-a40b-75310bd14815" width="432">

* jpg/png/webp/svg/gif/html will replace the current file after compression, and a new file with .min will be generated after css/js compression.
* You can create a `source` folder in the current directory and back up the files before processing, which can be enabled in the settings.

## Install

### Overseas users

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS v4.2.0**</a> (Supports drag and drop folder compression and multi-threading)
* <a href="https://drive.google.com/file/d/1eMLdviqWVWRv8gXT_d1W1uUZoIwIumVS/view?usp=sharing">**Windows v3.0.0**</a> (Support the drag and drop folder compression)

### Mainland users（大陆用户）

* <a href="https://pan.baidu.com/s/1_i0fzJ916mGe6Kn-zLERsQ?pwd=z79c">**macOS v4.2.0**</a> (支持拖放文件夹压缩，支持多线程)
* <a href="https://pan.baidu.com/s/1146zRGqLFlDR27a7rUgr5w">**Windows v3.0.0**</a> (支持拖放文件夹压缩)

## Usage

### jpg

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
            <td>41kb</td>
            <td>25kb</td>
        </tr>
    </tbody>
</table>

### png

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
            <td>28.9kb</td>
            <td>9.42kb</td>
        </tr>
    </tbody>
</table>

### svg

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
            <td>5.47kb</td>
            <td>3.55kb</td>
        </tr>
    </tbody>
</table>
