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

        const userExist = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data to add cart" })
        }

        const ProductId = data.items.productId
        const Quantity = data.items.quantity
        const cartId = data.cartId

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
            const cartExist = await cartModel.findOne({ _id: cartId })
            if (!cartExist) {
                return res.status(404).send({ status: false, message: "Cart is not found with this CartId" })
            }
            if (cartId != checkUser._id) {
                return res.status(400).send({ status: false, message: "This is not a cart For this user" })
            }

            for (let i = 0; i < cartExist.items.length; i++) {
                if (`${cartExist.items[i].productId}` == `${ProductId}`) {
                    let quanty = parseInt(Quantity)
                    cartExist.items[i].quantity = cartExist.items[i].quantity + quanty

                    cartExist.totalPrice = checkUser.totalPrice + (Quantity * productExist.price)
                    cartExist.save()
                    return res.status(200).send({ status: true, message: "Product Quantity is added to Cart Successfully", data: cartExist })
                }
            }
            let updatedItems = checkUser.items
            updatedItems.push({ productId: ProductId, quantity: Quantity })
            let TotalPrice = checkUser.totalPrice + (Quantity * productExist.price)
            let TotalItems = updatedItems.length

            let updatedCart = { items: updatedItems, totalPrice: TotalPrice, totalItems: TotalItems }

            const addedProduct = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCart, { new: true })
            return res.status(200).send({ status: true, message: "Product is added to Cart Successfully", data: addedProduct })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const upadateCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body

        const userExist = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data to add cart" })
        }

        const ProductId = data.productId
        const RemoveProduct = data.removeProduct
        const CartId = data.cartId

        if (!isValidObjectId(ProductId)) {
            return res.status(400).send({ status: false, message: "Enter valid ProductId" })
        }
        const productExist = await productModel.findOne({ _id: ProductId, isDeleted: false })
        if (!productExist) {
            return res.status(404).send({ status: false, message: "Product is not found with this ProductId" })
        }
        if (!isValidObjectId(CartId)) {
            return res.status(400).send({ status: false, message: "Enter valid CartId" })
        }
        const cartExist = await cartModel.findOne({ _id: CartId })
        if (!cartExist) {
            return res.status(404).send({ status: false, message: "CartId is not found with this CartId" })
        }

        if (!RemoveProduct) {
            return res.status(400).send({ status: false, message: "RemoveProduct is required" })
        }
        if (RemoveProduct != 0 && RemoveProduct != 1) {
            return res.status(400).send({ status: false, message: "Enter 0 for remove Product or 1 for decrement Product quantity" })
        }

        if (cartExist.items.length == 0) {
            return res.status(400).send({ status: false, message: "Items are removed" })
        }

        for (let i = 0; i < cartExist.items.length; i++) {

            if (`${cartExist.items[i].productId}` == `${ProductId}`) {

                if (RemoveProduct == 1 && cartExist.items[i].quantity > 1) {
                    cartExist.items[i].quantity = (cartExist.items[i].quantity - 1)
                    cartExist.save()
                    const updatedCart = await cartModel.findOneAndUpdate({ _id: CartId }, { $inc: { totalPrice: -(productExist.price) }, totalItems: cartExist.items.length }, { new: true }).lean()

                    updatedCart.items = cartExist.items

                    return res.status(200).send({ status: true, message: "Product quantity is Decremented", data: updatedCart })
                }
                else {
                    const updatedCart = await cartModel.findOneAndUpdate({ _id: CartId }, { $pull: { items: { productId: ProductId } }, $inc: { totalItems: -1, totalPrice: -(productExist.price * cartExist.items[i].quantity) } }, { new: true })
                    return res.status(200).send({ status: true, message: `${productExist.title} is removed`, data: updatedCart })
                }
            }
        }
        return res.status(400).send({ status: false, message: "Product not found, may have been removed from cart" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const getCart = async (req, res) => {
    try {
        const UserId = req.params.userId

        const userExist = await userModel.findOne({ _id: UserId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }

        const getCart = await cartModel.findOne({ userId: UserId }).populate({ path: "items.productId", select: { createdAt: 0, updatedAt: 0, __v: 0 } })

        if (!getCart) {
            return res.status(404).send({ status: false, message: "Cart is not found with this UserId" })
        }

        return res.status(200).send({ status: true, message: "Get the Cart Details", data: getCart })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteCart = async (req, res) => {
    const UserId = req.params.userId

    const userExist = await userModel.findOne({ _id: UserId, isDeleted: false })
    if (!userExist) {
        return res.status(404).send({ status: false, message: "User is not found with this UserId" })
    }

    const checkCart = await cartModel.findOne({ userId: UserId });

    if (!checkCart) {
        return res
            .status(400)
            .send({ status: false, message: "Cart is not found with this UserId" });
    }
    if (checkCart.items.length == 0) {
        return res
            .status(400)
            .send({ status: false, message: "Cart is already empty" });
    }

    await cartModel.findOneAndUpdate({ userId: UserId }, { items: [], totalItems: 0, totalPrice: 0 }, { new: true })

    return res.status(204).send({ status: true, message: "Deleted the Cart Items" })
}


module.exports = {
    addToCart,
    upadateCart,
    getCart,
    deleteCart
}

