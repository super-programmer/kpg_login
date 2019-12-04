module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75, // 换算的基数
            propList: ['*'],
            selectorBlackList:['.cube-']
          }),
        ],
      },
    },
  },
  productionSourceMap: false,
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        // querystring: 'querystring-browser'
      }
    }
  }
};
