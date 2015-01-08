/* by rafælcastrocouto */
/*jslint browser: true, sloppy: true*/
/*global $*/

$.cookie.json = true;

var $feed = $('.feed'),
  $edit = $('.edit'),
  feedmode = 'welcome';

var loadFeed = function (feedList) {
  $edit.text('Edit').prop('disabled', true);
  feedmode = 'feed';
  location.hash = feedmode;
  $('<div>').addClass('article').text('Loading...').appendTo($feed);
  $.get('/json', 'feedList=' + JSON.stringify(feedList), function (json) {
    $feed.empty();
    $edit.prop('disabled', false);
    var data = JSON.parse(json);
    data.sort(function (a, b) {
      var aDate = new Date(a.published),
        bDate = new Date(b.published);
      return bDate - aDate;
    });
    data.forEach(function (article) {
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
    });
  });
};

var addItem = function (container, url) {
  var item = $('<div>').addClass('item').appendTo(container);
  $('<span>').text(url).appendTo(item);
  $('<button>').text('✗').attr('title', 'Delete').appendTo(item).click(function () {
    $(this).parent().remove();
  });
};

var editFeed = function () {
  $feed.empty();
  var newList,
    container = $('<div>').addClass('article editfeed').appendTo($feed);
  $('<input>').attr('placeholder', 'Paste your feed link here').appendTo(container);
  $('<button>').text('✓').attr('title', 'Add').appendTo(container).click(function () {
    var url = $('.editfeed input').val();
    addItem(container, url);
  });
  if (feedmode === 'welcome') {
    $('<p>').text('Welcome, please customize your feed list').prependTo(container);
    newList = [
      'http://chrome.blogspot.com/atom.xml',
      'http://blog.nodejs.org/feed',
      'https://github.com/blog/all.atom',
      'http://blog.jquery.com/feed',
      'http://scriptogr.am/rafaelcastrocouto/feed'
    ];
  } else { newList = $.cookie('nodefeed').feedList; }
  newList.forEach(function (url) {
    addItem(container, url);
  });
  feedmode = 'edit';
  location.hash = feedmode;
  $edit.text('Done');
};

$edit.click(function () {
  if (feedmode === 'edit') {
    var newList = [];
    $('.editfeed div span').each(function () {
      newList.push($(this).text());
    });
    $.cookie('nodefeed', {feedList: newList});
    loadFeed(newList);
  } else if (feedmode === 'feed') {
    editFeed();
  }
});

$(function () {
  var saved = $.cookie('nodefeed');
  if (saved && saved.feedList && saved.feedList.length) {
    loadFeed(saved.feedList);
  } else {
    editFeed();
  }
});
