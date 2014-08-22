module.exports = function(content, width, height, source, top, slide) {
  var animate = {};
  var $block = $('<div class="slider"> <div class="close-slider">x</div> </div>');
  console.log(slide);
  var slideCSS = (slide && slide == 'top') ? {
      width:  width  || 230,
      height: height || 200,
      position: 'absolute',
      top: -height || -200,
      right: width
    } : {
      width:  width  || 230,
      height: height || 200,
      position: 'absolute',
      top: top.offset().top  || $('#elements').offset().top,
      left: -width   || -230
    };
  $block.append(content)
    .appendTo(source || 'body')
    .css(slideCSS)
  animate[slide || 'left'] = 0;
  $block.animate(animate, 370, function() {
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
     animate[slide || 'left'] = (slide == 'top') ? -height || -230 : -width || -230;
    $block.animate(animate, 370, function() {
      $(this).remove();
    });
  });
};