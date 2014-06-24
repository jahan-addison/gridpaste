var Paste            = require ('../environment/pastes/pastes'),
    randomstring     = require('randomstring');

/*
 * GET paste
 */

exports.show = function(req, res) {
  Paste.findOne({"id": req.params.id}, {"paste._id":0}, function(error, paste) {
    if (!paste) {
      // final route -- throw 404
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
  Paste.paginate({ user: req.session.user  }, req.query.page, req.query.limit, function(error, pageCount, paginatedResults, itemCount) {
    if (error) return next(error);
    res.render('pastes.html', {
      host:      req.get('host'),
      req:       req,
      pastes:    paginatedResults,
      pageCount: pageCount,
      itemCount: itemCount
    });
  }, {sortBy: {_id: -1}});
};

/*
 * GET delete
 */

exports.remove = function(req, res) {
  if (!req.session.loggedIn) {
    res.redirect('/');
  }
  Paste.findOne({"id": req.params.id}, {"paste._id":0}, function(error, paste) {
    if (error) return next(error);
    if(paste.user === req.session.user) {
      Paste.findOneAndRemove({"id": req.params.id}, {"paste._id":0}, function(error) {
        if (error) {
          return next(error);
        } else {
          res.redirect('/pastes');
        }
      });
    } else {
      res.redirect('/');
    }
  });
}