let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

//引入前台页面模块
let users = require('./routes/admin/users');
let stuUsers=require('./routes/home/studentusers');
let student = require('./routes/home/students');
let scores = require('./routes/home/scores');
let head = require('./routes/home/header');
let person = require('./routes/home/about');
//引入后台页面模块

let admin=require('./routes/admin/admin');
let cats=require('./routes/admin/teachers');
let article=require('./routes/admin/students');
let about=require('./routes/admin/about');
let register=require('./routes/admin/register');
let modify=require('./routes/admin/modify');
let stumodify = require('./routes/home/modify');
let depar=require('./routes/admin/depar');
let profession=require('./routes/admin/profession');
let classess=require('./routes/admin/class');
let course=require('./routes/admin/course');
let score = require('./routes/admin/score');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require('ejs').__express);
app.set('view engine', 'html');
//载入session模块
var session = require("express-session")
app.use(session({
    secret:'blog',
    resave:false,
    saveUninitialized:true,
    cookie:{}
}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/home')));
app.use(express.static(path.join(__dirname, 'public/admin')));
//登录页面
app.use('/admin/users',users);
//前台页面路由
app.use('/', users);
app.use('/users', users);
app.use('/home/stuusers',stuUsers);
app.use('/head',head);

app.use('/about',isLogin);
app.use('/about',person);

app.use('/student',isLogin);
app.use('/student',student);

app.use('/scores',isLogin);
app.use('/scores',scores);

app.use('/register',register);
app.use('/modify',modify);
app.use('/stumodify',stumodify);

//后台页面路由
app.use('/admin',checkLogin);
app.use('/admin',admin);

app.use('/teachers/cats',checkLogin);
app.use('/teachers/cats',cats);

app.use('/students/posts',checkLogin);
app.use('/students/posts',article);

app.use('/admin/about',checkLogin);
app.use('/admin/about',about);

app.use('/depars/list',checkLogin);
app.use('/depars/list',depar);

app.use('/profession/list',checkLogin);
app.use('/profession/list',profession);

app.use('/class/list',checkLogin);
app.use('/class/list',classess);

app.use('/course/list',checkLogin);
app.use('/course/list',course);

app.use('/score/list',checkLogin);
app.use('/score/list',score);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

// 编写一个中间件 用来判断是否有登录 访问的权限
function checkLogin(req,res,next){
    if(!req.session.isLogin){
        res.redirect('/admin/users')
    }
    next()
}

function isLogin(req,res,next){
    if(!req.session.islog){
        res.redirect('/home/stuusers')
    }
    next()
}
module.exports = app;
