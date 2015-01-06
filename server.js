/* by rafælcastrocouto */
/*jslint node: true, sloppy: true*/

var express = require('express'),
  feedRead = require('feed-read'),
  host = process.env.HOST || 'localhost',
  port = process.env.PORT || 5000,
  app = express();

app.get('/json', function (req, res) {
  var list = JSON.parse(req.param('feedList')),
    listStart = 0,
    listEnd = list.length,
    data = [];
  list.forEach(function (url) {
    feedRead(url, function (err, articles) {
      if (!err) {
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
        res.send(JSON.stringify([{
          content: 'Internal error' + err,
          title: 'Error',
          published: new Date(),
          author: 'nodefeed'
        }]));
      }
    });
  });
});
app.use(express['static']('public'));
app.listen(port, host);

