
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { env: req.env,
    session: req.session });
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
