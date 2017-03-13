/**
 * admin后台接口
 * */

var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Category = require('../models/categories');
var Content = require("../models/contents");


// 权限验证，如果登录用户不是管理员，禁止登录
router.use(function(req, res, next) {
    if (! req.userInfo.isAdmin) {
        res.send("你不是管理员，无法进入！");
        return;
    }
    next();
});

// admin主页
router.get('/', function(req, res) {
   res.render('admin/index', {"userInfo": req.userInfo});
});

// 获取用户列表
router.get('/user', function(req, res) {

    var page = Number(req.query.page|| 1);
    var pageSize = 10;
    var pages = 0;

    User.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count/pageSize);
        // 数量不能超过pages
        page = Math.min(page, pages)
        // 数量不能小于1
        page = Math.max(page, 1);
        var skip = (page-1)*pageSize;

        User.find().limit(pageSize).skip(skip).then(function (users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                page: page,
                pages: pages,
                pageSize: pageSize,
                url: "/admin/user"
            });
        });
    });
});

// 获取分类列表
router.get('/category', function(req, res) {

    var page = Number(req.query.page|| 1);
    var pageSize = 10;
    var pages = 0;

    Category.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count/pageSize);
        // 数量不能超过pages
        page = Math.min(page, pages)
        // 数量不能小于1
        page = Math.max(page, 1);
        var skip = (page-1)*pageSize;

        Category.find().sort({_id: -1}).limit(pageSize).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                page: page,
                pages: pages,
                pageSize: pageSize,
                url: "/admin/category"
            });
        });
    });
});

// 进入添加分类页
router.get('/category/add', function(req, res) {

    res.render('admin/category_add', {
        userInfo: req.userInfo
    });

});

// 分类添加
router.post('/category/add', function(req, res) {
    var name = req.body.name || "";
    if (!name) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "名字不能为空",
            url: ""
        });
        return;
    }
    Category.findOne({
        name: name
    }).then(function (category) {
        if (category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "分类已经存在",
                url: ""
            });
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "分类保存成功",
            url: "/admin/category"
        });
    });
});

// 进入分类编辑
router.get('/category/edit', function(req, res) {
    Category.findOne({
        _id: req.query.id || ""
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "分类信息不存在",
                url: ""
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    });
});

// 分类修改
router.post('/category/edit', function(req, res) {
    var id = req.query.id || "";
    var name = req.body.name || "";
    if (!name) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "名字不能为空",
            url: ""
        });
        return;
    }
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "分类信息不存在",
                url: ""
            });
            return Promise.reject();
        } else {
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: "修改成功",
                    url: "/admin/category"
                });
                return Promise.reject();
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: "数据库已存在同名分类",
                    url: ""
                });
                return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "修改成功",
            url: "/admin/category"
        });
    });
});

// 分类删除
router.get('/category/delete', function(req, res) {
    var id = req.query.id || "";

    Category.remove({
        _id: id
    }).then(function (category) {
         res.render('admin/success', {
            userInfo: req.userInfo,
            message: "删除成功",
            url: "/admin/category"
        });
    });

});

// 文章列表
router.get('/content', function(req, res) {

    var page = Number(req.query.page|| 1);
    var pageSize = 10;
    var pages = 0;

    Content.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count/pageSize);
        // 数量不能超过pages
        page = Math.min(page, pages)
        // 数量不能小于1
        page = Math.max(page, 1);
        var skip = (page-1)*pageSize;

        Content.find().sort({_id: -1}).limit(pageSize).skip(skip).populate(["category", "user"]).then(function (contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                page: page,
                pages: pages,
                pageSize: pageSize,
                url: "/admin/content"
            });
        });
    });
});

// 进入文章添加页
router.get('/content/add', function(req, res) {

    Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories,
        });
    });
});

// 文章添加
router.post('/content/add', function(req, res) {
    if (!req.body.category) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "分类不能为空",
            url: ""
        });
        return;
    }
    if (!req.body.title) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "内容标题不能为空",
            url: ""
        });
        return;
    }

    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id,
        description: req.body.description,
        content: req.body.content
    }).save().then(function (newContent) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "内容保存成功",
            url: "/admin/content"
        });
    });
});

// 进入文章编辑页
router.get('/content/edit', function(req, res) {
    var id = req.query.id || "";

    Content.findOne({
        _id: id
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "内容信息不存在",
                url: ""
            });
            return Promise.reject();
        } else {
            Category.find().sort({_id: -1}).then(function (categories) {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    content: content,
                    categories: categories
                });
            });
        }
    });
});

// 文章修改
router.post('/content/edit', function(req, res) {

    if (!req.body.category) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "分类不能为空",
            url: ""
        });
        return;
    }
    if (!req.body.title) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "内容标题不能为空",
            url: ""
        });
        return;
    }

    Content.findOne({
        _id: req.query.id
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "内容信息不存在",
                url: ""
            });
            return Promise.reject();
        } else {
            console.log(req.body);
            if (req.body.title == content.title && req.body.category == content.category && 
                req.body.description == content.description && req.body.content == content.content) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: "修改成功",
                    url: "/admin/content"
                });
                return Promise.reject();
            } else {
                return Content.update({
                    _id: req.query.id
                }, {
                    category: req.body.category,
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content
                });
            }
        }
    }).then(function (rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "修改成功",
            url: "/admin/content"
        });
    });
});

// 文章删除
router.get('/content/delete', function(req, res) {
    Content.remove({
        _id: req.query.id
    }).then(function (category) {
         res.render('admin/success', {
            userInfo: req.userInfo,
            message: "删除成功",
            url: "/admin/content"
        });
    });

});

module.exports = router;