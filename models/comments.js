let express = require("express")
let mongoose = require("mongoose")
let moment = require('moment')

let commentSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        avatar: String
    },
    likes: {
        type: Number,
        default: 0
    },
    created : {type: Date, default: Date.now }

})

commentSchema.virtual('createdAt').get(function () {
    return moment(this.created).fromNow()
})

module.exports = mongoose.model("Comment", commentSchema)