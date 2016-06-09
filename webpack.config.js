/*global module, require, process, __dirname */

var BannerPlugin = require('webpack/lib/BannerPlugin');
var exec = require('child_process').execSync;
var path = require('path');
var webpack = require('webpack');

var NODE_ENV = JSON.stringify(process.env.NODE_ENV);
var BUILD = JSON.stringify(process.env.BUILD);

var releaseTag = process.env.PACKAGE_VERSION;
var tag = (releaseTag) ?
      releaseTag :
      exec("git describe --always --tag | tr -d '[[:space:]]'");

var date = new Date();
var banner = 'groundwork.js ' + tag + ' | (c) ' + date.getUTCFullYear() + ' Timshel / The Groundwork - BSD Licence https://opensource.org/licenses/BSD-3-Clause';

// Base filename of compiled JS lib
var filename = 'groundwork';

// Default globals to be used during compilation
var defineObj = {
  'process.env': {
    'NODE_ENV': NODE_ENV
  },
  __LOG__: true,
  TAG: JSON.stringify(tag.toString())
};

// Webpack plugins array
var plugins = [];

// All builds but the .min version have logging turned on
if (BUILD === '"min"') {
  defineObj.__LOG__ = false;
  defineObj['process.env'] = {
    'NODE_ENV': JSON.stringify('production')
  };
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  filename = filename + '.min';
}

// Push DefinePlugin into the array to setup global vars
plugins.push(new webpack.DefinePlugin(defineObj));

// Add banner to the distributable
plugins.push(new BannerPlugin(banner));

// Presets and plugins in query form for regular loaders
var loaderQuery = 'presets[]=es2015&presets[]=stage-0&plugins[]=transform-runtime';

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    libraryTarget: 'umd',
    library: 'Groundwork',
    path: path.join(__dirname, 'dist'),
    filename: filename + '.js',
    sourceMapFilename: '[file].map'
  },
  plugins: plugins,
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js'],
    alias: {
      'axiosUtils': path.join(__dirname, 'node_modules', 'axios', 'lib', 'utils.js'),
      'lodash-es': path.join(__dirname, 'node_modules', 'lodash-es')
    }
  },
  module: {
    loaders: [
      {
        test: /node_modules\/credit-card/,
        loader: 'babel-loader?' + loaderQuery,
        include: __dirname
      },
      {
        test: /node_modules\/lodash-es/,
        loader: 'babel-loader?' + loaderQuery,
        include: __dirname
      },
      {
        test: /node_modules\/reach/,
        loader: 'babel-loader?' + loaderQuery,
        include: __dirname
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel',
        query: {
          presets: ['stage-0', 'es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
};
