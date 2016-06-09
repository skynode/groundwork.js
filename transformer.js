/*global require, process */

var filter = require('lodash/filter');
var first = require('lodash/head');
var fs = require('fs');
var last = require('lodash/last');
var map = require('map-stream');
var parse5 = require('parse5');
var utils = require('parse5-utils');
var vfs = require('vinyl-fs');

// New src for script tag
var newSource = last(process.argv);

// Parse the HTML, find the gwjs script tage and change its src attr
var parseHTML = function(payload, cb) {
  var html = payload.html;
  var parser = new parse5.ParserStream();

  parser.on('script', function(scriptElement, documentWrite, resume) {
    var attrs = parse5.treeAdapters.default.getAttrList(scriptElement);
    if (attrs.length) {
      var isGwjs = filter(attrs, {name: 'id'});
      if (isGwjs.length && first(isGwjs).value === 'gwjs') {
        // change the src attr
        utils.setAttribute(scriptElement, 'src', newSource);
      }
    }
    resume();
  });

  parser.on('finish', function() {
    cb(null, {
      path: payload.path,
      html: parse5.serialize(parser.document)
    });
  });

  parser.end(html);
};

// extract file path
var getPath = function(file, cb) {
  cb(null, file.path);
};

// read HTML and assemble a payload with file path
var readFile = function(filePath, cb) {
  fs.readFile(filePath, (err, data) => {
    if (err) throw err;

    var ret = {
      path: filePath,
      html: data.toString()
    };

    cb(null, ret);
  });
};

// Swap out original file with updated file
var writeFile = function(payload, cb) {
  var path = payload.path;
  var newPath = path + '.tmp';
  fs.writeFile(newPath, payload.html, function(err) {
    if (err) throw err;
    fs.unlinkSync(path);
    fs.renameSync(newPath, path);
    cb(null);
  });
};

// Get files and pipe through transforms
vfs.src(['./examples/**/*.html'])
  .pipe(map(getPath))
  .pipe(map(readFile))
  .pipe(map(parseHTML))
  .pipe(map(writeFile));
