/* by rafælcastrocouto */
/*jslint node: true, sloppy: true*/

var express = require('express'),
  feedRead = require('feed-read'),
  port = process.env.PORT || 5000,
  app = express();
app.set('port', port);
app.use(express['static'](__dirname + '/public'));
app.get('/json', function (req, res) {
  var list = JSON.parse(req.param('feedList')),
    listStart = 0,
    listEnd = list.length,
    data = [];
  list.forEach(function (url) {
    feedRead(url, function (error, articles) {
      if (!error) {
        listStart += 1;
        var articlesStart = 0, articlesEnd = articles.length;
        articles.forEach(function (article) {
          data.push(article);
          articlesStart += 1;
          if (listStart === listEnd && articlesStart === articlesEnd) {
            res.send(JSON.stringify(data));
          }
        });
      } else {
        console.log(error);
        res.send(JSON.stringify([{
          content: 'Error: ' + err,
          title: 'Error',
          published: new Date(),
          author: 'server.js',
          feed: {
            name: 'nodefeed'
          }
        }]));
      }
    });
  });
});
app.listen(app.get('port'), function() {
  console.log("Node app is running:" + app.get('port'));
});

