const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api/private/v1': {
        target: 'http://43.139.149.114:8888',
        changeOrigin: true, 
        ws: false
      }
    }
  }
})
