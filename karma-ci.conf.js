/*global module, require */
var base = require('./karma-base.conf.js');

// Karma configuration for Travis CI
module.exports = function(config) {
  // Browsers to run
  base.browsers = ['Firefox', 'PhantomJS'];

  // Run once
  base.singleRun = true;

  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
  // config.LOG_INFO || config.LOG_DEBUG
  base.logLevel = config.LOG_INFO;

  config.set(base);
};
