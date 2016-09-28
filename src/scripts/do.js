
var $links = $('.app-offerGeneral .offer-list-row .image a');
var $pageCount = $('.page-count');
var $offerCount = $('.offer-count');

var doJob = function () {
  var links = [];
  $links.each(function () {
    var link = $(this);
    links.push(link.attr('href'))
  });
  ipc.send('alibaba.results', links)
}

doJob();
