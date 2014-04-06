module.exports = function(content, width, height, top) {
  if ($('.slider').length) {
    return false;
  }
  $block = $('<div class="slider"> <div class="close-slider">x</div> </div>');
  $block.append(content)
    .appendTo('body')
    .css({
      width:  width  || 230,
      height: height || 200,
      position: 'absolute',
      top: top       || $('#elements').offset().top,
      left: -width   || -230
    })
  $block.animate({
    left: 0
  }, 400);
  $('.close-slider').click(function() {
    $(this).parent()
      .find('*')
      .unbind('click');
    $block.animate({
      left: -width || -230
    }, 400, function() {
      $(this).remove();
    });
  });
};