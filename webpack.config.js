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
        options: {esModule: false},
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({inject: true, template: './public/index.html'}),
  ],
}
