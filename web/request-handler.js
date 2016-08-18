var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

var sendResponse = function (res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, httpHelpers.headers);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  console.log(req.url);
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(path.join(__dirname, '/public/index.html'), 'utf8', function(err, data) {
        if (err) { throw err; }
        httpHelpers.headers['Content-Type'] = 'text/html';
        sendResponse(res, data);
      });
    } else if (req.url === '/styles.css') {
      fs.readFile(path.join(__dirname, '/public/styles.css'), 'utf8', function(err, data) {
        if (err) { throw err; }
        httpHelpers.headers['Content-Type'] = 'text/css';
        sendResponse(res, data);
      });
    } else if (archive.isUrlArchived(req.url, function(exists) { 
      // return exists;
      console.log('isArchived works!');
      fs.readFile(path.join(archive.paths.archivedSites, req.url), 'utf8', function(err, data) {
        if (err) { throw err; }
        httpHelpers.headers['Content-Type'] = 'text/html';
        sendResponse(res, data);
      }); 
    })) {
      // var fixturePath = archive.paths.archivedSites + '/' + fixtureName;
      
    }
  } else if (req.method === 'POST') {
    console.log('received POST request');
    // var data = '';
    // req.on('data', function (chunk) {
    //   data += chunk;
    // });
    // httpHelpers.headers['Content-Type'] = 'application/json';
    // sendResponse(res, data);

  } else if (req.method === 'OPTIONS') {

  }

  // res.end(archive.paths.list);
};
