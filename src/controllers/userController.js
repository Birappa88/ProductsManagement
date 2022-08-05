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

//**************************[Create User]*************************//

const createUser = async function (req, res) {
  try {
    let body = req.body;
    let { fname, lname, phone, email, password, address } = body;

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to create User" });
    }

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

    let files = req.files;
    if (files && files.length > 0) {
      let uploadProfileImage = await uploadFile(files[0]);
      body.profileImage = uploadProfileImage;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Upload profile Image" });
    }

    let userCreated = await userModel.create(body);

    res.status(201).send({
      status: true,
      message: "User created Successfully",
      data: userCreated,
    });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


//**************************[Login User]*************************//

const loginUser = async function (req, res) {
  try {
    let body = req.body;
    const { email, password } = body;

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to login" });
    }

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

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Password to login" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password is invalid or its length should be 8-15",
      });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "User not found with this Email" });
    }

    let userPassword = await bcrypt.compareSync(body.password, user.password);

    if (!userPassword) {
      return res
        .status(401)
        .send({ status: false, message: "Password is not correct" });
    }

    let token = jwt.sign(
      {
        userId: user._id, //unique Id
        at: Math.floor(Date.now() / 1000), //issued date
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, //expires in 24 hr
      },
      "Group-15"
    );

    res.setHeader("Authorization", token);

    res.status(200).send({
      status: true,
      message: "User login Successful",
      data: { userId: user._id, token: token },
    });

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


//************************[GET User]*************************//

const getUser = async function (req, res) {
  try {
    const params = req.params;
    const userId = params.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "UserId is not correct" });
    }

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found with this ${userId} id`,
      });
    }

    if (req.useId != userId) {
      return res.status(401).send({ status: false, message: "you are not authenticated User" });
    }

    return res
      .status(200)
      .send({ status: true, message: "User profile details", data: user });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//********************************[update user]*****************************//

const updateUser = async function (req, res) {
  try {
    let data = req.body;
    let UserId = req.params.userId

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to create User" });
    }

    let { fname, lname, email, password, phone, address } = data;

    let newData = {}

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
      newData["fname"] = fname
    }

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
      newData["lname"] = lname
    }

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
      newData["email"] = email
    }

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
      newData["phoen"] = phone
    }

    if (password != null) {
      if (!isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter password" });
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).send({
          status: false,
          message: `${password} is invalid or its length should be 8-15`,
        });
      }
      password = await bcrypt.hash(password, 10);
      newData["password"] = password
    }

    if (address ) {
      address = JSON.parse(address);
      if (!isValid(address)) {
        return res
        .status(400)
        .send({ status: false, message: "Enter address" });
      }
      
      if (address.shipping != null) {
      //   if (!isValid(address.shipping)) {
      //     return res
      //     .status(400)
      //     .send({ status: false, message: "Enter address shipping" });
      //   }
      // }
      if (address.shipping.street != null) {
        // if (!isValid(address.shipping.street)) {
          //   return res
          //     .status(400)
          //     .send({ status: false, message: "Enter address shipping street" });
          // }
          newData['address.shipping.street'] = address.shipping.street
          JSON.parse(address.shipping.street)
          console.log(newData)
      }

      if (address.shipping.city != null) {
        if (!isValid(address.shipping.city)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter address shipping city" });
        }
        newData["address.shipping.city"] = address.shipping.city
      }

      if (address.shipping.pincode != null) {
        if (!isValid(address.shipping.pincode)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter address shipping pincode" });
        }
        if (!pincodeRegex.test(shipping.pincode)) { 
          return res.status(400).send({ status: false, message: `Enter valid shipping pincode` })
         }
        newData["address.shipping.pincode"] = address.shipping.pincode
      }
    }

      if (address.billing != null) {
        if (!isValid(address.billing)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter address billing" });
        }
      }
      if (address.billing.street != null) {
        if (!isValid(address.billing.street)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter address billing street" });
        }
        newData["address.billing.street"] = address.billing.street
      }

      if (address.billing.city != null) {
        if (!isValid(address.billing.city)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter address billing city" });
        }
        newData["address.billing.city"] = address.billing.city
      }

      if (address.billing.pincode != null) {
        if (!isValid(address.billing.pincode)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter address billing pincode" });
        }
        if (!pincodeRegex.test(billing.pincode)) { 
          return res.status(400).send({ status: false, message: `Enter valid billing pincode` })
         }
        newData["address.billing.pincode"] = address.billing.pincode
      }
    }

    console.log(newData)
      // const shipping = address.shipping;
      // if (shipping) {
      //   if (shipping.pincode) {
      //     if (!pincodeRegex.test(shipping.pincode))
      //       return res.status(400).send({
      //         status: false,
      //         message: `Enter valid shipping pincode`,
      //       });
      //   }
      // }

    //   const billing = address.billing;
    //   if (billing) {
    //     if (billing.pincode) {
    //       if (!pincodeRegex.test(billing.pincode)) {
    //         return res.status(400).send({
    //           status: false,
    //           message: `Enter valid billing pincode`,
    //         });
    //       }
    //     }
    //   }
    // }

    // console.log(typeof (address))

    // const newData = {
    //   fname, lname, email, phone, password,
    //   address
    // }


    // const updateUser = {}

    // if (address) {

    //   const shipping = address.shipping;
    //   if (shipping) {
    //     if (shipping.street) {
    //       address.shipping.street = shipping.street;
    //       console.log(address.shipping.street)
    //     }
    //     if (shipping.city) {
    //       shipping.city = shipping.city;
    //     }
    //     if (shipping.pincode) {
    //       shipping.pincode = shipping.pincode;
    //     }
    //   }
    //   const billing = address.billing;
    //   if (billing) {
    //     if (billing.street) {
    //       address.billing.street = billing.street;
    //     }
    //     if (billing.city) {
    //       address.billing.city = billing.city;
    //     }
    //     if (billing.pincode) {
    //       address.billing.pincode = billing.pincode
    //     }
    //   }
    // }
    // updateUser.address = address
    // console.log(updateUser)

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: UserId },
      newData,
      { new: true }
    ); 

    let files = req.files
    if (files.length > 0) {
      const profilePicture = await uploadFile(files[0]);
      updatedUser.profileImage = profilePicture
    }

    updatedUser.save();

    return res
      .status(200)
      .send({ status: true, message: "User details updated successfully", data: updatedUser });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUser, loginUser, getUser, updateUser };
