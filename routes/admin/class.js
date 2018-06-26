let express=require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let ObjectId=require("mongodb").ObjectId;

var router=express.Router()
//显示分类
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
        var c=db.collection("classInfo");
        c.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('classInfo/class_list',{data:docs});
        });
    })
});

router.get('/add',(req,res,next)=>{
    res.render('classInfo/class_add')
});

router.post('/add',(req,res,next)=>{
    let classID=req.body.classID;
    let classNum=req.body.classNum;
    let className=req.body.className;
    let classProid=req.body.classProid;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("classInfo")

        col.insert({classID,classNum,className,classProid},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("添加班级成功了<a href='/class/list'>查看班级</a>")
            }
        })
    })
})

router.get('/edit',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("classInfo")
        // console.log(ObjectId(id))
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err)
                return
            }
            db.close();
            res.render('classInfo/class_edit',{data:docs[0],id: id})
        })
    })
})
router.post('/edit',(req,res,next)=>{
    let classID=req.body.classID;
    let classNum=req.body.classNum;
    let className=req.body.className;
    let classProid=req.body.classProid;
    let id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        let c=db.collection("classInfo")
        c.updateOne({_id:ObjectId(id)},{classID,classNum,className,classProid},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("更新成功了<a href='/class/list'>返回班级列表</a>")
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
        var c=db.collection("classInfo")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/class/list')
        })
    })
});

router.post('/getclassID',(req,res)=>{
    let classID=req.body.classID;
    //console.log(stuID);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("classInfo");
        col.find({classID}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            console.log(result);
            res.render('classInfo/class_list',{data:result})
        })
    })
})
module.exports=router;