// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

// exports.HtmlFetcher = function() {
var results = [];

archive.readListOfUrls(function(array) {

  _.each(array, function(url) {
    archive.isUrlArchived(url, function(exists) {

      if (!exists) {
        results.push(url);
        archive.downloadUrls(results);
        console.log('results of urls to be archived: ', results);
      }
    });
  });
});

  
// };

