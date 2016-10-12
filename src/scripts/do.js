
var $links = $('.app-offerGeneral .offer-list-row .image a');
var $pageCount = $('.page-count');
var $offerCount = $('.offer-count');

var doJob = function () {
  var links = [];
  $links.each(function () {
    var link = $(this);
    links.push(link.attr('href'))
  });
  var data = {
    offerCount: $offerCount.text(),
    pageCount: $pageCount.text(),
    links: links
  }
  ipc.send('alibaba.results', data)
  console.log(data)
}

doJob();
