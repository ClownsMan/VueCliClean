const path = require('path');

const {
  VUE_APP_COSTPATH = '服务器地址',
  VUE_APP_PUBLICPATH = './'
} = process.env;

function resolve (dir) {
  return path.join(__dirname, dir);
}

const vueConfig = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#E25A85', // 暂时主题色由这里更改
          // 'link-color': '#F5222D',
          // 'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    // 设置别名
    config.resolve.alias.set('@$', resolve('src'));
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');
    // // 压缩代码
    // config.optimization.minimize(true);
    // // 分割代码
    // config.optimization.splitChunks({
    //   chunks: 'all'
    // })
  },
  // 设置打包后引入css js的地址
  publicPath: VUE_APP_PUBLICPATH,
  //跨域代理
  devServer: {
    open: true, //配置自动启动浏览器
    proxy: {
      '/cost': {
        target: VUE_APP_COSTPATH,
        changeOrigin: true,
        pathRewrite: {
          '^/cost': '/',
        },
      },
      '/mock': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '/',
        },
      },
    },
  },
}

module.exports = vueConfig;