
var $prices = $('.mod-detail-price .d-content .price .value');

var prices = [];
$prices.each(function () {
  prices.push(+$(this).text());
});

var colors = [];
var $colors = $('.mod-detail-purchasing .list-leading .unit-detail-spec-operator');
$colors.each(function () {
  var colorStr = $(this).attr('data-unit-config');
  var colorJSON = JSON.parse(colorStr);
  colors.push(colorJSON.name);
});

var sizes = [];
var $sizes = $('.mod-detail-purchasing-multiple .obj-sku .table-sku td.name span');
$sizes.each(function () {
  sizes.push($(this).text())
});

var $pic = $('.vertical-img .box-img[trace=largepic]');
var picURL = $pic.attr('href');

var $title = $('.mod-detail-title .d-title')
var title = $title.text();

ipc.send('alibaba.results.detail', {
  url: location.href,
  data: {
    prices: prices,
    colors: colors,
    sizes: sizes,
    picURL: picURL,
    title: title
  }
})
