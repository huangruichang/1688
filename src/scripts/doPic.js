
var $images = $('.mod-bigview .nav-tabs li')
var images = []
$images.each(function () {
  images.push($(this).attr('data-img'))
})

ipc.send('alibaba.results.pics', {
  images: images
})
