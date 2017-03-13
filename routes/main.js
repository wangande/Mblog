var express = require('express');
var router = express.Router();
var Category = require('../models/categories');
var Content = require("../models/contents");

/* GET home page. */

var data = {
    // userInfo: req.userInfo,
    count: 0,
    // page: req.query.page || 1,
    pages: 0,
    pageSize: 5,
    categories: [],
};

router.use(function(req, res, next) {

    data.userInfo = req.userInfo;
    data.page = req.query.page || 1;
    data.category = req.query.category || "";
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});

router.get('/', function(req, res) {
    var here = {};
    if (data.category) {
        here.category = data.category
    }
    Content.count().where(here).then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.pageSize);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1)* data.pageSize;
        return Content.find().where(here).sort({_id: -1}).limit(data.pageSize).skip(skip).populate(["category", "user"]);
    }).then(function(contents){
        data.contents = contents;
        console.log(data);
        res.render('web/index', data);
    });
});

router.get('/login', function(req, res) {
    res.render('web/login', data);
});

router.get('/view', function(req, res) {
    Content.findOne({
        _id: req.query.contentId|| ""
    }).then(function (content) {
        data.content = content;
        data.contentId = req.query.contentId;
        data.category = req.query.category;

        data.count = content.comments.length;
        data.pages = Math.ceil(data.count / data.pageSize);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1)* data.pageSize;
        var comments = content.comments.reverse();
        data.comments = comments.slice(skip, skip+data.pageSize);
        console.log(data.comments);
        res.render('web/view', data);
    });

});

router.post('/comment', function(req, res) {

    if (!req.body.content) {
        res.json({code: 1, message: "评论内容为空"});
        return;
    }
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };
    Content.findOne({
        _id: req.body.contentId
    }).then(function (content) {
        if (!content) {
            res.json({code: 2, message: "文章信息错误"});
            return;
        }
        content.comments.push(postData);
        return content.save();
    }).then(function (rs) {
        res.json({code:0, message: "评论成功"});
    });

});

module.exports = router;