"use strict";
const categoryModel = require("../models/categories");
const productModel = require("../models/products");

function createCategory(req, res) {
  if (req.user.rol === "ADMIN") {
    let category = new categoryModel();
    let { category_name, description } = req.body;
    category_name = category_name.trim();
    description = description.trim();

    if (category_name && description) {
      category.category_name = category_name;
      category.description = description;
      category.save((err, categoryCreated) => {
        if (err) return res.status(500).send({ message: "Bad request" });
        if (!categoryCreated)
          return res.status(404).send({ message: "Cannot created" });
        return res.status(200).send({ message: "Success", categoryCreated });
      });
    }
  }
}

function getCategories(req, res) {
  if (req.user.rol === "ADMIN" || req.user.rol === 'CLIENT') {
    let idCategory = req.params._id;
    let filter = {};
    if (idCategory) filter._id = idCategory;
    categoryModel.find(filter, (err, categoryFound) => {
      if (err) return res.status(500).send({ message: "Bad request" });
      if (!categoryFound) return res.status(404).send({ message: "Not found" });

      return res.status(200).send({ message: "Success", categoryFound });
    });
  }
}

function updateCategory(req, res) {
  if (req.user.rol === "ADMIN") {
    let idCategory = req.params._id;
    let params = req.body;
    categoryModel.findByIdAndUpdate(
      idCategory,
      params,
      { new: true },
      (err, documentUpdated) => {
        if (err) return res.status(500).send({ message: "Bad request" });
        if (!documentUpdated)
          return res.status(404).send({ message: "Not found" });
        return res.status(200).send({ message: "Success", documentUpdated });
      }
    );
  }
}

function deleteCategory(req, res) {
  if (req.user.rol === "ADMIN") {
    let idCategory = req.params._id;

    categoryModel.findByIdAndDelete(idCategory, (err, documentDeleted) => {
      if (err) return res.status(500).send({ message: "Bad request" });
      if (!documentDeleted)
        return res.status(404).send({ message: "Not found" });
        productModel.findOneAndUpdate({category: idCategory}, {category: 'General'}, {new: true}, (err,defaultCategoryOfProduct)=>{
          if(err) return res.status(500).send({message: 'Bad request'})
          if(!defaultCategoryOfProduct) return res.status(404).send({message: 'Not found'})
        } )
      return res.status(200).send({ message: "Success", documentDeleted });
    });
  }
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
