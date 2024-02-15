简体中文 | [English](./README.md)

<img src="https://raw.githubusercontent.com/leibnizli/hummingbird/master/demo/logo.png" alt="" width="468" height="140">

> `Hummingbird`是一个资源(jpg/png/webp/svg/gif/css/js/html)压缩客户端。

<img src="https://github.com/leibnizli/hummingbird/assets/1193966/e1fad3bd-5919-4aac-b9eb-e7dc18aa2fa5" width="432">

* jpg/png/webp/svg/gif/html压缩后会替换掉当前文件，css/js压缩后会生成一个带.min的新文件
* 可以在在当前目录新建`source`文件夹并备份处理前的文件，可以在设置中开启

## 安装

### International network (国际网)

* <a href="https://github.com/leibnizli/hummingbird/releases">**macOS**</a>
* <a href="https://github.com/leibnizli/hummingbird/releases">**Windows**</a>

### Non-international network（非国际网）

* <a href="https://thunkli.com/download/hummingbird-arm64-macos">**macOS**</a>（Apple Silicon，上海节点）
* <a href="https://thunkli.com/download/hummingbird-macos">**macOS**</a>（Intel，上海节点）
* <a href="https://thunkli.com/download/hummingbird-windows">**Windows**</a> （上海节点）

## 使用

### jpg压缩对比

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

### png压缩对比

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

### svg压缩对比

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

