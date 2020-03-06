'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categoriesSchema = new Schema ({
    category_name: String,
    description: String
})

module.exports = mongoose.model('category', categoriesSchema)