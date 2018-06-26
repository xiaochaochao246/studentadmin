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
            res.send(err)
            return;
        }
        var c=db.collection("proInfo")
        c.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('profession/pro_list',{data:docs});
        });
    })
});

router.get('/add',(req,res,next)=>{
    res.render('profession/pro_add')
});

router.post('/add',(req,res,next)=>{
    let proID=req.body.proID;
    let proDiscip=req.body.proDiscip;
    let proDep=req.body.proDep;
    let proName=req.body.proName;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("proInfo")

        col.insert({proID,proDiscip,proDep,proName},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("添加专业成功了<a href='/profession/list'>查看专业</a>")
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
        var c=db.collection("proInfo")
        // console.log(ObjectId(id))
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err)
                return
            }
            db.close();
            res.render('profession/pro_edit',{data:docs[0],id: id})
        })
    })
})
router.post('/edit',(req,res,next)=>{
    let proID=req.body.proID;
    let proDiscip=req.body.proDiscip;
    let proDep=req.body.proDep;
    let proName=req.body.proName;
    let id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        let c=db.collection("proInfo")
        c.updateOne({_id:ObjectId(id)},{proID,proDiscip,proDep,proName},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("更新成功了<a href='/profession/list'>返回专业列表</a>")
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
        var c=db.collection("proInfo")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/profession/list')
        })
    })
});

router.post('/getproID',(req,res)=>{
    let proID=req.body.proID;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("proInfo");
        col.find({proID}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            console.log(result);
            res.render('profession/pro_list',{data:result})
        })
    })
})

module.exports=router;