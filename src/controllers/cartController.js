const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const {
    isValid,
    isValidRequestBody,
    isValidObjectId,
} = require("../middleware/validator");

const addToCart = async (req, res) => {
    try {
        const data = req.body
        const userId = req.params.userId
        const { cartId, productId } = data

        const userExist = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Enter valid ProductId" })
        }
        const productExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productExist) {
            return res.status(404).send({ status: false, message: "Product is not found with this ProductId" })
        }

        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Enter valid CartId" })
            }
            const cartExist = await cartModel.findOne({ _id: cartId, isDeleted: false })
            if (!cartExist) {
                return res.status(404).send({ status: false, message: "Cart is not found with this CartId" })
            }
        }
        const checkUser = await cartModel.findOne({ userId: userId })
        if (!checkUser) {


        }
        else {

            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, message: "Enter valid ProductId" })
            }
            const productExist = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!productExist) {
                return res.status(404).send({ status: false, message: "Product is not found with this ProductId" })
            }
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}