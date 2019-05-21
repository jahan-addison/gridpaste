var slider = require('./slider');

function getCookie(name) {
  var cookieValue = null
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
      }
    }
  }
  return cookieValue
}

module.exports = function(App) {
  var $html;
  $(function() {
    $('.share').click(function() {
      if (Object.isFrozen(App)) {
        var done;
        if (typeof $html !== 'undefined') {
          slider($html, 230, 'auto', '#application', $('#transform'));           
          return;
        }
        slider($(this).next().html(), 230, 'auto', '#application', $('#transform')); 
        $('#application').on('click', '.submit', function() {
          var $paste = App.getRecorded.map(function(e) {
            delete e.command; // we no longer need constructors
            return e;
          });
          var data   = {
            title: $('input.title:last').val(),
            paste: $paste,
            csrfmiddlewaretoken: getCookie('csrftoken'),
          };
          console.log(JSON.stringify(data))
          $('.close-slider').click();
          $.ajax({
            url: 'paste/',
            type: 'POST',
            headers:{
              "X-CSRFToken": getCookie('csrftoken')
            },
            // data: data,
            data: JSON.stringify(data),
            contentType: "application/json",
            complete: function(token) {
              $html = ['<div class="misc-done">',
                '<label for="url">The URL!</label><input type="text" name="url" class="inside url" value="',
                document.location.href + 'pastes/' + token.responseJSON.token,
                '" />',
                '</div>'
              ].join('');
              $('#application').addClass('shared');
              slider($html, 250, 'auto', '#application', $('#transform'));
            }
          });
        });
      }
    })
  });
}