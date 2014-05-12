module.exports = function(App) {
  require('./more')  ();               // attach event to "more" button for polygon construction
  require('./undo')  (App);            // attach event to undo button
  require('./record')(App);            // attach event to record button
  require('./clear') (App);            // attach event to clear button
  require('./play')  (App, App.board); // attach event to UI play button after recording
  require('./share') (App)             // attach event to share button
};
