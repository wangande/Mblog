/**
 * Created by wangande on 17-3-13.
 * 博客全文预览相关
 */

~function (w, $) {
    var view = {
        // 提交评论
        postComment: function () {
            var data = {
                contentId: $(".jumbotron").find("input[name='contentId']").val(),
                content: $(".jumbotron").find("input[name='comment']").val()
            };
            console.log(data);
            $.ajax({
                url : "/comment",
                traditional : true,
                data : data,
                type : "POST",
                dataType : "json",
                success : function (res) {
                    $(".postCommentError").text(res.message);
                    $(".postCommentError").show();
                    if (!res.code) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        init: function () {
            $(".postComment").on("click", this.postComment);
        }
    };

    view.init();

} (window, jQuery);