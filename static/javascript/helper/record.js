module.exports = function(App) {
  $(function() {
    $('.start-record').click(function() {
      $('.clear').click();
      App.startRecording();
      $(this).html('Recording').addClass('dim');
      $(this).unbind();
    });
    $('.end-record').click(function() {
      if (!App.isRecording) {
        return;
      }
      $('.share').removeClass('hidden');
      App.stopRecording();
      $('#application').addClass('off'); // turn subscriptions off 
      $(this)
        .html('Finished')
        .addClass('finished')
        .prev()
        .html('Start Record');
      $(this).unbind();
      Object.freeze(App); // we're done
      $('.delete_').addClass('hidden');
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