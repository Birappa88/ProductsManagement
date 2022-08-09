//=======================----------------->{ Imports }<-------------=======================================//

const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { uploadFile } = require("../aws/aws");
const {
  isValid,
  isValidRequestBody,
  isValidObjectId,
  stringRegex,
  passwordRegex,
  phoneRegex,
  pincodeRegex,
  emailRegex,
} = require("../middleware/validator");


//=======================----------------->{ Register User }<-------------=======================================//

const createUser = async function (req, res) {
  try {

    let body = req.body;
    let { fname, lname, phone, email, password, address } = body;
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to create User" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid firstName" });
    }
    if (!stringRegex.test(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid firstName" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid lastName" });
    }
    if (!stringRegex.test(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid lastName" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Email" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid Email" });
    }

    let checkEmail = await userModel.findOne({ email: email });

    if (checkEmail) {
      return res.status(400).send({
        status: false,
        message: `${email} already exists, use new Email`,
      });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter password" });
    }
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid password" });
    }

    let securePassword = body.password;

    const encrytedpassword = async function (securePassword) {
      const passwordHash = await bcrypt.hash(securePassword, 10);
      body.password = passwordHash;
    };
    encrytedpassword(securePassword);
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Phone number" });
    }
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).send({
        status: false,
        message: `${phone} is not valid Phone number`,
      });
    }
    let checkphone = await userModel.findOne({ phone: phone });

    if (checkphone) {
      return res.status(400).send({
        status: false,
        message: `${phone} already exists, use new Phone number`,
      });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!address) {
      return res
        .status(400)
        .send({ status: false, message: "Enter address" });
    }
    const passAddress = JSON.parse(body.address);
    address = passAddress;
    body.address = address;

    if (!isValid(address)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Valid address" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!address.shipping) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Shpping Address" });
    }
    if (!isValid(address.shipping)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide shipping address" });
    }

    if (!address.shipping.street) {
      return res
        .status(400)
        .send({ status: false, message: "Enter street" });
    }
    if (!isValid(address.shipping.street)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide shipping Street" });
    }
    if (!address.shipping.city) {
      return res.status(400).send({ status: false, message: "Enter city" });
    }
    if (!isValid(address.shipping.city)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide shipping city" });
    }
    if (!address.shipping.pincode) {
      return res
        .status(400)
        .send({ status: false, message: "Enter pincode" });
    }
    if (!pincodeRegex.test(address.shipping.pincode)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid shipping pincode" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!address.billing) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Billing Address" });
    }
    if (!isValid(address.billing)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide  valid billing address" });
    }

    if (!address.billing.street) {
      return res
        .status(400)
        .send({ status: false, message: "Enter billing street" });
    }
    if (!isValid(address.billing.street)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide valid billing Street" });
    }
    if (!address.billing.city) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Billing city" });
    }
    if (!isValid(address.billing.city)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide valid billing city" });
    }
    if (!address.billing.pincode) {
      return res
        .status(400)
        .send({ status: false, message: "Enter billing pincode" });
    }
    if (!pincodeRegex.test(address.billing.pincode)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid billing pincode" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    let files = req.files;
    if (files && files.length > 0) {

      let uploadProfileImage = await uploadFile(files[0]);
      body.profileImage = uploadProfileImage;

    } else {
      return res
        .status(400)
        .send({ status: false, message: "Upload profile Image" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    let userCreated = await userModel.create(body);
    /*----------------------------------------------------------------------------------------------------------------------------*/

    res.status(201).send({ status: true, message: "User created Successfully", data: userCreated });

    /*----------------------------------------------------------------------------------------------------------------------------*/

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


//=======================----------------->{ Login User }<-------------=======================================//

const loginUser = async function (req, res) {
  try {

    let body = req.body;
    const { email, password } = body;
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to login" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Email to login" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: `${email} is not valid Email Id` });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Password to login" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password is Invalid or it's length should be 8-15",
      });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "User not found with this Email" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    let userPassword = await bcrypt.compareSync(body.password, user.password);

    if (!userPassword) {
      return res
        .status(401)
        .send({ status: false, message: "Password is not correct" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    let token = jwt.sign(
      {
        userId: user._id, //unique Id
        iat: Math.floor(Date.now() / 1000), //issued date
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, //expires in 24 hr
      },
      "Group-15"
    );
    /*----------------------------------------------------------------------------------------------------------------------------*/

    res.setHeader("Authorization", token);
    /*----------------------------------------------------------------------------------------------------------------------------*/

    return res.status(200).send({ status: true, message: "User login Successful", data: { userId: user._id, token: token } });

    /*----------------------------------------------------------------------------------------------------------------------------*/

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


//=======================----------------->{ Get User Details }<-------------=======================================//

const getUser = async function (req, res) {
  try {

    const params = req.params;
    const userId = params.userId;
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "UserId is not correct" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found with this ${userId} id`,
      });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (req.useId != userId) {
      return res.status(401).send({ status: false, message: "You are not authorized User" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    return res.status(200).send({ status: true, message: "User profile details", data: user });

    /*----------------------------------------------------------------------------------------------------------------------------*/

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//=======================----------------->{ Update User Deatils }<----------------=======================================//

const updateUser = async function (req, res) {
  try {

    let UserId = req.params.userId
    let data = req.body;
    let profileImage = req.files
    /*----------------------------------------------------------------------------------------------------------------------------*/

    let { fname, lname, email, password, phone, address } = data;
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (profileImage && profileImage.length > 0) {

      let uploadFileURL = await uploadFile(profileImage[0]);
      data.profileImage = uploadFileURL;
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to Update User" });
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (fname != null) {
      if (!isValid(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid firstName" });
      }
      if (!stringRegex.test(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid firstName" });
      }
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (lname != null) {
      if (!isValid(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid lastName" });
      }
      if (!stringRegex.test(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid lastName" });
      }
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (email != null) {
      if (!isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter Email" });
      }
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid Email" });
      }

      let checkEmail = await userModel.findOne({ email: email });
      if (checkEmail) {
        return res.status(400).send({
          status: false,
          message: `${email} already exists, use the different Email `,
        });
      }
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (phone != null) {
      if (!isValid(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter Phone number" });
      }
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).send({
          status: false,
          message: `${phone} is not valid Phone number`,
        });
      }
      const checkPhone = await userModel.findOne({ phone: phone });
      if (checkPhone) {
        return res.status(400).send({
          status: false,
          message: `${phone} already exists, use the new phone number`,
        });
      }
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (password != null) {
      if (!isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter password" });
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).send({
          status: false,
          message: "Password is Invalid, must be at least 1 lowerCase, 1 upperCase and length 8-15",
        });
      }
      data.password = await bcrypt.hash(password, 10);
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    if (address == "") {
      return res.status(400).send({ status: false, message: "Enter address to update" })
    }
    else if (address != null) {

      data.address = JSON.parse(address);
      /*----------------------------------------------------------------------------------------------------------------------------*/

      if (!isValid(data.address)) {
        return res.status(400).send({ status: false, message: "Enter valid Address" });
      }
      if (typeof data.address != "object") {
        return res.status(400).send({ status: false, message: "Address should be an object format" });
      }
      /*----------------------------------------------------------------------------------------------------------------------------*/
      let { shipping, billing } = data.address;
      /*----------------------------------------------------------------------------------------------------------------------------*/

      if (!isValid(shipping)) {
        return res.status(400).send({ status: false, message: "Shipping is required" });
      }

      if (shipping != null) {
        if (typeof shipping != "object") {
          return res.status(400).send({ status: false, message: "Shipping should be an object format" });
        }

        if (!isValid(shipping.street)) {
          return res.status(400).send({ status: false, message: "Shipping street is required" });
        }
        if (!stringRegex.test(shipping.street)) {
          return res.status(400).send({ status: false, message: "Enter valid Shipping street" });
        }

        if (!isValid(shipping.city)) {
          return res.status(400).send({ status: false, message: "Shipping city is required" });
        }
        if (!stringRegex.test(shipping.city)) {
          return res.status(400).send({ status: false, message: "Enter valid Shipping city" });
        }

        if (!isValid(shipping.pincode)) {
          return res.status(400).send({ status: false, message: "shipping pincode is required" });
        }
        if (!pincodeRegex.test(shipping.pincode)) {
          return res.status(400).send({ status: false, message: "Enter valid shipping pincode" });
        }
      }
      /*----------------------------------------------------------------------------------------------------------------------------*/

      if (!isValid(billing)) {
        return res.status(400).send({ status: false, message: "Billing is required" });
      }

      if (billing != null) {
        if (typeof billing != "object") {
          return res.status(400).send({ status: false, message: "Billing should be an object format" });
        }

        if (!isValid(billing.street)) {
          return res.status(400).send({ status: false, message: "Billing street is required" });
        }
        if (!stringRegex.test(billing.street)) {
          return res.status(400).send({ status: false, message: "Enter Valid billing street" });
        }

        if (!isValid(billing.city)) {
          return res.status(400).send({ status: false, message: "Billing City is required" });
        }
        if (!stringRegex.test(billing.city)) {
          return res.status(400).send({ status: false, message: "Enter Valid billing City" });
        }

        if (!isValid(billing.pincode)) {
          return res.status(400).send({ status: false, message: "Billing Pincode is required" });
        }
        if (!pincodeRegex.test(billing.pincode)) {
          return res.status(400).send({ status: false, message: "Enter valid billing Pincode" });
        }
      }
    }
    /*----------------------------------------------------------------------------------------------------------------------------*/

    const updatedUser = await userModel.findOneAndUpdate({ _id: UserId }, data, { new: true });
    /*----------------------------------------------------------------------------------------------------------------------------*/

    return res.status(200).send({ status: true, message: "User details updated successfully", data: updatedUser });

    /*----------------------------------------------------------------------------------------------------------------------------*/

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//=======================----------------->{ Exports }<---------------=======================================//

module.exports = { createUser, loginUser, getUser, updateUser };


/***********+++++*********+++++++++**********+++++++***********++++++++*******+++++++++*********++++++***********/