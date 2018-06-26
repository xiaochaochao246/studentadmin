var express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/login');
});
router.post('/signin',(req,res,next)=>{
  var username=req.body.username;
  var pwd=req.body.pwd;
  MongoClient.connect(DB_STR,(err,db)=>{
    if(err){
      res.send(err);
        return
    }
    var c=db.collection("users")
     c.find({username:username,pwd:pwd}).toArray((err,docs)=>{
         if(err){
             res.send(err);
             return;
         }
         if(docs.length){
           req.session.isLogin=true;
           res.redirect('/admin')
         }else {
           res.redirect('/admin/users')
         }
     })
  })
});
router.get('/logout',(req,res)=>{
  req.session.isLogin=null;
  res.redirect('/admin/users');
})
module.exports = router;
