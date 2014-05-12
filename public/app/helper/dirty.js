module.exports = function(App) {
  $(window).on('beforeunload', function() {
    if (!$('#application').hasClass('shared')) {
      if (App.length) {
        return "You have an unsaved grid paste! Are you sure you want to leave?";
      }
    }
  });
};