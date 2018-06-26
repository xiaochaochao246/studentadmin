let express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/modify');
});

router.post('/modify',(req,res,next)=>{
    let username=req.body.username;
    let pwd=req.body.pwd;
    let phone=req.body.phone;
    let idNum=req.body.idNum;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return
        }
        let c = db.collection("users");
        c.find({username}).toArray((err,data)=>{
            if(err){
                res.send(err);
                return;
            }
            if(data.length!=0 && username!=''){
                let col =db.collection("users");
                col.find({username}).toArray((err,obj) =>{
                    if(err){
                        res.send(err);
                        return;
                    }
                    console.log(obj[0]);
                    if (phone == obj[0].phone && phone!='') {
                        if (idNum == obj[0].idNum && idNum!='') {
                            col.update({username: obj[0].username}, {$set: {pwd}}, (err, result) => {
                                if (err) {
                                    res.send(err);
                                    return;
                                }
                                res.send("密码修改成功<a href='/admin/users'>请登录</a>")
                            })
                        }else{
                            res.send("身份证号错误<a href='/modify'>请重新输入</a>")
                        }
                    }else{
                        res.send("手机号错误<a href='/modify'>请重新输入</a>")
                    }
                })
            }else{
                res.send("用户名不存在<a href='/modify'>请重新输入</a>")
            }
        })
    })
});

module.exports = router;