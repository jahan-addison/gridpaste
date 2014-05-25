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
  }, 320, function() {
    $block.find('input:first').focus();
  });
  $('.slider input').keydown( function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if(key == 13) {
      e.preventDefault();
      if ($block.find('.button').length == 2) {
        $block.find('.button').eq(1).click();        
      } else {
        $block.find('.button').click();
      }
    }
  });
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