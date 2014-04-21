module.exports = function(App) {
  $(function() {
    $('.start-record').click(function() {
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
    });
  });
};