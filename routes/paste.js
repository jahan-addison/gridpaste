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
 * GET examples
 */

exports.examples = function(req, res) {
  Paste.paginate({ user: 'examples'  }, { page: req.query.page, limit: req.query.limit}, function(error, result) {
    if (error) return next(error);
    res.render('examples.html', {
      host:      req.get('host'),
      req:       req,
      pastes:    result.docs,
      pageCount: result.page
    });
  }, {sortBy: {_id: -1}});
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
  Paste.paginate({ user: req.session.user  }, { page: req.query.page, limit: req.query.limit}, function(error, results) {
    if (error) return next(error);
    res.render('pastes.html', {
      host:      req.get('host'),
      req:       req,
      pastes:    results.docs,
      pageCount: results.page
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

/*
 * POST edit
 */

exports.edit = function(req, res) {
  if (!req.session.loggedIn) {
    res.json({result: 'failed'});
  }
  Paste.findOne({"id": req.params.id}, {"paste._id":0}, function(error, paste) {
    if (error || !paste) return res.json({result: 'failed'});
    if(paste.user === req.session.user) {
      Paste.update({_id: paste._id}, {title: req.body.title}, function(error) {
        if (error) {
          res.json({result: 'failed'});
        } else {
          res.json({result: 'success'});
        }
      });
    } else {
      res.json({result: 'failed'});
    }
  });
};
