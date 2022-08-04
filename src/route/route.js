const express = require("express");
const { createUser,loginUser, getUser, updateUser} = require("../controllers/userController");
const { createProduct,getfilterProduct, getProduct, updateProduct, deleteProduct} = require("../controllers/productController");
const { addToCart, upadateCart, getCart, deleteCart} = require("../controllers/cartController");
const { createOrder, updateOrder} = require("../controllers/orderController");
const { authorization,authentication } = require("../middleware/Authentication");

const router = express.Router();


//-------(Feature 1 :=> User ApIs)----------//
router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/user/:userId/profile",authentication, getUser);
router.put("/user/:userId/profile",authentication,authorization,updateUser)

//-------(Feature 2 :=> Product ApIs)----------//
router.post("/products",createProduct);
router.get("/products",getfilterProduct);
router.get("/products/:productId",getProduct);
router.put("/products/:productId",updateProduct);
router.delete("/products/:productId",deleteProduct);

//-------(Feature 3 :=> Cart ApIs)----------//
router.post("/users/:userId/cart", addToCart)
router.put("/users/:userId/cart",authentication, authorization, upadateCart)
router.get("/users/:userId/cart",getCart)
router.delete("/users/:userId/cart", authentication, authorization,deleteCart)

//-------(Feature 4 :=> Order ApIs)----------//
router.post("/users/:userId/orders",authentication, authorization, createOrder)
router.put("/users/:userId/orders",authentication, authorization, updateOrder)

module.exports =router;