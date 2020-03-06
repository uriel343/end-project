"use strict";
const userModel = require("../models/users");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function registerUser(req, res) {
  const user = new userModel();
  let admin = req.params.admin;

  let { user_name, email, password } = req.body;
  user_name = user_name.trim();
  email = email.trim();
  password = password.trim();

  if (admin) {
    if (user_name && email && password) {
      user.user_name = user_name;
      user.email = email;
      user.password = password;
      user.rol = "ADMIN";

      userModel
        .find({ $or: [{ user: user.email }] })
        .exec((err, userExisting) => {
          if (err) return res.status(500).send({ message: "Bad request" });
          if (userExisting && userExisting >= 1) {
            return res
              .status(500)
              .send({ message: "This user already exists" });
          } else {
            bcrypt.hash(password, null, null, (err, hash) => {
              user.password = hash;
              user.save((err, userSaved) => {
                if (err)
                  return res.status(500).send({ message: "fail to save user" });
                if (!userSaved)
                  return res
                    .status(404)
                    .send({ message: "User cannot register" });
                return res.status(200).send({ message: "Success", userSaved });
              });
            });
          }
        });
    } else {
      return res.status(400).send({ message: "Missing data" });
    }
  } else {
    if (user_name && email && password) {
      user.user_name = user_name;
      user.email = email;
      user.password = password;
      user.rol = "CLIENT";

      userModel
        .find({ $or: [{ user: user.email }] })
        .exec((err, userExisting) => {
          if (err) return res.status(500).send({ message: "Bad request" });
          if (userExisting && userExisting >= 1) {
            return res
              .status(500)
              .send({ message: "This user already exists" });
          } else {
            bcrypt.hash(password, null, null, (err, hash) => {
              user.password = hash;
              user.save((err, userSaved) => {
                if (err)
                  return res.status(500).send({ message: "fail to save user" });
                if (!userSaved)
                  return res
                    .status(404)
                    .send({ message: "User cannot register" });
                return res.status(200).send({ message: "Success", userSaved });
              });
            });
          }
        });
    } else {
      return res.status(400).send({ message: "Missing data" });
    }
  }
}
// if user === client ---> mostrar compras realizadas
function login(req, res) {
  const { email, password, token } = req.body;
  userModel.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: "Bad request" });
    if (user) {
      bcrypt.compare(password, user.password, (err, checked) => {
        if (err) return res.status(500).send({ message: "Unexpected error" });
        if (checked) {
          if (token) {
            return res.status(200).send({
              message: "User logged",
              token: jwt.createToken(user)
            });
          } else {
            user.password = undefined;
            res.status(200).send({ enterprise: user });
          }
        } else {
          res.status(404).send({ message: "Not found" });
        }
      });
    }
  });
}

function getUsers(req, res) {
  let idUser = req.params._id;
  let filter = {};

  if (idUser) filter._id = idUser;
  if (req.user.rol !== "ADMIN")
    return res.status(401).send({
      message:
        "Only administrators have the permissions to see another accounts"
    });
  userModel.find(filter, (err, usersFound) => {
    if (err) return res.status(500).send({ message: "Bad request" });
    if (!userModel)
      return res.status(404).send({ message: "Not found, try again" });
    return res.status(200).send({ message: "Success", usersFound });
  });
}

function updateUser(req, res) {
  let idUser = req.params._id;
  let params = req.body;

  delete params.password;

  if (req.user.rol === "ADMIN") {
    userModel.findOneAndUpdate(
      {$and:[{_id:idUser}, {rol: 'CLIENT'}]},
      params,
      { new: true },
      (err, userUpdated) => {
        if (err) return res.status(500).send({ message: "Bad request" });
        if (!userUpdated) return res.status(404).send({ message: "Not found" });

        return res.status(200).send({ message: "Success", userUpdated });
      }
    );
  } else if (req.user.rol === "CLIENT") {
    delete params.rol
    if (idUser !== req.user.sub)
      return res
        .status(401)
        .send({ message: "You only can update your own account" });
    userModel.findByIdAndUpdate(
      idUser,
      params,
      { new: true },
      (err, userUpdated) => {
        if (err) return res.status(500).send({ message: "Bad request" });
        if (!userUpdated) return res.status(404).send({ message: "Not found" });

        return res.status(200).send({ message: "Success", userUpdated });
      }
    );
  }
}

function deleteUser(req, res) {
  let idUser = erq.params._id;
  if (req.user.rol === "ADMIN") {

    userModel.findOneAndDelete({$and: [{_id: idUser}, {rol:'CLIENT'}]}, (err, documentDeleted) => {
      if (err) return res.status(500).send({ message: "Bad request" });
      if (!documentDeleted)
        return res.status(404).send({ message: "Not found" });

      return res.status(200).send({ message: "Success", documentDeleted });
    });
  } else if (req.user.rol === "CLIENT") {
    if (idUser !== req.user.sub)
      return res
        .status(401)
        .send({ message: "You only can delete your own account" });

    userModel.findByIdAndDelete(idUser, (err, documentDeleted) => {
      if (err) return res.status(500).send({ message: "Bad request" });
      if (!documentDeleted)
        return res.status(404).send({ message: "Not found" });

      return res.status(200).send({ message: "Success", documentDeleted });
    });
  }
}

function adminFired(req, res) {
  let idUser = req.params._id;
  if (idUser === req.user.sub)
    return res.status(401).send({
      message:
        "Make sure of the id"
    });
  userModel.findOneAndUpdate(
    { _id: idUser },
    { rol: "CLIENT" },
    { new: true },
    (err, adminFired) => {
      if (err) return res.status(500).send({ message: "Bad request" });
      if (!adminFired) return res.status(404).send({ message: "Not found" });
      return res.status(200).send({ message: "Administrator has been fired", adminFired });
    }
  );
}

module.exports = {
  registerUser,
  login,
  getUsers,
  updateUser,
  deleteUser,
  adminFired
};
