/**
 * Created by wangande on 17-2-28.
 * 用户登录与注册
 */

~function (w, $) {
    var loginBox = $(".login");
    var loginMsg = $(".loginMsg");
    var regMsg = $(".registerMsg");
    var regBox = $(".register");
    var regBody = $(".register .body");
    var loginBody = $(".login .body");

    var user = {
        // 切换注册页面
        changeRegister: function () {
            //隐藏与清空
            loginBox.hide();
            loginMsg.hide();
            loginMsg.text();
            loginBox.find("input").val("");
            regBox.show();
        },
        // 切换登录
        changeLogin: function () {
            regBox.hide();
            regMsg.hide();
            regMsg.text();
            regBox.find("input").val("");
            loginBox.show();
        },
        // 注册
        register: function () {
            var data = {
                    "username": regBody.find("input[name='username']").val(),
                    "password": regBody.find("input[name='password']").val(),
                    "password2": regBody.find("input[name='password2']").val()
            };
            $.ajax({
                url : "/api/user/register",
                traditional : true,
                data : data,
                type : "POST",
                dataType : "json",
                success : function (res) {
                    regMsg.text(res.message);
                    regMsg.show();
                    if (!res.code) {
                        setTimeout(user.changeLogin, 2000);
                        console.log(res);
                        return;
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        // 登录
        login: function () {
            var data = {
                    "username": loginBody.find("input[name='username']").val(),
                    "password": loginBody.find("input[name='password']").val(),
            };
            $.ajax({
                url : "/api/user/login",
                traditional : true,
                data : data,
                type : "POST",
                dataType : "json",
                success : function (res) {
                    loginMsg.text(res.message);
                    loginMsg.show();
                    if (!res.code) {
                        setTimeout(function () {
                            window.location.href = "/";
                        }, 1000);
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        // 注销
        logout: function () {
            $.ajax({
                url : "/api/user/logout",
                traditional : true,
                data : {},
                type : "POST",
                dataType : "json",
                success : function (res) {
                    if (!res.code) {
                        window.location.reload();
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        init: function () {
            $(".changeRegister").on("click",  this.changeRegister);
            $(".changeLogin").on("click",  this.changeLogin);
            $(".register .submit").on("click",  this.register);
            $(".login .submit").on("click",  this.login);
            $(".logout").on("click",  this.logout);
        }
    };
    user.init();
} (window, jQuery);