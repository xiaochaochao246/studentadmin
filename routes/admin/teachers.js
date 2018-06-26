let express=require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let ObjectId=require("mongodb").ObjectId;

let router=express.Router()
//显示分类
router.get('/',(req,res,next)=>{
    let {pageSize=6} = req.query;
    let i = req.query.page;
    page = parseInt(i);
    pageSize = parseInt(pageSize);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        let c=db.collection("teachers")
        c.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('teachers/teachers_list',{data:docs});
        });
    })
});

router.get('/add',(req,res,next)=>{
    res.render('teachers/teachers_add')
});

router.post('/add',(req,res,next)=>{
    let teaID=req.body.teaID;
    let teaUsername=req.body.teaUsername;
    let teaTel=req.body.teaTel;
    let teaSex=req.body.teaSex;
    let teaRecord=req.body.teaRecord;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        let col =db.collection("teachers")
        col.insert({teaID,teaUsername,teaTel,teaSex,teaRecord},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.redirect("/teachers/cats")
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
        var c=db.collection("teachers");
        // console.log(ObjectId(id))
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return
            }
            db.close();
            res.render('teachers/teachers_edit',{data:docs[0],id: id})
        })
    })
})
router.post('/edit',(req,res,next)=>{
    let teaID=req.body.teaID;
    let teaUsername=req.body.teaUsername;
    let teaTel=req.body.teaTel;
    let teaSex=req.body.teaSex;
    let teaRecord=req.body.teaRecord;
    let id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        let c=db.collection("teachers")
        c.updateOne({_id:ObjectId(id)},{teaID,teaUsername,teaTel,teaSex,teaRecord},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.redirect("/teachers/cats")
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
        var c=db.collection("teachers")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/teachers/cats')
        })
    })
});
router.post('/getteaId',(req,res)=>{
    let teaID=req.body.teaID;
    //console.log(stuID);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("teachers");
        col.find({teaID}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            console.log(result);
            res.render('teachers/teachers_list',{data:result})
        })
    })
})

module.exports=router;