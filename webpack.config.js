const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const context = __dirname + '/src';

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  context,
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    contentBase: 'build',
    port: 3000,
    hot: true
  },
  module: {
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      filename: 'index.html'
    })
  ]
};
