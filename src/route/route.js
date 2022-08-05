//=======================----------------->{ Imports }<-------------=======================================//

const   express = require("express");
const { createUser,loginUser, getUser, updateUser} = require("../controllers/userController");
const { createProduct,getfilterProduct, getProduct, updateProduct, deleteProduct} = require("../controllers/productController");
const { addToCart, upadateCart, getCart, deleteCart} = require("../controllers/cartController");
const { createOrder, updateOrder} = require("../controllers/orderController");
const { authorization,authentication } = require("../middleware/Authentication");

const router = express.Router();

//=======================----------------->{ Apis }<-------------=======================================//

//------->{ Feature 1 :=> USER ApIs }<----------//
router.post("/register",createUser);
router.post("/login",loginUser);
router.get ("/user/:userId/profile",authentication, getUser);
router.put ("/user/:userId/profile",updateUser)

//------->{ Feature 2 :=> PRODUCT ApIs }<----------//
router.post  ("/products",createProduct);
router.get  ("/products",getfilterProduct);
router.get ("/products/:productId",getProduct);
router.put  ("/products/:productId",updateProduct);
router.delete("/products/:productId",deleteProduct);

//-------->{ Feature 3 :=> CART ApIs }<----------//
router.post  ("/users/:userId/cart", addToCart)
router.put  ("/users/:userId/cart", upadateCart)
router.get  ("/users/:userId/cart",getCart)
router.delete("/users/:userId/cart", authentication, authorization,deleteCart)

//-------->{ Feature 4 :=> ORDER ApIs }<----------//
router.post("/users/:userId/orders", createOrder)
router.put ("/users/:userId/orders",updateOrder)


//=======================----------------->{ Export }<-------------=======================================//

module.exports =router;


/***********+++++*********+++++++++**********+++++++***********++++++++*******+++++++++*********++++++***********/