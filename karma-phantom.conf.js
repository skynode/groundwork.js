/*global module, require */
var base = require('./karma-base.conf.js');

// Karme configuration for a single run on PhantomJS
module.exports = function(config) {
  // Browsers to run
  base.browsers = ['PhantomJS'];

  // Run once
  base.singleRun = false;

  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
  // config.LOG_INFO || config.LOG_DEBUG
  base.logLevel = config.LOG_INFO;

  config.set(base);
};
