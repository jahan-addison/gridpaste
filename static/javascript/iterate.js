/* The Iterator */

var Iterator = function(List) {
  this.step = 0;
  this.list = List;
};

Iterator.prototype.hasNext = function() {
  return this.step < this.list.length;
};

Iterator.prototype.next    = function() {
  return this.list[this.step++];
};

Iterator.prototype.hasPrev = function() {
  return this.step > 0;
};

Iterator.prototype.prev    = function() {
  return this.list[--this.step];
};

module.exports = Iterator;