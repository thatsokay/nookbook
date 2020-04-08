const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  stats: 'minimal',
  entry: {
    app: './app/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [{test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/}],
  },
  plugins: [
    new HtmlWebpackPlugin({inject: true, template: './public/index.html'}),
  ],
}
