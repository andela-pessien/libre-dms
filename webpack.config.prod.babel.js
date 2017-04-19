import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';

dotenv.load();

export default {
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new ExtractTextPlugin('static/css/main.css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },
      minimize: true,
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'client/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ],
  entry: [
    'babel-polyfill',
    './client/index.jsx'
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist/public'),
    publicPath: '/',
    filename: 'static/js/main.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader?sourceMap',
        include: path.join(__dirname, 'client'),
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-2']
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader?sourceMap',
        include: path.join(__dirname, 'client'),
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-2', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap!csso-loader!sass-loader'
        })
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap!csso-loader'
        })
      },
      {
        test: /\.ico$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader',
        query: {
          name: 'static/fonts/[name].[ext]'
        }
      },
    ]
  }
};
