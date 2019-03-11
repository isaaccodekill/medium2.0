let express = require('express')
let mongoose = require('mongoose')
let moment = require("moment")

let blogSchema = new mongoose.Schema({
    title: {
        type : String
    },
    image: {
        type: String
    },
    body: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    created: {type: Date, default: Date.now},
    author: {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comments : [
     {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ] 

})

blogSchema.virtual('createdAtWords').get(function () {
    return moment(this.created).format("LL")
})

// creating the model and the collection

let Blog = mongoose.model("blog", blogSchema)

module.exports = Blog