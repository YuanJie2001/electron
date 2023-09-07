<h1 align="center">wallhaven-electron</h1>

<div align="center">
一款基于 Electron 壁纸客户端 。
</div>

- github：https://github.com/YuanJie2001/electron/tree/main/wallhaven-electron-master

## 运行
```
# 安装依赖
yarn

# 运行开发模式 （注意这里需要两个都跑起来)
npm run dev:web
npm run dev:exe

# 打包安装文件 
npm run build:web
npm run build:exe

```

## 项目结构
```
- build 打包图标
- public 静态资源
- layout 前端文件
- src
  - main 主线程目录
  - renderer 渲染线程（前端打包输出目录）
```
## Api
[wallhaven.cc](https://wallhaven.cc/help/api)

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式一起共建 :smiley:：

- 通过 Issue 报告 bug 或进行咨询。
- 提交 Pull Request 改进 wallhaven-electron 的代码。
