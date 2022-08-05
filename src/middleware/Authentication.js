//=======================----------------->{ Imports }<-------------=======================================//

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


//=======================----------------->{ Authentication }<-------------=======================================//

const authentication = async function (req, res, next) {
  try {

    const token = req.header("Authorization");

    if (!token) {
      return res.status(400).send({ status: false, message: "Provide token for Authentication" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    let splitToken = token.split(" ");
    /*----------------------------------------------------------------------------------------------------------------------------*/
    
    try {
      const decodedToken = jwt.verify(splitToken[1], "Group-15", {
        ignoreExpiration: true,
      });
      if (Date.now() > decodedToken.exp * 1000) {
        return res.status(401).send({ status: false, message: "your token Session expired" });
      }

      req.useId = decodedToken.userId;
      /*----------------------------------------------------------------------------------------------------------------------------*/
    }
    catch (error) {
      return res.status(401).send({ status: false, message: "Authentication failed, Provide valid token" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    console.log("Authentication successful");
    /*----------------------------------------------------------------------------------------------------------------------------*/

    next();

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//=======================----------------->{ Authorization }<-------------=======================================//

const authorization = async function (req, res, next) {
  try {

    const userId = req.params.userId;
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid userId" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ status: false, message: "User not found with this UserId" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (req.useId != userId) {
      return res.status(401).send({ status: false, message: "You are Not Authorized to perform this task" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    console.log("Authorization successful");
    /*----------------------------------------------------------------------------------------------------------------------------*/

    next();

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=======================----------------->{ Exports }<-------------=======================================//

module.exports = { authentication, authorization };


/***********++++++*********+++++++++**********+++++++***********++++++++*******+++++++++*********++++++***********/