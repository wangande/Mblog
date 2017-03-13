var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var Cookies = require("cookies");
var User = require('./models/users');
var ejs = require('ejs'); //import ejs
var app = express();


app.set('port', process.env.PORT || 3000)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
   req.cookies = new Cookies(req, res);
   req.userInfo = {};
   if (req.cookies.get("userInfo")) {
       try {
           req.userInfo = JSON.parse(req.cookies.get("userInfo"));
           User.findOne({"_id": req.userInfo._id}).then(function (userInfo) {
               req.userInfo.isAdmin =  Boolean(userInfo.isAdmin);
               next();
           });
       } catch (e) {
            next();
       }
   } else {
       next();
   }
});

app.use('/admin', require("./routes/admin"));
app.use('/api', require("./routes/api"));
app.use('/', require("./routes/main"));

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
    res.render('error');
});


mongoose.connect("mongodb://127.0.0.1:27017/blog", function(err) {
    if (err) {
        console.log("db connect failed!");
    } else {
        console.log("db connect success!");
        app.listen(app.get('port'), function() {
            console.log('Express server listening on port ' + app.get('port'))
        })
    }
});

// module.exports = app;