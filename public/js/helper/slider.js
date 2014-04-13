module.exports = function(content, width, height, source, top) {
  $block = $('<div class="slider"> <div class="close-slider">x</div> </div>');
  $block.append(content)
    .appendTo(source || 'body')
    .css({
      width:  width  || 230,
      height: height || 200,
      position: 'absolute',
      top: top.offset().top  || $('#elements').offset().top,
      left: -width   || -230
    })
  $block.animate({
    left: 0
  }, 320);
  $('.close-slider').click(function() {
    $(this).parent()
      .find('*')
      .unbind('click');
    $block.animate({
      left: -width || -230
    }, 320, function() {
      $(this).remove();
    });
  });
};