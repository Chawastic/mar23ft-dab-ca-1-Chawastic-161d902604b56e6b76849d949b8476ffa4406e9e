require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var db = require("./models");
var populateAnimals = require('./services/populateAnimals');
var populateUsers = require('./services/populateUsers');
db.sequelize.sync({ force: false })
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var animalsRouter = require('./routes/animals');
var speciesRouter = require('./routes/species');
var temperamentRouter = require('./routes/temperament');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Configuration
app.use(require('express-session')({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Passport local strategy for login
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await db.User.findOne({ where: { username } });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

app.use('/', indexRouter);
app.use('/animals', animalsRouter);
app.use('/species', speciesRouter);
app.use('/temperament', temperamentRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.sequelize.sync()
  .then(async () => {
    console.log('Database and tables synchronized!');
    await populateAnimals();
    await populateUsers();
  })
  .catch((err) => console.error('Error synchronizing database and tables: ', err));

module.exports = app;
