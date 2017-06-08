<img src="https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/logo.png" alt="" width="468" height="140">

> `蜂鸟`是一个资源(jpg/png/webp/svg/gif/css/js/html)压缩客户端。

jpg/png/webp/svg/gif/html压缩后会替换掉当前文件，替换前会在当前目录新建`source`文件夹并备份处理前的文件。

css/js压缩后会生成一个带.min的新文件。

<img src="https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/demo.png" alt="" width="432" height="379">

## Install

* <a href="https://pan.baidu.com/s/1hsd0ajE">OS X</a> (v2.0.0)
* <a href="https://pan.baidu.com/s/1mioNiys">Windows</a> (v2.0.0)

`OS X` 可能需要你在`系统偏好设置` → `安全性与隐私` 选择允许`任何来源`的应用程序

`Windows`是一个解压文件夹而不是安装包。

* (建议)将下载后的压缩包解压到目标文件夹，选择`Hummingbird.exe`右键单击 → 选择`发送到` → `桌面快捷方式`
* (或)直接运行解压目录下`Hummingbird.exe`
* 可能不支持部分Windows 10系统
* 在Windows系统中.JPG后缀的文件可能会无法运行

> 分享统计数据和压缩参数配置数据是保存在用户目录下`hummingbird-config.json`中，本App不做任何数据上传，绝对安全。

## Usage

### jpg压缩对比

<table>
    <tbody>
        <tr>
            <td><img src="https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/jpg-before.jpg" alt="" width="280" height="392"></td>
            <td><img src="https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/jpg-after.jpg" alt="" width="280" height="392"></td>
        </tr>
        <tr>
            <td>压缩前</td>
            <td>压缩后</td>
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
            <td><img src="https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/png-before.png" alt="" width="128" height="128"></td>
            <td><img src="https://raw.githubusercontent.com/stormtea123/hummingbird/master/demo/png-after.png" alt="" width="128" height="128"></td>
        </tr>
        <tr>
            <td>压缩前</td>
            <td>压缩后</td>
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
            <td><img src="https://cdn.rawgit.com/stormtea123/hummingbird/master/demo/svg-before.svg" alt="" width="216" height="164"></td>
            <td><img src="https://cdn.rawgit.com/stormtea123/hummingbird/master/demo/svg-after.svg" alt="" width="216" height="164"></td>
        </tr>
        <tr>
            <td>压缩前</td>
            <td>压缩后</td>
        </tr>
        <tr>
            <td>5.47kb</td>
            <td>3.55kb</td>
        </tr>
    </tbody>
</table>


