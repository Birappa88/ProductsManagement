const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { uploadFile } = require("../aws/aws");
const {
  isValid,
  isValidFiles,
  isValidRequestBody,
  validFileRegex,
  nameRegex,
  passwordRegex,
  phoneRegex,
  pincodeRegex,
  emailRegex,
} = require("../middleware/validator");

const createUser = async function (req, res) {
  try {
    let body = req.body;
    let { fname, lname, phone, email, password, address } = body;

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Plz Enter Some input" });
    }
    if (!isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Plz Enter the valid FName" });
    }
    if (!isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Plz Enter the valid LName" });
    }
    if (!isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Plz Enter the email" });
      }
      if (!isValid(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "Plz Enter the phone" });
      }
      if (!isValid(address)) {
        return res
          .status(400)
          .send({ status: false, message: "Plz Enter the address" });
      }

      if (!isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Plz Enter the password" });
      }

      if(address){
        const passAddress = JSON.parse(body.address);
        address = passAddress;
        body.address =address;
      }
      if (!isValid(address.shipping)) {
        return res
          .status(400)
          .send({ status: false, message: "shipping address is reqiured" });
      }
      if(!address.shipping.street){
        return res
        .status(400)
        .send({ status: false, message: "Enter the street" });
      }
      if(!address.shipping.city){
        return res
        .status(400)
        .send({ status: false, message: "Enter the city" });
      }
      if(!address.shipping.pincode){
        return res
        .status(400)
        .send({ status: false, message: "Enter the pincode" });
      }
      if(!pincodeRegex.test(address.shipping.pincode)){
        return res
        .status(400)
        .send({ status: false, message: "Enter the valid pincode" });
      }
     if(!address.billing.street){
        return res
        .status(400)
        .send({ status: false, message: "Enter the valid street" });
     }
     if(!address.billing.city){
        return res
        .status(400)
        .send({ status: false, message: "Enter the valid city" });
     }
     if(!address.billing.pincode){
        return res
        .status(400)
        .send({ status: false, message: "Enter the valid pincode" });
     }
     if(!pincodeRegex.test(address.billing.pincode)){
        return res
        .status(400)
        .send({ status: false, message: "Enter the valid pincode" });
      }

      if(!nameRegex.test(fname)){
        return res
        .status(400)
        .send({ status: false, message: "plz enter  the valid fname" });
      }
      if(!nameRegex.test(lname)){
        return res
        .status(400)
        .send({ status: false, message: "plz enter  the valid lname" });
      }
      if(!emailRegex.test(email)){
        return res
        .status(400)
        .send({ status: false, message: "plz enter  the valid Email" });
      }
      if(!passwordRegex.test(password)){
        return res
        .status(400)
        .send({ status: false, message: "plz enter  the valid passwprd" });
      }
      if(!phoneRegex.test(phone)){
        return res
        .status(400)
        .send({ status: false, message: "plz enter  the valid phone" });
      }

      let checkEmail = await userModel.findOne({email: body.email})
      if(checkEmail){
        return res
        .status(400)
        .send({ status: false, message:`${body.email} already exists use the diff email ` });
      }
      let checkphone = await userModel.findOne({phone: body.phone})
      if(checkphone){
        return res
        .status(400)
        .send({ status: false, message:`${body.phone} already exists use the diff phone ` });
      }
    

    let securePassword = body.password;
    const encrytedpassword = async function (securePassword) {
      const passwordHash = await bcrypt.hash(securePassword,10);
      body.password = passwordHash;
    };
    encrytedpassword(securePassword);

    let files = req.files;
    if(files && files.length > 0){
    let uploadProfileImage = await uploadFile(files[0]);
    body.profileImage = uploadProfileImage;
    }
    else {
        return res.status(400).send({status:false, message :"please upload the profile Imge "})
    }
    let userCreated = await userModel.create(body);
    res.status(201).send({
      status: true,
      message: "User cerated Successfully",
      data: userCreated,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "server not  responding",
      message: err.message,
    });
  }
};
module.exports = { createUser };
