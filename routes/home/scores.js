let express = require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR = "mongodb://localhost:27017/StudentAdmin"

var router = express.Router();
router.get('/',(req,res,next)=>{
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let coll=db.collection("scores");
        if(req.session.islog){
            let stuID = req.session.user[0].stuID;
            coll.find({stuID}).toArray((err,docs)=>{
                if (err) {
                    res.send(err);
                    return;
                }
                if(docs[0]==null){
                    res.send("无成绩信息<a href='/student'>返回</a>")
                }
                res.render('home/scores', {users: docs});
            })
        }
    })
});

router.post('/getcourseYear',(req,res,next)=>{
    let courseYear=req.body.courseYear;
    console.log(courseYear);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("scores");
        if(courseYear!=''){
            col.find({courseYear}).toArray((err,result)=>{
                if (err) {
                    res.send(err);
                    return;
                }
                console.log(result);
                if(result.length==0){
                    res.send("输入学年不存在<a href='/scores'>请重新输入</a>")
                }else{
                    res.render('home/scores',{users:result})
                }
            })
        }else{
            res.send("没有输入任何内容<a href='/scores'>请输入学年</a>")
        }
    })
});

module.exports = router;