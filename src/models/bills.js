'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categoriesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date: String,
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity: Number
    }],
    total: Number
})

module.exports = mongoose.model('category', categoriesSchema)