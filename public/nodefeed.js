/* by rafælcastrocouto */
/*jslint browser: true, sloppy: true, vars: true*/
/*global $*/

$(window).load(function () {

  $.cookie.json = true;

  var saved = $.cookie('nodefeed'),
    isSaved = (saved && saved.feedList && saved.feedList.length),
    reading = (location.hash === 'loading' || location.hash === 'feed'),
    $feed = $('.feed'),
    $edit = $('.edit'),
    feedmode = 'welcome';

  var defaultList = [
    'http://chrome.blogspot.com/atom.xml',
    'http://blog.nodejs.org/feed',
    'https://github.com/blog/all.atom',
    'http://blog.jquery.com/feed',
    'http://scriptogr.am/rafaelcastrocouto/feed'
  ];

  var addArticle = function (article) {
    var container = $('<div>').addClass('article').appendTo($feed),
      title = $('<a>').addClass('title').attr('href', article.link).appendTo(container),
      meta = $('<p>').addClass('meta').appendTo(container),
      content = $('<div>').addClass('content').html(article.content).appendTo(container),
      date = new Date(article.published),
      formatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
      link = $('<a>').attr('href', article.feed.link).appendTo(meta);
    $('<span>').addClass('date').text(formatedDate).prependTo(container).attr('title', date.toUTCString());
    $('<h1>').text(article.title).appendTo(title);
    $('<span>').text(article.feed.name).appendTo(link);
    $('<span>').addClass('author').text(article.author).appendTo(meta);
  };

  var sortFeed = function (json) {
    var data = JSON.parse(json);
    feedmode = 'feed';
    location.hash = feedmode;
    $feed.empty();
    $edit.prop('disabled', false);
    data.sort(function (a, b) {
      var aDate = new Date(a.published),
        bDate = new Date(b.published);
      return bDate - aDate;
    });
    data.forEach(addArticle);
  };

  var loadFeed = function (feedList) {
    feedmode = 'loading';
    location.hash = feedmode;
    $feed.empty();
    $edit.text('Edit').prop('disabled', true);
    $('<div>').addClass('article').text('Loading...').appendTo($feed);
    if (!feedList) {
      if (isSaved) {
        feedList = saved.feedList;
      } else {
        feedList = defaultList;
      }
    }
    $.get('/json', 'feedList=' + JSON.stringify(feedList), sortFeed);
    $.cookie('nodefeed', {feedList: feedList}, {expires: 365});
  };

  var delItem = function () {
    $(this).parent().remove();
  };

  var addItem = function (url) {
    var input, item = $('<div>').addClass('item').appendTo($('.editfeed'));
    if (typeof url !== 'string') {
      input = $('.editfeed input');
      url = input.val();
      input.val('');
    }
    $('<span>').text(url).appendTo(item);
    $('<button>').text('✗').attr('title', 'Delete').appendTo(item).click(delItem);
  };

  var editFeed = function () {
    feedmode = 'edit';
    location.hash = feedmode;
    $feed.empty();
    $edit.text('Done');
    var newList,
      container = $('<div>').addClass('article editfeed').appendTo($feed);
    $('<input>').attr('placeholder', 'Paste your feed link here').appendTo(container);
    $('<button>').text('✓').attr('title', 'Add').appendTo(container).click(addItem);
    if (isSaved) {
      newList = $.cookie('nodefeed').feedList;
    } else {
      $('<p>').text('Welcome, please customize your feed list').prependTo(container);
      newList = defaultList;
    }
    newList.forEach(addItem);
  };

  $edit.click(function () {
    if (feedmode === 'edit') {
      var newList = [];
      $('.editfeed div span').each(function () {
        newList.push($(this).text());
      });
      loadFeed(newList);
    } else if (feedmode === 'feed') {
      editFeed();
    }
  });

  if (reading || isSaved) { loadFeed(); } else { editFeed(); }

});