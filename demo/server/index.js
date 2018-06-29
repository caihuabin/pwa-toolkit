const { resolve } = require('path')
const serve = require('koa-static')
const Koa = require('koa')
const app = new Koa()

app.use(serve(resolve('./site')))
app.listen(3000)

console.log('listening on port 3000')
