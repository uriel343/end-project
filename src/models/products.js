'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
    product_name: String,
    price: Number,
    quantity: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    }
})

module.exports = mongoose.model('product', productSchema)