
var $body = $('body')
var $pager = $('#sm-pagination')
var pageTotal = 0
var currentPage = 0
var PAGE_LIMIT = 60
var RETRY_LIMIT = 4



var scrollBody = function (callback) {
  return function () {
    $body.scrollTop($body[0].scrollHeight)
    callback && callback()
  }
}

if ($pager.size() > 0) {
  pageTotal = $pager.find('.sm-pagination').attr('data-total-page') || 0
}


var doJob = function () {
  var $link = $('.s-module-offerresult .sm-offer-photoLink.sw-dpl-offer-photoLink')
  var links = [];
  $link.each(function () {
    var link = $(this)
    links.push(link.attr('href'))
  })
  console.log(links)
  ipc.send('alibaba.results', links)
}

var retry = 0
var scrollBodyToBottom = scrollBody(function () {
  var $items = $('.s-module-offerresult .imgofferresult-mainBlock')
  if ($items.size() < PAGE_LIMIT) {
    retry++
    if (retry > RETRY_LIMIT) {
      doJob();
      return;
    }
    setTimeout(function () {
      scrollBodyToBottom()
    }, 500)
  } else {
    doJob();
  }
})

if (pageTotal > 0) {
  scrollBodyToBottom()
} else {

}
