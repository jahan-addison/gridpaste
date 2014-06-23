var Paste            = require ('../environment/pastes/pastes'),
    randomstring     = require('randomstring');0

/*
 * POST action
 */

exports.action = function(req, res) {
  req.checkBody('title', 'Please give a title!').notEmpty();

  var errors = req.validationErrors();
    if (errors && errors.length > 0) {
    res.send(errors[0].msg);
    return;
  }
    var token = randomstring.generate(8);
    new Paste({id: token, 
        title: req.body.title, 
        user:  req.session.user || 'anonymous', 
        paste: req.body.paste}
    ).save(function(err) {
      if (err) throw err;
      res.send({token: token});
    });      
};

/*
 * GET list
 */

exports.list = function(req, res) {
  if (!req.session.loggedIn) {
    res.redirect('/');
  }
  Paste.paginate({ user: req.session.user  }, 1, 10, function(error, pageCount, paginatedResults, itemCount) {
    if (error) {
      req.flash('error', "You don't have any saved pastes!");
    } else {
      console.log('Pages:', pageCount);
      console.log(paginatedResults);
       res.render('pastes.html', {
        results:   paginatedResults,
        pageCount: pageCount,
        itemCount: itemCount
      });
    }
  });

};