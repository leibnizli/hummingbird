English | [简体中文](./README-zh-CN.md)

# <img alt="hummingbird-h1" src="https://github.com/leibnizli/hummingbird/assets/1193966/8a1a4c5b-e69b-4788-961b-60d9d323781c" width="240">

`Hummingbird` uses smart lossy compression techniques to reduce the file size of your files(jpg/png/webp/svg/gif/css/js/html).

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/e1fad3bd-5919-4aac-b9eb-e7dc18aa2fa5" width="432">

* jpg/png/webp/svg/gif/html will replace the current file after compression, and a new file with .min will be generated after css/js compression.
* Backup can be turned on in Settings, and hummingbird will back up the files to the `source` folder in the current directory.

## Install

* [What is Apple Silicon？](https://arayofsunshine.dev/blog/apple-silicon)
* [macOS App cannot be opened](https://arayofsunshine.dev/blog/macos-app-cannot-be-opened)

### International network (国际网)

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS v4.3.0**</a>
* <a href="https://github.com/leibnizli/hummingbird/releases">**Windows v4.3.0**</a>

### Non-international network（非国际网）

* <a href="https://thunkli.com/download/hummingbird-arm64-macos">**macOS**</a>（Apple Silicon，上海节点）
* <a href="https://thunkli.com/download/hummingbird-macos">**macOS**</a>（Intel，上海节点）
* <a href="https://thunkli.com/download/hummingbird-windows">**Windows**</a> （上海节点）


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
