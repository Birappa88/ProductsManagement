const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authentication = async function (req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(400).send({ status: false, message: "plz pass token" });
    }
    let splitToken = token.split(" ");

    //decode toekn
    try {
      const decodedToken = jwt.verify(splitToken[1], "Group-15", {
        ignoreExpiration: true,
      });
      console.log(decodedToken.exp)
      console.log(Date.now())
      if (Date.now() > decodedToken.exp * 1000) {
        return res
          .status(401)
          .send({ status: false, message: "session expired" });
      }
      req.useId = decodedToken.userId;
    } catch (error) {
      return res
        .status(401)
        .send({ status: false, message: "Authentication faild" });
    }
    console.log("Authentication successful");

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const authorization = async function (req, res, next) {
  try {
    const _id = req.params.userId;
    if (!_id)
      return res
        .status(400)
        .send({ status: false, message: "userId is require" });

    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid userId" });
      }
    }
    const user = await userModel.findById({ _id });

    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }
    if (req.useId != _id) {
      return res.status(401).send({ status: false, message: "Not authorised" });
    }
    console.log("Authorization successfull");
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = { authentication, authorization };
