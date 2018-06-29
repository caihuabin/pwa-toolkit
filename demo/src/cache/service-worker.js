import ServiceWorker from '@lib/cache/service-worker'
new ServiceWorker({
  cacheName: 'cache-name',
  assets: ['/cache/index.js', '/cache/', 'https://google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png']
})
