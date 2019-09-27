const path = require('path');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const JSLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
};

const CSSLoader = {
  test: /\.(sa|sc|c)ss$/,
  exclude: /node_modules/,
  use: [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: __dirname + '/stylesheets/',
        sourceMap: true
      }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ],
};

const MyMiniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'stylesheets/[name].css',
  chunkFilename: '[id].css'
});

module.exports = {
  entry: {
    application: ['./js/application.js', './css/application.scss']
  },
  module: {
    rules: [
      JSLoader,
      CSSLoader
    ]
  },
  plugins: [
    MyMiniCssExtractPlugin,
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:5100/)
        // through BrowserSync
        proxy: {
          target: "http://localhost:5100",
          proxyReq: [
            function(proxyReq) {
              proxyReq.setHeader('X-Forwarded-Host', 'localhost:3000');
            }
          ]
        }
      }
    )
  ],
  output: {
    filename: 'javascripts/[name].js',
    path: path.resolve(__dirname, 'public')
  }
};
