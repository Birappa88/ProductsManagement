const express = require("express");
const { createUser } = require("../controllers/uesrController");
const router = express.Router();

router.post("/register", createUser);

module.exports =router;