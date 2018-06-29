const CacheRegister = require('./lib/cache/register')
const CacheServer = require('./lib/cache/service-worker')

const MockRegister = require('./lib/mock/register')
const MockServer = require('./lib/mock/service-worker')

exports.Cache = { CacheRegister, CacheServer }
exports.Mock = { MockRegister, MockServer }
