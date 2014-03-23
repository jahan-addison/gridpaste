
/**
 * Module dependencies.
 */

var express = require('express')
  , expressValidator = require('express-validator')
  , routes = require('./routes')
  , user = require('./routes/user')
  , register = require('./routes/register')
  , http = require('http')
  , swig = require('swig')
  , path = require('path')
  , db = require('./database');

var app = express();

db.connect();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'swig');
    app.engine('html', swig.renderFile);
    app.use(function(req, res, next){
        req.db = db;
        next();
    });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(expressValidator({}));
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/register', register.action);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
