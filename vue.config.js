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
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('@/main-prod.js')
      config.set('externals', {
        axios: 'axios',
        nprogress: 'NProgress',
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('@/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
})