import config from '../../config'
module.exports = {
  api: {
    url: config.api.url || "http://localhost:3000/",
    port: config.api.port || 3000
  },
}