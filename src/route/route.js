const express = require("express");
const { createUser,loginUser, getUser, updateUser} = require("../controllers/uesrController");
const { authorization,authentication } = require("../middleware/Authentication");

const router = express.Router();


//Feature 1 User ApIs 
router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/user/:userId/profile",authentication,authorization,getUser);
router.put("/user/:userId/profile",authentication,authorization,updateUser)

//Feature 2 User ApIs 

module.exports =router;