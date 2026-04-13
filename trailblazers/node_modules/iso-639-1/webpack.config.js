const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// webpack configuration
let webpackConfig = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, `./build`),
    filename: '[name].js',
    library: 'ISO6391',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};

module.exports = webpackConfig;
