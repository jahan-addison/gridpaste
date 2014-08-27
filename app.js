var express    = require('express')
  , expressValidator = require('express-validator')
  , routes     = require('./routes')
  , user       = require('./routes/user')
  , paste      = require('./routes/paste')
  , http       = require('http')
  , swig       = require('swig')
  , path       = require('path')
  , Sequelize  = require('./environment/sequelize')
  , Mongoose   = require('./environment/mongoose')
  , flash      = require('express-flash')
  , paginate   = require('express-paginate')
  , MongoStore = require('connect-mongo')(express); 


var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'swig');
    app.set('env',  process.env.NODE_ENV || 'production');
    app.engine('html', swig.renderFile);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(expressValidator({}));
    app.use(express.cookieParser());
    app.use(express.session({
      secret:  require('./config').secret,
      cookie: {
        expires: 2629740000        
      },
      store:   new MongoStore({ db: Mongoose.db})
    }));
    app.use(paginate.middleware(10));
    app.use(flash());
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(express.static(path.join(__dirname, 'public')));
});

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',           routes.index);
app.get('/login',      routes.login);
app.get('/logout',     routes.logout);
app.get('/register',   routes.register);
app.get('/examples',   paste.examples);
app.get('/pastes',     paste.list);
app.get('/delete/:id', paste.remove)
app.get('/:id',        paste.show);
app.post('/login',     user.login);
app.post('/register',  user.register);
app.post('/edit/:id',  paste.edit);
app.post('/paste',     paste.action);

Sequelize
  .sequelize
  .sync({ force: false })
  .complete(function(err) {
    if (err) {
      throw err
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
  });
