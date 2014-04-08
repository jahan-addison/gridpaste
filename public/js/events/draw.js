var slider    = require('../helper/slider'),
    element   = require('../board/element'),
    Rx        = require('../../components/rxjs/rxjs');

var $sources = $([
  '.circle',   '.angle',   '.arc',
  '.ellipse',  '.segment', '.line',
  '.parabola', '.polygon', '.point',
  '.text'
].join(' '));

// Obserable source
module.exports = Rx.Observable.fromEvent($sources, 'click');
