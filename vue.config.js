const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/': {
        target: 'http://43.139.149.114:8888/api/private/v1',
        changeOrigin: true, 
        ws: false
      }
    }
  }
})
