module.exports = function() {
  jQuery.fn.coord = function() {
    if (this.val()) {
      if (this.val().indexOf(',') !== -1) {
        return this.val().split(',')
          .map(function(e) {
            return parseFloat(e);
          });
      }
    }
  };
};
