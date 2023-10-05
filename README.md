# HTTPCacheServer
Nodejs 服务器，用于测试 HTTP 缓存策略。

# 使用
1. 在终端运行 `node myServer.js`
2. 在浏览器打开 `http://127.0.0.1:8888/index.html`
3. 页面如下图：
            1. 第一个图片设置了 `'Cache-Control': 'max-age=10'`，10s 内刷新页面浏览器使用本地强制缓存，返回 `200 OK （来自内存缓存）` 或 `200 OK （来自磁盘缓存）`，10 后刷新则去请求 server，返回 `200 OK`。
            2. 第二个图片设置了 `'Cache-Control': 'no-cache'`、`"Last-Modified": 当前时间+10s`。设置 no-cache 让浏览器禁用强制缓存（强制请求 server），Last-Modified 设置了缓存有效期是 10s。10s 内请求缓存有效，返回 304；10后请求缓存失效，返回 200、和最新数据。

![Demo](https://github.com/wuzhenli/HTTPCacheServer/blob/main/ReadmeSource/HTTPCacheServrDemo.png?raw=true)