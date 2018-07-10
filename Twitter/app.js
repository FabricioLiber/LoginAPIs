var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/*config variaveis*/
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');

/*config passport*/
passport.use(new Strategy({
	consumerKey: 'UBkW8KpQLjgZCpUyP5SfxW9OK',
	consumerSecret: 'zfDaXTRjoQxhRN3CNMzPjkd4Up9B6eQJjKdCmZjGtY4cIQWpOw',
	callbackURL: 'http://localhost:3000/twitter/return'
},function (token, tokenSecret, profile, callback){
  return callback(null, profile);
}));

passport.serializeUser(function(user, callback){
	callback(null, user);
})

passport.deserializeUser(function(obj, callback){
	callback(null, obj);
})



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*config session*/
app.use(session({
	secret: 'whatever',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session())
//
app.get('/', function(req, res){
	res.render('index',{user: req.user})
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter',{
	failureRedirect:'/'
}), function(req,res) {
	res.redirect('/')
})

module.exports = app;
