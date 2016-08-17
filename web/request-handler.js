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
  console.log(__dirname);
  if (req.method === 'GET') {
    //console.log(req.url);
    if (req.url === '/') {
      fs.readFile(path.join(__dirname, '/public/index.html'), 'utf8', function(err, data) {
        // if (data) {
        if (err) { throw err; }
          console.log('data: ', data);
          httpHelpers.headers['Content-Type'] = 'text/html';
          sendResponse(res, data);
        //}

        // if (err) {
        //   console.log('threw error with get request to /');
        // }

      });
    } else if (req.url === '/styles.css') {
      console.log('sent css');
      fs.readFile(path.join(__dirname, '/public/styles.css'), 'utf8', function(err, data) {
        // if (err) {
        //   console.log('threw error with get request to /styles.css');
        // }
        httpHelpers.headers['Content-Type'] = 'text/css';
        sendResponse(res, data);
      });
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
