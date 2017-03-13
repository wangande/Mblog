var express = require('express');
var router = express.Router();
var User = require('../models/users');

var responseData = {
    "code": 0,
    "message": "注册成功",
    "userInfo": ""
};

router.post('/user/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    if (!username) {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return
    }
    if (!password) {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return
    }
    if (password != password2) {
        responseData.code = 3;
        responseData.message = "两次密码不相同";
        res.json(responseData);
        return
    }
    User.findOne({
        "username": username
    }).then(function (userInfo) {
        if (userInfo) {
            responseData.code = 4;
            responseData.message = "用户已存在";
            res.json(responseData);
            return
        }
        var user = new User({
            "username": username,
            "password": password
        })
        return user.save();
    }).then(function (newUserInfo) {
        // console.log(newUserInfo[0]);
        responseData.code = 0;
        responseData.message = "注册成功";
        res.json(responseData);
    });
});

router.post('/user/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        responseData.code = 1;
        responseData.message = "用户名或密码不能为空";
        res.json(responseData);
        return
    }

    User.findOne({
        "username": username,
        "password": password}
    ).then(function (userInfo) {
       if (!userInfo) {
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return
        }

        responseData.code = 0;
        responseData.message = "登录成功";
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username,
        }));
        res.json(responseData);
    });
});

router.post('/user/logout', function(req, res, next) {
    responseData.code = 0;
    responseData.message = "注销成功";
    req.cookies.set('userInfo', null);
    res.json(responseData);

});

module.exports = router;