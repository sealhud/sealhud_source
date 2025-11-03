const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  output: {
    filename: 'sealhud.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // Imagens e outros arquivos estáticos, exceto os ícones em /img/icons/
      {
        test: /\.(png|jpg|jpeg|gif|woff2?|eot|ttf|otf|wav|cur|svg)$/i,
        exclude: path.resolve(__dirname, 'src/img/icons'), // ignora os SVGs em /icons
        type: 'asset/resource',
        generator: {
          filename: 'files/[name][ext]', // coloca tudo em /dist/files/
        },
      },

      // CSS global / SCSS
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/i,
        oneOf: [
          // CSS Modules
          {
            test: /\.module\.scss$/i,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                  },
                },
              },
              'sass-loader',
            ],
          },
          // SCSS normal
          {
            exclude: /\.module\.scss$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          },
        ],
      },
      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'sealhud.css',
    }),
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT || '8070'),
      'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN || ''),
      'process.env.RELEASE': JSON.stringify(process.env.RELEASE || ''),
      'process.env.SHARED_MEMORY_VERSION_MAJOR':
      JSON.stringify(process.env.SHARED_MEMORY_VERSION_MAJOR || '0'),
      'process.env.SHARED_MEMORY_VERSION_MINOR': JSON.stringify(process.env.SHARED_MEMORY_VERSION_MINOR || '0'), 
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,
  },
};