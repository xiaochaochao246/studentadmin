let express = require("express");
let MongoClient = require("mongodb").MongoClient;
const DB_STR = "mongodb://localhost:27017/StudentAdmin";

let router = express.Router();
//显示学生列表
router.get('/', (req, res, next) => {
    //连接数据库
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        //对数据库进行相关操作
        let c1 = db.collection("students");
        if(req.session.islog){
            let stuID = req.session.user[0].stuID;
            c1.find({stuID}).toArray((err, docs) => {
                if (err) {
                    res.send(err);
                    return;
                }
                console.log(docs);
                //数据和视图一起渲染
                res.render('home/students',{users: docs});
            });
        }

    });
});

module.exports = router;