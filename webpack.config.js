var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var module_dir = `${__dirname}/node_modules`;
const path = require('path');

module.exports = {
  target: 'node',
  entry: './server/server.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env']],
        },
      },
    ],
  },
  resolveLoader: {
    modules: [__dirname + '/node_modules'],
  },
};
