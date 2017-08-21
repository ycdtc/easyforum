var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');//导入mongoose模块
var module_collection = require('../modules/module');//导入模型数据模块
var db = mongoose.connection;
var UserInfo = module_collection.UserInfo;
var ForumContent = module_collection.ForumContent;
var ForumReply = module_collection.ForumReply;
var User = mongoose.model('user', UserInfo);
var Forum = mongoose.model('forum', ForumContent);
var Reply = mongoose.model('reply', ForumReply);
var router = express.Router();


/* GET home page */
router.get('/', function (req, res, next) {
    res.render("login", {title: 'User Login'});
});

/* GET login page */
router.get('/login',function (req, res) {// 到达此路径则渲染login文件，并传出title值供 login.html使用
    req.session.user = null;
    req.session.error = null;
    res.render("login", {title: 'User Login'});
});

/* GET register page */
router.route("/register").get(function (req, res) {// 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("register", {title: 'User register'});
});

/* GET forum page. */
router.route("/forum").get(function (req, res) {// 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("forum",{account:req.session.user.account});         //已登录则渲染home页面
});

/* DO login action */
router.route('/signIn').post(function(req, res) {
    var account = req.body.account;
    var password = req.body.password;
    var userInfo = {"account":account,"password":password};
    var json = "";
    User.findOne({"account":account, "password":password}, function(err, doc){
        if(err) {
            console.log(err);
        } else if(doc != null) {
            json = {"status":10}; //登录验证成功标志
            req.session.user = userInfo;
        } else if(doc == null) {
            json = {"status":99}; //用户名或者密码错误
        }
        res.send(json);
        res.end();
    });
});

/* Do register action */
router.route("/signUp").post(function (req, res) {                        // 从此路径检测到post方式则进行post数据的处理操作
    var account = req.body.account;
    var password = req.body.password;
    var json = "";
    User.findOne({"account":account}, function(err, doc){
        if(err) {
            console.log(err);
            json = {"status":100}; //错误标志
            res.send(json);
            res.end();
        } else if(doc != null) {
            json = {"status":20}; //用户名重复标志
            res.send(json);
            res.end();
        } else if(doc == null) {
            var userInfo = new User({"account":account, "password":password});
            userInfo.save(function(err, doc){
                if(err) {
                    console.log(err);
                    json = {"status":100}; //错误标志
                    res.send(json);
                    res.end();
                } else {
                    json = {"status":30}; //注册成功标志
                    res.send(json);
                    res.end();
                }
            });
        }

    });

});

/* DO initialize action */
router.route('/initialize').post(function(req, res) {
    var json = "";
    Forum.find(function(err, doc){
        if(err) {
            console.log(err);
        } else if(doc != null) {
            json = JSON.stringify(doc);
            console.log(json);
        }
        res.send(json);
        res.end();
    });
});
/* DO reply initialize action */
router.route('/replyinitialize').post(function(req, res) {
    var summary = req.body.summary;
    console.log("replyinitialize");
    var json = "";
    Reply.find({"summary":summary},function(err, doc){
        if(err) {
            console.log(err);
        } else if(doc != null) {
            json = JSON.stringify(doc);
            console.log(json);
        }
        res.send(json);
        res.end();
    });
});

/* DO poster action */
router.route('/poster').post(function(req, res) {
    var json = "";
    var summary = req.body.summary;
    var content = req.body.content;
    var userInfo = req.session.user;
    var account = userInfo.account;
    console.log("initialize");
    console.log(userInfo);
    var forumContent = new Forum({"summary":summary, "content":content, "account":account});
    Forum.findOne({"summary":summary}, function(err, doc){
        if(err) {
            console.log(err);
            json = {"status":100}; //错误标志
            res.send(json);
            res.end();
        } else if(doc != null) {
            json = {"status":20}; //标题重复标志
            res.send(json);
            res.end();
        } else if(doc == null || doc == '') {
            forumContent.save(function(err, doc){
                if(err) {
                    console.log(err);
                    json = {"status":100}; //错误标志
                    res.send(json);
                    res.end();
                } else {
                    json = {"status":30}; //保存成功标志
                    res.send(json);
                    res.end();
                }
            });
        }
    });
});
router.route('/replyposter').post(function(req, res) {
    var json = "";
    console.log("bbb");
    var reply = req.body.reply;
    var summary = req.body.summary;
    var userInfo = req.session.user;
    var account = userInfo.account;
    console.log(summary);
    console.log(userInfo);
    var forumReply = new Reply({"reply":reply, "summary":summary,"account":account});
    forumReply.save(function(err, doc){
                if(err) {
                    console.log(err);
                    json = {"status":100}; //错误标志
                    res.send(json);
                    res.end();
                } else {
                    json = {"status":30}; //保存成功标志
                    res.send(json);
                    res.end();
                }
            });
});

/* DO edit action */
router.get('/edit/:summary',function(req, res) {
    var summary = req.params.summary;
    Forum.findOne({"summary":summary}, function(err, doc){
        if(err) {
            res.redirect('/forum');
        } else {
            res.render("edit",{summary:summary,content:doc.content});
        }
    });
});
router.get('/content/:summary',function(req, res) {
    var summary = req.params.summary;
    Forum.findOne({"summary":summary}, function(err, doc){
        if(err) {
            res.redirect('/forum');
        } else {
            res.render("forum_detail",{summary:summary,content:doc.content, account:doc.account});
        }
    });
});

router.post('/editPost',function(req, res) {
    var json = "";
    var summary = req.body.summary;
    var content = req.body.content;
    Forum.updateOne({"summary": summary}, {'$set': {'content': content}}, function (err, doc) {
        if (err) {
            console.log(err);
            json = {"status": 100}; //错误标志
            res.send(json);
            res.end();
        } else {
            json = {"status": 30}; //保存成功标志
            res.send(json);
            res.end();
        }
    });
});

/* DO edit action */
router.get('/delete/:summary',function(req, res) {
    var summary = req.params.summary;
    Forum.remove({"summary":summary}, function(err, doc){
        if(err) {
            console.log(err);
        }
        res.redirect('/forum');
    });
});
module.exports = router;
