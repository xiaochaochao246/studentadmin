let express = require("express");
let MongoClient = require("mongodb").MongoClient;
const DB_STR = "mongodb://localhost:27017/StudentAdmin";

let router = express.Router();

router.get('/',(req,res,next)=>{
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return
        }
        let c=db.collection("students");
        if(req.session.islog){
            let stuID = req.session.user[0].stuID;
            c.find({stuID}).toArray((err,docs)=>{
                if(err){
                    res.send(err);
                    return;
                }
                res.render('home/about',{users:docs[0]})
            })
        }
    })
});
module.exports = router;