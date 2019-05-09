const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')
require("@babel/register");
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules : [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|mp3|ogg)$/,
        use: [
          {
           loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true
    })
  ],
  devtool: 'source-map',
};
module.exports = config;