const path = require('path');
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, "index.js"),
  mode: process.env.NODE_ENV || "development",
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
    extensions: ["", ".js", ".jsx", ".ts", ".tsx"]
  },
  devServer: {
    contentBase: path.join(__dirname),
    open: true,
    hot: true
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: (content) => svgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
  ],
  performance: {
    hints: "warning",
    // Calculates sizes of gziped bundles.
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith(".js.gz");
    },
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [new UglifyJsPlugin({
      test: /\.js(\?.*)?$/i,
      exclude: /\/node_modules/,
    })],
  },
  ignoreWarnings: [/Failed to parse source map/]
};