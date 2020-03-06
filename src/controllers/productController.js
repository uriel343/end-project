"use strict";
const productModel = require("../models/products");

function createproduct(req, res) {
  if (req.user.rol === "ADMIN") {
    let product = new productModel();
    let { product_name, price, quantity, category} = req.body;
    product_name = product_name.trim();

    if (product_name && price && quantity && category) {
      product.product_name = product_name;
      product.price = price
      product.quantity = quantity
      product.category = category
      product.save((err, productCreated) => {
        if (err) return res.status(500).send({ message: "Bad request" });
        if (!productCreated)
          return res.status(404).send({ message: "Cannot created" });
        return res.status(200).send({ message: "Success", productCreated });
      });
    }
  }
}

function getProducts(req, res) {
    let idproduct = req.params._id;
    let {product_name, category_name} = req.body
    let filter = {};
    if (idproduct) filter._id = idproduct;

    if (req.user.rol === "ADMIN") {
    productModel.find(filter, (err, productFound) => {
      if (err) return res.status(500).send({ message: "Bad request" });
      if (!productFound) return res.status(404).send({ message: "Not found" });

      return res.status(200).send({ message: "Success", productFound });
    });
  }else if(req.user.rol === 'CLIENT'){
      if(category_name){
        productModel.find({ category: { $regex: `.*${category_name}.*` }}, (err, productFound) => {
            if (err) return res.status(500).send({ message: "Bad request" });
            if (!productFound) return res.status(404).send({ message: "Not found" });
      
            return res.status(200).send({ message: "Success", productFound });
          }).populate('category', 'category_name');
      }else if(product_name){
        productModel.find({ product_name: { $regex: `.*${product_name}.*` }}, (err, productFound) => {
            if (err) return res.status(500).send({ message: "Bad request" });
            if (!productFound) return res.status(404).send({ message: "Not found" });
      
            return res.status(200).send({ message: "Success", productFound });
          }).populate('category', 'category_name');
      }
    
  }
}

function updateproduct(req, res) {
    if(req.user.rol === 'ADMIN'){
        let idproduct = req.params._id
        let params = req.body
        productModel.findByIdAndUpdate(idproduct,params, {new: true}, (err,documentUpdated)=>{
            if(err) return res.status(500).send({message: 'Bad request'})
            if(!documentUpdated) return res.status(404).send({message: 'Not found'})
            return res.status(200).send({message: 'Success', documentUpdated})
        } )
    }
}

function deleteproduct(req, res) {
    if(req.user.rol === 'ADMIN'){
        let idproduct = req.params._id

        productModel.findByIdAndDelete(idproduct, (err,documentDeleted)=>{
            if(err) return res.status(500).send({message: 'Bad request'})
            if(!documentDeleted) return res.status(404).send({message: 'Not found'})
            return res.status(200).send({message: 'Success', documentDeleted})
        })
    }
}
function outOfStockProducts(req,res){
    if(req.user.rol === 'ADMIN'){
        productModel.find({quantity:{$or:[{$lte: 10}, {$gte:1}]}},(err,productsOutOfStock)=>{
            if(err) return res.status(500).send({message: 'Bad request'})
            if(!productsOutOfStock) return res.status(404).send({message: 'You have enough products in the Stock'})
            return res.status(200).send({message: 'The products out of stock are:  ', productsOutOfStock})
        })
    }
}

module.exports = {
    createproduct,
    getCategories,
    updateproduct,
    deleteproduct
}
