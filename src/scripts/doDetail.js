
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

var amounts = [];
var $amounts = $('.mod-detail-price .amount .value');
$amounts.each(function () {
  amounts.push($(this).text());
});

var $pic = $('.vertical-img .box-img[trace=largepic]');
var picURL = $pic.attr('href');

var $title = $('.mod-detail-title .d-title')
var title = $title.text();

var $postage = $('.mod-detail-postage .obj-carriage .value');
var postage = $postage.text();

ipc.send('alibaba.results.detail', {
    prices: prices,
    colors: colors,
    sizes: sizes,
    amounts: amounts,
    picURL: picURL,
    title: title,
    postage: postage,
    url: location.href
})
