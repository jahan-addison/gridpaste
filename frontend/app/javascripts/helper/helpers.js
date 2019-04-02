module.exports = function(App, board) {
  require('./more')  ();           // attach event to "more" button for polygon construction
  require('./undo')  (App);        // attach event to undo button
  require('./record')(App);        // attach event to record button
  require('./clear') (App);        // attach event to clear button
  require('./drag')  (board);      // attach event to drag
  require('./play')  (App, board); // attach event to UI play button after recording
  require('./share')    (App)    // attach event to share button
  require('./bindings') (App);   // attach keyboard bindings
  require('./mouse')    (board); // show coordinates at cursor
  require('./dirty')    (App);   // prevent 'dirty board' 
};
