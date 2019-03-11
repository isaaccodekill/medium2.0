let express = require('express')
let mongoose = require('mongoose')
let passporLocalMongoose = require("passport-local-mongoose")

let UserSchema = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    avatar: {
        type: String,
    },
    description: {
        type: String
    },
    categories:[]

})

UserSchema.plugin(passporLocalMongoose)

module.exports = mongoose.model("User", UserSchema) 