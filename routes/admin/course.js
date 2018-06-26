let express=require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let ObjectId=require("mongodb").ObjectId;

var router=express.Router();
//显示课程
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
        var c=db.collection("courseInfo")
        c.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('courseInfo/course_list',{data:docs});
        });
    })
});

router.get('/add',(req,res,next)=>{
    res.render('courseInfo/course_add')
});

router.post('/add',(req,res,next)=>{
    let courseID=req.body.courseID;
    let courseName=req.body.courseName;
    let courseYear=req.body.courseYear;
    let courseThe=req.body.courseThe;
    let courseExp=req.body.courseExp;
    let courseCot=req.body.courseCot;
    let courseScore=req.body.courseScore;
    let course={
        courseID,
        courseName,
        courseYear,
        courseThe,
        courseExp,
        courseCot,
        courseScore
    };
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("courseInfo")

        col.insert(course,(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("添加课程成功了<a href='/course/list'>查看课程</a>")
            }
        })
    })
})

router.get('/edit',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var c=db.collection("courseInfo")
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return
            }
            db.close();
            res.render('courseInfo/course_edit',{data:docs[0],id: id})
        })
    })
})
router.post('/edit',(req,res,next)=>{
    let courseID=req.body.courseID;
    let courseName=req.body.courseName;
    let courseYear=req.body.courseYear;
    let courseThe=req.body.courseThe;
    let courseExp=req.body.courseExp;
    let courseCot=req.body.courseCot;
    let courseScore=req.body.courseScore;
    let time = new Date();
    let id=req.query.id;
    let course={
        courseID,
        courseName,
        courseYear,
        courseThe,
        courseExp,
        courseCot,
        courseScore,
        time
    };
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        let c=db.collection("courseInfo")
        c.updateOne({_id:ObjectId(id)},course,(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("更新成功了<a href='/course/list'>返回课程列表</a>")
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
        var c=db.collection("courseInfo")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/course/list')
        })
    })
});

router.post('/getcourseID',(req,res)=>{
    let courseID=req.body.courseID;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("courseInfo");
        col.find({courseID}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            console.log(result);
            res.render('courseInfo/course_list',{data:result})
        })
    })
});

module.exports=router;