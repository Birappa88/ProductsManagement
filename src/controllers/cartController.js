const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const {
    isValidRequestBody,
    isValidObjectId,
} = require("../middleware/validator");

const addToCart = async (req, res) => {
    try {
        const userId = req.params.userId
        const data = req.body
        const ProductId = data.items.productId
        const Quantity = data.items.quantity
        const cartId = data.cartId

        const userExist = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }

        if (!isValidObjectId(ProductId)) {
            return res.status(400).send({ status: false, message: "Enter valid ProductId" })
        }
        const productExist = await productModel.findOne({ _id: ProductId, isDeleted: false })
        if (!productExist) {
            return res.status(404).send({ status: false, message: "Product is not found with this ProductId" })
        }
        const checkUser = await cartModel.findOne({ userId: userId })
        if (!checkUser) {
            if (cartId) {
                return res.status(400).send({ status: false, message: "User is new, let's create cart first" })
            }
            data.userId = userId
            data.totalPrice = (productExist.price * Quantity)
            data.totalItems = 1

            const createCart = await cartModel.create(data)
            return res.status(201).send({ status: true, message: "Cart is created successfully", data: createCart })
        }
        else {
            if (!cartId) {
                return res.status(400).send({ status: false, message: "Enter CartId of User to add Product" })
            }
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Enter valid CartId" })
            }
            const cartExist = await cartModel.findOne({ _id: cartId, isDeleted: false })
            if (!cartExist) {
                return res.status(404).send({ status: false, message: "Cart is not found with this CartId" })
            }
            if (cartId != checkUser._id) {
                return res.status(400).send({ status: false, message: "This is not a cart For this user" })
            }

            let updatedItems = checkUser.items
            updatedItems.push({productId: ProductId, quantity: Quantity})
            let TotalPrice = checkUser.totalPrice + (Quantity * productExist.price)
            let TotalItems = updatedItems.length

            let updatedCart = { items: updatedItems, totalPrice: TotalPrice, totalItems: TotalItems }

            const addProduct = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCart, { new: true })

            return res.status(200).send({ status: true, message: "Product is added to Cart Successfully", data: addProduct })
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {
    addToCart
}