const express = require("express");
const { createUser,loginUser, getUser, updateUser} = require("../controllers/uesrController");
const { createProduct,getfilterProduct, getProduct, updateProduct, deleteProduct} = require("../controllers/productController");
const { addToCart, upadateCart, getCart, deleteCart} = require("../controllers/cartController");
const { authorization,authentication } = require("../middleware/Authentication");

const router = express.Router();


//-------(Feature 1 :=> User ApIs)----------//
router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/user/:userId/profile",authentication, authorization, getUser);
router.put("/user/:userId/profile",authentication,authorization,updateUser)

//-------(Feature 2 :=> Product ApIs)----------//
router.post("/products",createProduct);
router.get("/products",getfilterProduct);
router.get("/products/:productId",getProduct);
router.put("/products/:productId",updateProduct);
router.delete("/products/:productId",deleteProduct);

//-------(Feature 3 :=> Cart ApIs)----------//
router.post("/users/:userId/cart", addToCart)
router.put("/users/:userId/cart", upadateCart)
router.get("/users/:userId/cart", getCart)
router.delete("/users/:userId/cart", deleteCart)

module.exports =router;