"use strict";
const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET = "SECRET_PASSWORD";

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(403).send({ message: "Dont found Header Authorization" });

  let token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, SECRET);
    if (payload.exp <= moment.unix)
      return res.status(404).send({ message: "The token was expired" });
  } catch (error) {
    return res.status(404).send({ message: "Invalid Token" });
  }
  req.user = payload;
  next();
};
