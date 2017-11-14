const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const project = require('./package.json');

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
const DASHBOARD = ENV === 'dashboard';
const DEV = ENV === 'development' || DASHBOARD;
const PROD = ENV === 'production';
const STAGING = ENV === 'staging';
const ONLINE = PROD || STAGING;
const outDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const mainFile = path.resolve(srcDir, 'app.js');

const appProperties = require('./config/backoffice.config.json');

const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || []
const when = (condition, config) => condition ? ensureArray(config) : [];

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  mangle: {
    except: ['cb', '__webpack_require__'],
    screw_ie8 : true,
    keep_fnames: true
  }
});

const faviconPlugin = new FaviconsWebpackPlugin({
  logo: path.resolve(srcDir, 'favicon.png'),
  emitStats: true,
  statsFilename: 'iconstats-[hash].json',
  persistentCache: true,
  inject: true,
  background: '#fff',
  title: 'pwa-backoffice',
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: true,
    favicons: true,
    firefox: true,
    opengraph: false,
    twitter: true,
    yandex: false,
    windows: true
  }
});

const devImageRules = {
  test: /\.(png|gif|jpe?g)$/,
  use: [
    {
      loader: 'file-loader'
    }
  ]
};

const prodImageRules = {
  test: /\.(png|gif|jpe?g)$/,
  use: [
    {
      loader: 'url-loader',
      query: {
        limit: 8192,
        name: 'images/[name].[hash].[ext]'
      }
    },
    {
      loader: 'image-webpack-loader',
      query: {
        bypassOnDebug: true,
        progressive: true,
        gifsicle:{
          interlaced: true
        },
        optipng: {
          optimizationLevel: 7
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]
};

module.exports = {
  entry: {
    app: mainFile,
    vendor: [...Object.keys(project.dependencies)]
  },
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: DEV ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
    sourceMapFilename: DEV ? '[name].bundle.map' : '[name].[chunkhash].bundle.map',
    chunkFilename: DEV ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
  },
  resolve: {
    modules: [srcDir, nodeModulesDir],
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.html$/, // or /[^index]\.html$/
        exclude: /index\.html$/,
        use: [
          'html-loader',
          'html-minifier-loader'
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'ng-annotate-loader',
            options: {
              add: true,
              map: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /main\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader?sourceMap',
          use: [
            {
              loader: 'css-loader',
              query: {
                sourceMap: true,
                minimize: { safe: true }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
                sourceMapContents: true
              }
            }
          ]
        })
      },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 8192, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 8192, mimetype: 'application/font-woff' } },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      ...when(DEV, devImageRules),
      ...when(ONLINE, prodImageRules)
    ]
  },
  devtool: (PROD || STAGING) ? 'source-map' : 'cheap-eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      auth0: 'auth0-js',
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: (DEV),
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: `${srcDir}/index.html`,
      baseUrl: baseUrl,
      minify: ONLINE ? {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true
      } : false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      auth0CLientID: JSON.stringify(PROD ? appProperties.prod.auth0.clientID : (STAGING ? appProperties.staging.auth0.clientID : appProperties.dev.auth0.clientID)),
      auth0Domain: JSON.stringify(PROD ? appProperties.prod.auth0.domain : (STAGING ? appProperties.staging.auth0.domain : appProperties.dev.auth0.domain)),
      auth0CallbakUrl: JSON.stringify(PROD ? appProperties.prod.auth0.callbackUrl : (STAGING ? appProperties.staging.auth0.callbackUrl : appProperties.dev.auth0.callbackUrl)),
      apiBaseUrl: JSON.stringify(PROD ? appProperties.prod.api.baseUrl : (STAGING ? appProperties.staging.api.baseUrl : appProperties.dev.api.baseUrl))
    }),
    ...when(DASHBOARD, new DashboardPlugin()),
    ...when(ONLINE, [faviconPlugin, uglifyPlugin])
  ],
  devServer: {
    port: 8082,
    host: 'localhost',
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300
    }
  }
};
