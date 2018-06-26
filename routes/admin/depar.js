let express=require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let ObjectId=require("mongodb").ObjectId;

var router=express.Router()
//显示分类
router.get('/',(req,res,next)=>{
    let {pageSize=5} = req.query;
    let i = req.query.page;
    page = parseInt(i);
    pageSize = parseInt(pageSize);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("deparInfo")
        c.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('depar/depar_list',{data:docs});
        });
    })
});

router.get('/add',(req,res,next)=>{
    res.render('depar/depar_add')
});

router.post('/add',(req,res,next)=>{
    let depID=req.body.depID;
    let depAdr=req.body.depAdr;
    let depTel=req.body.depTel;
    let depName=req.body.depName;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("deparInfo")

        col.insert({depID,depAdr,depTel,depName},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("添加院系成功了<a href='/depars/list'>查看院系</a>")
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
        var c=db.collection("deparInfo")
        // console.log(ObjectId(id))
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err)
                return
            }
            db.close();
            res.render('depar/depar_edit',{data:docs[0],id: id})
        })
    })
})
router.post('/edit',(req,res,next)=>{
    let depID=req.body.depID;
    let depAdr=req.body.depAdr;
    let depTel=req.body.depTel;
    let depName=req.body.depName;
    let id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        let c=db.collection("deparInfo")
        c.updateOne({_id:ObjectId(id)},{depID,depAdr,depTel,depName},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("更新成功了<a href='/depars/list'>返回院系列表</a>")
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
        var c=db.collection("deparInfo")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/depars/list')
        })
    })
});
router.post('/getdepID',(req,res)=>{
    let depID=req.body.depID;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        let col=db.collection("deparInfo");
        col.find({depID}).toArray((err,result)=>{
            if (err) {
                res.send(err);
                return;
            }
            console.log(result);
            res.render('depar/depar_list',{data:result})
        })
    })
})

module.exports=router;