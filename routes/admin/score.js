let express = require("express");
let MongoClient = require("mongodb").MongoClient;
const DB_STR = "mongodb://localhost:27017/StudentAdmin";
let ObjectId = require("mongodb").ObjectId;

var router = express.Router();
router.get('/',(req,res,next)=>{
    let {pageSize=6} = req.query;
    let i = req.query.page;
    page = parseInt(i);
    pageSize = parseInt(pageSize);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var coll=db.collection("scores");
        coll.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err,docs)=>{
            if (err) {
                res.send(err);
                return;
            }
            res.render('score/score_list', {data: docs});
        })
    })
});

router.get('/add',(req,res,next)=>{
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        //在数据库中查找课程信息
        let c1 = db.collection("courseInfo");
        c1.find().toArray((err, courseInfo) => {
            if (err) {
                res.send(err);
                return;
            }
            let c2 = db.collection("teachers");
            c2.find().toArray((err,teachers)=>{
                if (err) {
                    res.send(err);
                    return;
                }
                res.render('score/score_add', {data1: courseInfo,data2:teachers})
            })
        })
    });
});

router.post('/add',(req,res,next)=>{
    let stuID=req.body.stuID;
    let stuUsername=req.body.stuUsername;
    let courseYear=req.body.courseYear;
    let courseName=req.body.courseName;
    let teacherName=req.body.teacherName;
    let theoryScore=req.body.theoryScore;
    let experimentScore=req.body.experimentScore;
    let ordinaryScore=req.body.ordinaryScore;
    let time =new Date();
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return
        }
        var col =db.collection("scores");
        col.insert({stuID,stuUsername,courseYear,
            courseName,theoryScore,experimentScore,ordinaryScore,teacherName,
            time,
            totalScore:theoryScore*0.8+experimentScore*0.1+ordinaryScore*0.1
        },(err,result)=>{
            if(err){
                res.send(err);
            }else {
                res.send("添加成绩成功了<a href='/score/list'>查看成绩</a>")
            }
        })
    })
})

router.get('/person', (req, res, next) => {
    var studenId = req.query.stuID;
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        var stu = db.collection("scores")
        stu.find({stuID: studenId}).toArray((err, stu) => {
            if (err) {
                res.send(err);
                return;
            }
            res.render('score/score_list', {data: stu});
        })
    })
});

router.get('/edit',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var c=db.collection("scores")
        // console.log(ObjectId(id))
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return
            }
            var col = db.collection("courseInfo")
            col.find().toArray((err,result)=>{
                if(err){
                    res.send(err);
                    return
                }
                let c2 = db.collection("teachers");
                c2.find().toArray((err,teachers)=> {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    db.close();
                    res.render('score/score_edit',{data:docs[0],course:result,teacher:teachers,id: id})
                })

            })

        })
    })
})

router.post('/edit',(req,res,next)=>{
    let stuID=req.body.stuID;
    let stuUsername=req.body.stuUsername;
    let courseYear=req.body.courseYear;
    let courseName=req.body.courseName;
    let teacherName=req.body.teacherName;
    let theoryScore=req.body.theoryScore;
    let experimentScore=req.body.experimentScore;
    let ordinaryScore=req.body.ordinaryScore;
    let time = new Date();
    let id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let c=db.collection("scores");
        c.update({_id:ObjectId(id)},{$set:{
                stuID,
                stuUsername,
                courseYear,
                courseName,
                teacherName,
                theoryScore,
                experimentScore,
                ordinaryScore,
                time,
                totalScore:theoryScore*0.8+experimentScore*0.1+ordinaryScore*0.1
        }},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("更新成功了<a href='/score/list'>返回成绩列表</a>")
            }
        })
    })
})

router.get('/delete',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var c=db.collection("scores")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/score/list')
        })
    })
});
router.post('/getStuId',(req,res)=>{
    let stuID=req.body.stuID;
    //console.log(stuID);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("scores");
        col.find({stuID}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            res.render('score/score_list',{data:result})
        })
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
        col.find({courseYear}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            res.render('score/score_list',{data:result})
        })
    })
});

module.exports = router;