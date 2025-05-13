module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    hot: true,
    port: 3000,
    open: true
  }
}; 