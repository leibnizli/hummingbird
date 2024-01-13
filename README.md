English | [简体中文](./README-zh-CN.md)

`Hummingbird` uses smart lossy compression techniques to reduce the file size of your files(jpg/png/webp/svg/gif/css/js/html).

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/06adae8d-0256-4b33-903e-ca1728d62375" width="432">

* jpg/png/webp/svg/gif/html will replace the current file after compression, and a new file with .min will be generated after css/js compression.
* Backup can be turned on in Settings, and hummingbird will back up the files to the `source` folder in the current directory.

## Install

### International network (国际网)

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS v4.2.0**</a>
* <a href="https://github.com/leibnizli/hummingbird/releases">**Windows v4.2.0**</a>

### Non-international network（非国际网）

* <a href="https://pan.baidu.com/s/1d0Hk6cIGqf--vLqNWV7prQ?pwd=h2qg">**macOS v4.2.0**</a> (.dmg，Apple Silicon)
* <a href="https://pan.baidu.com/s/1LKs2uZ4aWhAXvzUBmA7UJA?pwd=pqdb">**macOS v4.2.0**</a> (.dmg，Intel x86_64)
* <a href="https://pan.baidu.com/s/1beSjp7IL5J0aOC70rFY5ng?pwd=a9a8">**Windows v4.2.0**</a> (.exe)
* <a href="https://pan.baidu.com/s/1t09bmU48pWHecKQSt0dh8Q?pwd=qprq">**Windows v4.2.0**</a> (.zip)
* <a href="https://pan.baidu.com/s/1146zRGqLFlDR27a7rUgr5w">**Windows v3.0.0**</a> (.zip，不支持多线程)

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
