let express = require("express");
let MongoClient = require("mongodb").MongoClient;
const DB_STR = "mongodb://localhost:27017/StudentAdmin";
let ObjectId = require("mongodb").ObjectId;
let router = express.Router();

//显示学生列表
router.get('/', (req, res, next) => {
    let {pageSize=6} = req.query;
    let i = req.query.page;
    page = parseInt(i);
    pageSize = parseInt(pageSize);
    //连接数据库
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        //对数据库进行相关操作
        let c1 = db.collection("students");
        c1.find().sort({_id:-1}).limit(pageSize).skip((page-1)*pageSize).toArray((err, docs) => {
            if (err) {
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('students/students_list', {data: docs});
        });
    })
});
//添加学生列表
router.get('/add', (req, res) => {
    //连接MongoDB数据库
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        //在数据库中查找班级信息
        let c1 = db.collection("classInfo");
        c1.find().toArray((err, classInfo) => {
            if (err) {
                res.send(err);
                return;
            }
            //在数据库中查找专业信息
            let c2 = db.collection("proInfo");
            c2.find().toArray((err, pro) => {
                if (err) {
                    res.send(err);
                    return;
                }
                //在数据库中查找院系信息
                let c3 = db.collection("deparInfo");
                c3.find().toArray((err, depar) => {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    //将数据渲染到前端页面
                    res.render('students/students_add', {data1: classInfo, data2: pro, data3: depar})
                })

            })
        })
    });

})

//修改学生
router.get('/edit', (req, res, next) => {
    //接受前端传来的id
    let id = req.query.id;
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        let c = db.collection("students");
        c.find({_id: ObjectId(id)}).toArray((err, docs) => {
            if (err) {
                res.send(err);
                return
            }
            //修改学生所在班级
            let col1 = db.collection("classInfo");
            col1.find().toArray((err, result1) => {
                if (err) {
                    res.send(err);
                    return;
                }
                //修改学生专业
                let col2 = db.collection("proInfo");
                col2.find().toArray((err, result2) => {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    //修改学生院系
                    let col3 = db.collection("deparInfo");
                    col3.find().toArray((err, result3) => {
                        if (err) {
                            res.send(err);
                            return;
                        }
                        db.close();
                        res.render('students/students_edit', {
                            data: docs[0],
                            data1: result1,
                            data2: result2,
                            data3: result3,
                            id: id
                        })
                    })
                })
            })
        })
    })
})
//修改学生信息

router.post('/edit', (req, res, next) => {
    //获取前端传来的数据
    let id = req.query.id;
    let stuID = req.body.stuID;
    let stuUsername = req.body.stuUsername;
    let stuPwd = req.body.stuPwd;
    let stuSex = req.body.stuSex;
    let stuTel = req.body.stuTel;
    let className = req.body.className;
    let stuPro = req.body.stuPro;
    let stuColl = req.body.stuColl;
    let contentText = req.body.contentText;
    let time = new Date();
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        let c = db.collection("students")
        c.update({_id: ObjectId(id)}, {
            //更新数据库
            $set: {
                stuID,
                stuUsername,
                stuPwd,
                stuSex,
                stuTel,
                className,
                stuPro,
                stuColl,
                contentText,
                time
            }
        }, (err, result) => {
            if (err) {
                res.send(err);
                return;
            }
            //给前端提示
            res.send("学生信息修改成功<a href='/students/posts'>返回列表</a>")
        })
    })
})
//完成具体添加学生功能
router.post('/add', (req, res) => {
    //获取表单提交的数据
    let stuID = req.body.stuID;
    let stuUsername = req.body.stuUsername;
    let stuPwd = req.body.stuPwd;
    let stuSex = req.body.stuSex;
    let stuTel = req.body.stuTel;
    let className = req.body.className;
    let stuPro = req.body.stuPro;
    let stuColl = req.body.stuColl;
    let contentText = req.body.contentText;
    let time = new Date();
    let post = {
        stuID,
        stuUsername,
        stuPwd,
        stuSex,
        stuTel,
        className,
        stuPro,
        stuColl,
        contentText,
        time
    };
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err)
            return
        }
        let col = db.collection("students");
        col.insert(post, (err, result) => {
            if (err) {
                res.send(err);
                return;
            }
            res.redirect('/students/posts')
        })
    })
});
//删除学生
router.get('/delete', (req, res, next) => {
    let id = req.query.id;
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        let c = db.collection("students");
        c.remove({_id: ObjectId(id)}, (err, result) => {
            if (err) {
                res.send(err);
                return;
            }
            res.redirect('/students/posts')
        })
    })
});
router.post('/getStuId', (req, res) => {
    let stuID = req.body.stuID;
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        let col = db.collection("students");
        col.find({stuID}).toArray((err, result) => {
            if (err) {
                res.send(err);
                return;
            }
            res.render('students/students_list', {data: result})
        })
    })
})

router.post('/getClasses', (req, res) => {
    let className = req.body.className;
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        let col = db.collection("students");
        col.find({className}).toArray((err, result) => {
            if (err) {
                res.send(err);
                return;
            }
            res.render('students/students_list', {data: result})
        })
    })
})
router.post('/getStupro', (req, res) => {
    let stuPro = req.body.stuPro;
    MongoClient.connect(DB_STR, (err, db) => {
        if (err) {
            res.send(err);
            return;
        }
        let col = db.collection("students");
        col.find({stuPro}).toArray((err, result) => {
            if (err) {
                res.send(err);
                return;
            }
            res.render('students/students_list', {data: result})
        })
    })
})
module.exports = router;