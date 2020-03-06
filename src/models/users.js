'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema ({
    user_name: String,
    email: String,
    password: String,
    rol: String
})

module.exports = mongoose.model('user', userSchema)