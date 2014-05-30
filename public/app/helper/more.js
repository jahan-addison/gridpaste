module.exports = function() {
  $(function() {
    var points = 3;
    $('#application').on('click', '.more', function() {
      if ($(this).parent().find('.inside').length == 3) {
        points = 3;
      }
      points++;
      var more = '<label for="point'+ points + '">Point ' + points + ' (x,y):</label><input type="text" name="point'+ points +'" class="inside" value="0.0,0.0" />';
      $(this).before(more);
    });
  });
};