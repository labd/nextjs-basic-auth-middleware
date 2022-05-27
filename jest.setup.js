const nodeFetch = require('node-fetch')

if (typeof fetch === 'undefined') {
  global.fetch = nodeFetch
  global.Request = nodeFetch.Request
}
