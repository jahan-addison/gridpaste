module.exports = function(App) {
  $(function() {
    $('.start-record').click(function() {
      $('.clear').click();
      App.startRecording();
      $(this).html('Recording').addClass('dim');
      $(this).unbind();
    });
    $('.end-record').click(function() {
      App.stopRecording();
      $(this)
        .html('Finished')
        .addClass('finished')
        .prev()
        .html('Start Record');
      $(this).unbind();
      Object.freeze(App); // we're done
      $('.undo').removeClass('visible');
      $('.reset').show();
      $('.reset').click(function() {
        window.location.reload();
      });
      $('.clear').hide()
        .prev().show();
    });
  });
};