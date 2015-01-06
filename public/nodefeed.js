/* by rafælcastrocouto */
/*jslint browser: true, sloppy: true*/
/*global $*/

var $feed = $('.feed');
var feedList = [
  'http://olav.com.br/feed',
  'http://chrome.blogspot.com/atom.xml',
  'http://feeds.feedburner.com/GoogleOperatingSystem',
  'http://www.umsabadoqualquer.com/feed',
  'http://www.willtirando.com.br/rss',
  'http://www.bifter.co.uk/rss.xml',
  'http://www.nerfnow.com/index.xml',
  'http://scriptogr.am/rafaelcastrocouto/feed'
];

$('<div>').addClass('article').text('Loading...').appendTo($feed);

$.get('/json', 'feedList=' + JSON.stringify(feedList), function (json) {
  $feed.empty()
  var data = JSON.parse(json); console.log(data);
  data.sort(function (a, b) {
    var aDate = new Date(a.published), bDate = new Date(b.published);
    return bDate - aDate;
  });
  data.forEach(function (article) {
    var container = $('<div>').addClass('article').appendTo($feed),
      title = $('<a>').attr('href', article.link).appendTo(container),
      meta = $('<p>').addClass('meta').appendTo(container),
      content = $('<div>').addClass('content').html(article.content).appendTo(container),
      date = new Date(article.published),
      formatedDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear(),
      link = $('<a>').attr('href', article.feed.link).appendTo(meta);
    $('<span>').addClass('date').text(formatedDate).prependTo(container).attr('title', date.toUTCString());
    $('<h1>').text(article.title).appendTo(title);
    $('<span>').text(article.feed.name).appendTo(link);
    $('<span>').addClass('author').text(article.author).appendTo(meta);     
  });
});
