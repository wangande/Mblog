var mongoose = require("mongoose");


module.exports = new mongoose.Schema({

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    title: String,

    // 内容标题
    title: String,

    //关联字段-用户id
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    addTime: {
        type: Date,
        default: new Date()
    },

    views: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    comments: {
        type: Array,
        default: []
    }
});