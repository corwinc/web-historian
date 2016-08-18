var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!



exports.handleRequest = function (req, res) {

  //////// GET ///////////
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(path.join(__dirname, '/public/index.html'), 'utf8', function(err, data) {
        if (err) { throw err; }
        httpHelpers.headers['Content-Type'] = 'text/html';
        httpHelpers.sendResponse(res, data);
      });
    } else if (req.url === '/styles.css') {
      fs.readFile(path.join(__dirname, '/public/styles.css'), 'utf8', function(err, data) {
        if (err) { throw err; }
        httpHelpers.headers['Content-Type'] = 'text/css';
        httpHelpers.sendResponse(res, data);
      });
    } else {
      archive.isUrlArchived(req.url, function(exists) { 
        if (exists) {
          fs.readFile(path.join(archive.paths.archivedSites, req.url), 'utf8', function(err, data) {
            if (err) { throw err; }
            httpHelpers.headers['Content-Type'] = 'text/html';
            httpHelpers.sendResponse(res, data);
          }); 
        } else {
          httpHelpers.sendResponse(res, null, 404);
        }
      });
    }


  /////////// POST ////////  
  } else if (req.method === 'POST') {
    // Note: want to write a conditional for handling extraneous post requests that aren't the url submission
    httpHelpers.collectData(req, function(entry) {
      httpHelpers.handleData(req, res, entry);
    });



  ///// OPTIONS /////
  } else if (req.method === 'OPTIONS') {

  }

  // res.end(archive.paths.list);
};
