var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');

var app = express();

app.use(session({
    resave:true,
    saveUninitialized:false,
    secret:'secret'
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set("view engine","ejs");
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', users);
app.use('/users', users);
app.use('/login', users);
app.use('/register', users);
app.use('/forum', users);
app.use('/signIn', users);
app.use('/signUp', users);
app.use('/initialize', users);
app.use('/poster', users);
app.use('/edit/:summary', users);
app.use('/delete/:summary', users);
app.use('/editPost', users);
app.use('/replyinitialize', users);
app.use('/replyposter', users);
app.use('/content/:summary', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        message:err.message,
        error:{}
    });
});

module.exports = app;