import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';

dotenv.load();

export default {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      jquery: path.join(__dirname, 'node_modules/jquery/dist/jquery'),
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'client/index.html')
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
  devServer: {
    publicPath: '/',
    compress: true,
    port: process.env.WEBPORT,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.APIPORT}`,
        secure: false
      }
    },
    clientLogLevel: 'none',
    hot: true,
    inline: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },
        {
          loader: 'expose-loader',
          options: 'window.jQuery'
        },
        {
          loader: 'expose-loader',
          options: '$'
        },
        {
          loader: 'expose-loader',
          options: 'window.$'
        }]
      },
      {
        test: require.resolve('materialize-css/js/velocity.min'),
        use: [{
          loader: 'expose-loader',
          options: 'window.Vel'
        }]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'client'),
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-2']
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'client'),
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-2', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
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
      }
    ]
  }
};
