/*global module, require */

/**
 * Base Karma test runner
 */
var exec = require('child_process').execSync;
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var tag = exec('git describe --always --tag');

// Presets and plugins in query form for regular loaders
var loaderQuery = 'presets[]=es2015&presets[]=stage-0&plugins[]=transform-runtime';

// Override default sourcemap so that it's Karma friendly
webpackConfig.devtool = 'inline-source-map';

// No debug logs from groundwork.js in test
webpackConfig.plugins = [
  new webpack.DefinePlugin({
    __LOG__: false,
    TAG: JSON.stringify(tag.toString())
  })
];

module.exports = {
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['jasmine-ajax', 'jasmine'],

  // list of files / patterns to load in the browser
  files: [
    'test/test.js'
  ],

  // list of files to exclude
  exclude: [
  ],

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    'test/test.js': ['webpack', 'sourcemap'],
    'src/*.js': ['eslint']
  },

  eslint: {
    stopOnError: true,
    stopOnWarning: false
  },

  webpack: webpackConfig,

  plugins: [
    require('karma-jasmine-ajax'),
    require('karma-jasmine'),
    require('karma-webpack'),
    require('karma-chrome-launcher'),
    require('karma-firefox-launcher'),
    require('karma-safari-launcher'),
    require('karma-phantomjs-launcher'),
    require('karma-sourcemap-loader'),
    require('karma-eslint')
  ],

  webpackMiddleware: {
    stats: {
      colors: true
    }
  },

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['dots'],

  // web server port
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false
};
