const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const {GenerateSW} = require('workbox-webpack-plugin')
const path = require('path')
const fs = require('fs')

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  stats: 'minimal',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].js',
  },
  devServer: {
    contentBase: './build',
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        // Copied from CRA config.
        // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L453
        options: {
          customize: require.resolve(
            'babel-preset-react-app/webpack-overrides',
          ),
          presets: ['react-app'],
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        // No ES module so importing with `require` doesn't need `.default`.
        options: {outputPath: 'img', esModule: false},
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({inject: true, template: './public/index.html'}),
    new CopyPlugin(
      fs
        .readdirSync('public')
        .filter((file) => file !== 'index.html')
        .map((file) => ({from: `public/${file}`, to: file})),
    ),
    new GenerateSW(),
  ],
}
