const http = require('http');
const fs = require('fs');
const path = require('path');
const { readFileSync, getFileStat } = require("./utils");

const DEFAULT_PATH = "index.html";

var validSecond = 10;

http.createServer(function (request, response) {
    const { method, url } = request;

    if (url === '/index.html') {
    }
    console.log(`method:${method}, url:${url} `);

    if (url === '/index.html') {
        const data = readFileSync(DEFAULT_PATH, { encoding: "utf-8" });
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(data);
    } else if (url === '/myServer.js') {
        // 发送 HTTP 头部
        // HTTP 状态值: 200 : OK
        // 内容类型: text/plain。并用charset=UTF-8解决输出中文乱码
        response.writeHead(200, {
            'Content-Type': 'text/plain; charset=UTF-8',
            'Cache-Control': 'public, max-age=10',
        });
        // response.write('Hello World! 这是简单的web服务器测试。\n');
        // 下句是发送响应数据
        response.end();
    } else if (url === '/example.png') {
        response.writeHead(200, {
            'Content-Type': 'image/png',
            'Cache-Control': `max-age=${validSecond}`,
        });
        response.end(readFileSync(url));
        return;
    } else if (url === '/example1.png') {
        const ifModifiedSince = request.headers["if-modified-since"];
        const stat = getFileStat(DEFAULT_PATH);
        let currentDate = new Date();
        let currentTimeStampMs = Date.parse(currentDate);

        // request.headers:${JSON.stringify(request.headers)} 
        let ifModifiedSinceTimeStampMs =  Date.parse(ifModifiedSince);
        isValid = (currentTimeStampMs - ifModifiedSinceTimeStampMs) / 1000 < validSecond;
        console.log(`if-modified-since:${ifModifiedSince},  stat.mtime:${stat.mtime.toGMTString()}  age:${(currentTimeStampMs - ifModifiedSinceTimeStampMs) / 1000} isValid:${isValid}`);

        let lastModified = currentDate.toGMTString();
        if (ifModifiedSince) {

            // 资源失效了 返回新的资源
            if (!isValid) {
                response.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'no-cache', // 设置 Cache-Control: no-cache，让浏览器禁用强制缓存、直接发起请求。
                    "Last-Modified": lastModified
                });
                response.end(readFileSync(url));
            } else {
                response.writeHead(304, {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'no-cache',
                    "Last-Modified": lastModified
                });
                response.end();
            }
        } else {
            response.setHeader("Last-Modified", lastModified);
            response.end(readFileSync(url));
        }
    }
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/index.html');