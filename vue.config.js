const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:getPublicPath(),

})
function getPublicPath() {
  switch (process.env.NODE_ENV) {
    case 'production': return './'
    default: return '/'
  }
}