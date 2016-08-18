var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(path.join(__dirname, '/public/index.html'), 'utf8', function(err, data) {
    if (err) { throw err; }
    exports.headers['Content-Type'] = 'text/html';
    exports.sendResponse(res, data);
  });
};

exports.collectData = function(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    //console.log('collectData data: ', data);
    callback(data.slice(4));
    // edit: parse + data.url?
  });
};

exports.handleData = function(req, res, url) {
  // logic for checking archives, reading, returning results
  //console.log('url: ',url);
  archive.isUrlArchived(url, function(exists) {
    if (exists) {
      //console.log('url is archived');
      fs.readFile(path.join(archive.paths.archivedSites, url), 'utf8', function(err, data) {
        if (err) { throw err; }
        exports.headers['Content-Type'] = 'text/html';
        exports.sendResponse(res, data, 302);
      }); 
    } else {
      archive.isUrlInList(url, function(inList) {
        if (inList) {
          //console.log('url is not archived but in list');
          fs.readFile(path.join(__dirname, '/public/loading.html'), 'utf8', function(err, data) {
            if (err) { throw err; }
            exports.headers['Content-Type'] = 'text/html';
            exports.sendResponse(res, data);
          });
        } else {
          console.log('adding url to list');
          archive.addUrlToList(url, function(err) {
            //console.log('made it into addURLtoList function callback');
            exports.sendResponse(res, url, 302);
          });
        }
      });
    }
  });
};

exports.sendResponse = function (res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, exports.headers);
  res.end(data);
};


// As you progress, keep thinking about what helper functions you can put here!




/// handle data outline /// 
    //if urlisarchived
      //redirect
    //else
      //check list
      //if yes
        //redirect to loading
      //else add to list