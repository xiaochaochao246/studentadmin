let express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let ObjectId=require("mongodb").ObjectId;
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/register');
});

router.post('/register',(req,res,next)=>{
    let username=req.body.username;
    let pwd=req.body.pwd;
    let phone=req.body.phone;
    let idNum=req.body.idNum;
    let confirmpwd = req.body.confirmpwd;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return
        }
        let col =db.collection("users");
        if(username!=''&&pwd!=''&&phone!=''&&idNum!=''){
            col.find({username},{_id:0}).toArray((err,obj) =>{
                if(err){
                    res.send(err);
                }else{
                    console.log(obj);
                    if(obj.length==0){
                        if(pwd == confirmpwd){
                            col.insert({username,pwd,phone,idNum},(err,docs)=>{
                                if(err){
                                    res.send(err);
                                    return;
                                }
                                res.send("注册成功了<a href='/admin/users'>请登录</a>")
                            })
                        }else{
                            res.send("前后密码不一致<a href='/register'>请重新注册</a>")
                        }
                    }else{
                        res.send("用户名已存在<a href='/register'>请重新注册</a>")
                    }
                }
            })
        }else{
            res.send("请输入全部信息<a href='/register'>重新注册</a>")
        }
    })
})


module.exports = router;