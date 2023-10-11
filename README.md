# 基于FFmpeg的音视频处理软件

项目基于[create-electron](https://521github.com/alex8088/quick-start/tree/master/packages/create-electron)快速开发


## 技术栈

- Vue3
- Typescript
- Electron
- FFmpeg

## 支持功能
- 本地文件预览（音视频）
- 支持常见视频格式的转换（flv、mp4）
- 支持字幕合并到视频
- 支持批量处理音视频
- 音视频信息解析展示
- 常见的音视频处理
    - 消音
    - 消除画面
    - 压缩
- 录屏/截屏

    不同的采集设置实现的功能不一样，参数也不一样；windows下采集方式主要是dshow、gdigrab。dshow主要是摄像头、采集卡、麦克风这些；grab则是窗口程序多点；

    ~~本文的录屏实现主要是通过dshow进行指定设备录屏（没找到可以设置录制指定区域的方案实现，应该可以通过录屏资源后期处理实现）；应该采用grab会好一点，留个坑~~

    本文的录屏实现主要是通过gdigrab进行屏幕录制，支持区域选中录制/截屏；
## 快速运行

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
