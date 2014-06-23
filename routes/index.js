
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { env: req.env,
    session: req.session });
};

/*
 * GET paste
 */

 var Paste = require ('../environment/pastes/pastes');

exports.show = function(req, res) {
  Paste.findOne({"id": req.params.id}, {"paste._id":0}, function(error, paste) {
    if (!paste) {
      // todo: better page
      res.send(404, "Paste ID does not exist!");
    } else {
     res.render('show.html', { 
      env:     req.env,
      session: req.session,
      paste:   paste });
    }
  });
};

/*
 * GET login
 */

exports.login = function(req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('login.html', { env: req.env });
  }
};

/* 
 * GET register
 */

exports.register = function(req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('register.html', { env: req.env });
  }
};


/*
 * GET logout
 */

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
}
