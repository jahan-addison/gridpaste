var slider = require('./slider');

module.exports = function(App) {
  $(function() {
    $('.share').click(function() {
      if (Object.isFrozen(App)) {
        var done;
        slider($(this).next().html(), 230, 'auto', '#application', $('#transform')); 
        $('#application').on('click', '.submit', function() {
          var $paste = App.getRecorded.map(function(e) {
            delete e.command; // we no longer need constructors
            return e;
          });
          var data   = {
            title: $('input.title:last').val(),
            paste: $paste
          };
          $('.close-slider').click();
          $.ajax({
            url: '/paste',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            complete: function(token) {
              var $html = ['<div class="misc-done">',
                '<label for="url">The URL!</label><input type="text" name="url" class="inside url" value="',
                document.location.href + token.responseJSON.token,
                '" />',
                '</div>'
              ].join('');
              slider($html, 250, 'auto', '#application', $('#transform'));
            }
          });
        });
      }
    })
  });
}