
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { env: req.env });
};

/*
 * GET paste
 */

 var Paste = require ('../environment/pastes/pastes');

exports.show = function(req, res) {
  Paste.findOne({id: req.params.id}, function(error, paste) {
    res.send(paste);
      });
};