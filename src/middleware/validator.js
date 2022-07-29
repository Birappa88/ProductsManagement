const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const validFileRegex =
  /^.+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[pP][nN][gG])|(?:[jJ][pP][gG]))$/;

const stringRegex = /^[a-zA-Z0-9, ]{2,30}$/; 
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
const phoneRegex = /^((\+91)?|91)?[6789][0-9]{9}$/;
const pincodeRegex = /^[0-9]{6}$/;
const emailRegex =
  /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  validFileRegex,
  stringRegex,
  passwordRegex,
  phoneRegex,
  pincodeRegex,
  emailRegex,
};
