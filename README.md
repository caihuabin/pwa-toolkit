# pwa-toolkit

## 功能
* Mock: 浏览器端的 mock server，本地开发时Chrome可用
* Cache: 静态资源缓存加速、离线体验
* Demo: Mock、Cache的使用演示[Demo]

## 使用方式
```
1、Mock

主页面（例如index.js）代码:

import { Mock } from 'pwa-toolkit'
new Mock.MockRegister({ filename: '/service-worker.js' })
// 可以开始请求数据了
fetch('/mock/demo1').then(res => res.json()).then(data => console.log(data))
fetch('/mock/demo2', { method: 'POST' }).then(res => res.json()).then(data => console.log(data))


service-worker.js代码：

// service-worker.js 不建议设置 max-age 等http缓存
import { Mock } from 'pwa-toolkit'
const mock = new Mock.MockServer()

mock.get('/mock/demo1', function(req, res) {
  res.status = 200
  res.body = { data: 'demo1' }
})

mock.post('/mock/demo2', (req, res) => {
  res.body = { data: 'demo2' }
})
```

```
2、Cache

主页面（例如index.js）代码:

import { Cache } from 'pwa-toolkit'
new Cache.CacheRegister({ filename: '/service-worker.js' })

service-worker.js代码：

// service-worker.js 不建议设置 max-age 等http缓存
import { Cache } from 'pwa-toolkit'
const cache = new Cache.CacheServer({ cacheName: 'cache-name', assets: ['/'] })

```

## 配置说明
```
1、Mock
Mock.MockRegister: {
  // 必传，service-worker 脚本的访问路径，也是它的作用域
  filename: ''
}

Mock.MockServer: 提供get、post、patch、put、delete等方法

todo:支持响应流数据等
```

```
2、Cache
Cache.CacheRegister: {
  filename: '',
  onError: function() {}, // 可选，serviceWorker 注册失败
  onInstalled: function() {}, // 可选，安装完成
  onInstallFailed： function() {}, // 可选，安装失败
  onUpdating: function() {}, // 可选，更新中
  onUpdateReady: function() {}, // 可选，更新完成
  onUpdated: function() { // 可选，新脚本激活成功
    window.location.reload();
  },
  onUpdateFailed: function() {}, // 可选，更新失败
  online: function() {}, // 可选，监听网络连接
  offline: function() {} // 可选，监听网络离线
}

Cache.CacheServer: {
  cacheName: 'cache-name', // 使用的缓存名称
  assets: [], // 要缓存的资源
  skipWaiting: false // 新脚本安装完成后是否跳过 waiting 状态
}
```
## TODO
* 消息推送Push

## 相关
* https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker

[Demo]: ./demo/README.md