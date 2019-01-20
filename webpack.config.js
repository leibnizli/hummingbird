var path = require('path');
var fs = require('fs');
module.exports = [{
  name: "develop",
  entry: "./app/src/index.js",
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'app', 'build'),
    publicPath: "./build/",
    filename: "bundle.js"
  },
  externals: [
    function (context, request, cb) {
      if (/^[a-z\-0-9]+$/.test(request)) {
        cb(null, 'commonjs ' + request);
        return;
      }
      cb();
    }
  ],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}]
