const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


module.exports = [{
  entry: {
    common: "./src/common.js",
    index: "./src/index.js",
    settings: "./src/settings.js"
  },
  // mode: 'development',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'assets'),
    //publicPath: "./",
    filename: '[name].bundle.js',
  },
  externals: [function (context, request, cb) {
    if (/^[a-z\-0-9]+$/.test(request)) {
      cb(null, 'commonjs ' + request);
      return;
    }
    cb();
  }],
  plugins: [new MiniCssExtractPlugin()],
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ],
  },
  module: {
    rules: [{
      test: /\.m?js$/, exclude: /(node_modules|bower_components)/, use: {
        loader: 'babel-loader', options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },]
  }
}]
