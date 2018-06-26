let express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/StudentAdmin"

let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('home/modify');
});

router.post('/stumodify',(req,res,next)=>{
    let stuID=req.body.stuID;
    let pwd=req.body.stuPwd;
    let idNum=req.body.stuTel;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return
        }
        let c = db.collection("students");
        c.find({stuID}).toArray((err,data)=>{
            if(err){
                res.send(err);
                return;
            }
            if(data.length!=0 && stuID!=''){
                let col = db.collection("students");
                col.find({stuID}).toArray((err,obj)=>{
                    if(err){
                        res.send(err);
                        return;
                    }
                    console.log(obj[0]);
                    if(idNum==obj[0].stuTel && idNum!=''){
                        col.update({stuID: obj[0].stuID}, {$set: {stuPwd:pwd}}, (err, result) => {
                            if (err) {
                                res.send(err);
                                return;
                            }
                            res.send("密码修改成功<a href='/home/stuusers'>请登录</a>")
                        })
                    }else{
                        res.send("身份证号错误<a href='/stumodify'>请重新输入</a>")
                    }
                })
            }else{
                res.send("该学生不存在<a href='/stumodify'>请重新输入</a>")
            }
        })
    })
});

module.exports = router;