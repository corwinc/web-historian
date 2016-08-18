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
    } else {
      archive.isUrlArchived(req.url, function(exists) { 
        if (exists) {
          console.log('isArchived works!');
          fs.readFile(path.join(archive.paths.archivedSites, req.url), 'utf8', function(err, data) {
            if (err) { throw err; }
            httpHelpers.headers['Content-Type'] = 'text/html';
            sendResponse(res, data);
          }); 
        } else {
          sendResponse(res, null, 404);
        }
      });
    }
  } else if (req.method === 'POST') {
    console.log('received POST request');
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    console.log(data);
    //if urlisarchived
      //redirect
    //else
      //check list
      //if yes
        //redirect to loading
      //else add to list

    archive.isUrlArchived(req.url, function(exists) {
      if (exists) {
        console.log('url is archived');
        fs.readFile(path.join(archive.paths.archivedSites, req.url), 'utf8', function(err, data) {
          if (err) { throw err; }
          httpHelpers.headers['Content-Type'] = 'text/html';
          sendResponse(res, data);
        }); 
      } else {
        archive.isUrlInList(req.url, function(inList) {
          if (inList) {
            console.log('url is not archived but in list');
            fs.readFile(path.join(__dirname, '/public/loading.html'), 'utf8', function(err, data) {
              if (err) { throw err; }
              httpHelpers.headers['Content-Type'] = 'text/html';
              sendResponse(res, data);
            });
          } else {
            console.log('adding url to list');
            archive.addUrlToList(req.url, function(err) {
              console.log('made it');
            });
          }
        });
      }
    });



    // archive.addUrlToList(req.url, function() {

    // })
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
