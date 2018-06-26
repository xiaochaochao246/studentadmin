let express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/stulogin');
});
router.post('/signin',(req,res,next)=>{
    let stuID=req.body.stuID;
    let stuPwd=req.body.stuPwd;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return
        }
        let c=db.collection("students");
        c.find({stuID,stuPwd}).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            if(docs.length){
                req.session.islog=true;
                req.session.user=docs;
                res.redirect('/student');
            }else {
                res.redirect('/home/stuusers')
            }
        })
    })
});
router.get('/logout',(req,res)=>{
    req.session.islog=null;
    req.session.user=null;
    res.redirect('/home/stuusers')
});
module.exports = router;
