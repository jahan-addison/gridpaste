module.exports = function(App) {
  $(function() {
    $('.button.undo').click(function() {
      App.undoLastExecute();
      if(App.length === 0) {
        $(this).removeClass('visible');
      }
    });
  });
};