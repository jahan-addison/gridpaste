var express   = require('express')
  , expressValidator = require('express-validator')
  , routes    = require('./routes')
  , user      = require('./routes/user')
  , register  = require('./routes/register')
  , http      = require('http')
  , swig      = require('swig')
  , path      = require('path')
  , Sequelize = require('./environment/sequelize')
  , Mongoose  = require('./environment/mongoose')


var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'swig');
    app.set('env',  process.env.NODE_ENV || 'development');
    app.engine('html', swig.renderFile);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(expressValidator({}));
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(express.static(path.join(__dirname, 'public')));
});

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/register', register.action);

Sequelize
  .sequelize
  .sync({ force: true })
  .complete(function(err) {
    if (err) {
      throw err
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
  });
