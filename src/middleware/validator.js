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
const isValidSize = function (size) {
  const validSize = size.split(",").map(x => x.toUpperCase().trim())
  let uniqueValidSize = validSize.filter((item,
    index) => validSize.indexOf(item) === index);

  let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]

  for (let i = 0; i < validSize.length; i++) {
    if (!sizes.includes(validSize[i])) {
      return false
    }
  }

  return uniqueValidSize
}
const validFileRegex = /^.+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[pP][nN][gG])|(?:[jJ][pP][gG]))$/;

const stringRegex = /^[a-zA-Z0-9, ]{2,30}$/;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

const phoneRegex = /^((\+91)?|91)?[6789][0-9]{9}$/;

const pincodeRegex = /^[1-9]{1}?[0-9]{5}$/;

const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;


module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidSize,
  validFileRegex,
  stringRegex,
  passwordRegex,
  phoneRegex,
  pincodeRegex,
  emailRegex,
};
