module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/userApi': {
        target: 'http://api.sorting.com',
        ws:true,
        changeOrigin:true,
        pathRewrite: {
          "^/userApi": ""
      }
      },
    }
  }
}
