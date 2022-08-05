//=======================----------------->{ Imports }<-------------=======================================//

const orderModel = require("../models/orderModel")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const {
    isValidRequestBody,
    isValidObjectId,
} = require("../middleware/validator");


//=======================----------------->{ Create Order }<-------------=======================================//

const createOrder = async (req, res) => {
    try {

        const UserId = req.params.userId
        const data = req.body
        const CartId = data.cartId
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const userExist = await userModel.findOne({ _id: UserId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data to create order" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const checkUser = await cartModel.findOne({ userId: UserId })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "Cart is not found with this UserId" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidObjectId(CartId)) {
            return res.status(400).send({ status: false, message: "Enter valid CartId" })
        }

        const getCart = await cartModel.findOne({ _id: CartId })
        if (!getCart) {
            return res.status(404).send({ status: false, message: "Cart is not found with this CartId" })
        }
        if (UserId != getCart.userId) {
            return res.status(401).send({ status: false, message: "This is not a cart For this user" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const userOrdered = await orderModel.findOne({ userId: UserId })
        if (userOrdered) {
            return res.status(400).send({ status: false, message: "User has already placed an order" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        data.userId = UserId
        data.items = getCart.items
        data.totalPrice = getCart.totalPrice
        data.totalItems = getCart.totalItems
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let TotalQuantity = 0
        for (let i = 0; i < getCart.items.length; i++) {
            TotalQuantity = TotalQuantity + getCart.items[i].quantity
        }
        data.totalQuantity = TotalQuantity
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (data.cancellable != null) {
            data.cancellable = JSON.parse(data.cancellable)

            if (typeof (data.cancellable) != "boolean") {
                return res.status(400).send({ status: false, message: "Cancellable should be True or False" })
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (getCart.totalItems == 0) {
            return res.status(400).send({ status: false, message: "Can't Create Order, as there is no item in your cart" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const createdOrder = await orderModel.create(data)
        /*----------------------------------------------------------------------------------------------------------------------------*/

        await cartModel.findOneAndUpdate({ _id: CartId }, { items: [], totalItems: 0, totalPrice: 0 }, { new: true })
        /*----------------------------------------------------------------------------------------------------------------------------*/

        return res.status(201).send({ status: true, message: "Order is placed Successfully. Wait for your order to arrive", data: createdOrder })

        /*----------------------------------------------------------------------------------------------------------------------------*/

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=======================----------------->{ Update Order Status }<--------------=======================================//

const updateOrder = async (req, res) => {
    try {

        const UserId = req.params.userId
        const data = req.body
        const OrderId = data.orderId
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const userExist = await userModel.findOne({ _id: UserId, isDeleted: false })
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User is not found with this UserId" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data to update Order" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const checkUser = await cartModel.findOne({ userId: UserId })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "Cart is not found with this UserId" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidObjectId(OrderId)) {
            return res.status(400).send({ status: false, message: "Enter valid OrderId." })
        }

        const orderedUser = await orderModel.findOne({ _id: OrderId })
        if (!orderedUser) {
            return res.status(404).send({ status: false, message: "Your Order is not found with this OrderId" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!data.status) {
            return res.status(400).send({ status: false, message: "Enter status to update order" })
        }
        if (['pending', 'completed', 'cancelled'].indexOf(data.status.trim().toLowerCase()) == -1) {
            return res.status(400).send({ status: false, message: "Status must be either 'pending', 'completed' or 'cancelled']" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (orderedUser.status == "cancelled") {
            return res.status(400).send({ status: false, message: "Your order cannot be updated, it has already been cancelled" })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (data.status == "cancelled") {

            if (orderedUser.cancellable) {

                const updateOrder = await orderModel.findOneAndUpdate({ _id: OrderId }, data, { new: true })

                return res.status(200).send({ status: true, message: "Your Order is Cancelled", data: updateOrder })
            }
            /*----------------------------------------------------------------------------------------------------------------------------*/
            else {
                return res.status(400).send({ status: false, message: "Your order is not cancellable" })
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const updateOrder = await orderModel.findOneAndUpdate({ _id: OrderId }, data, { new: true })
        /*----------------------------------------------------------------------------------------------------------------------------*/

        return res.status(200).send({ status: true, message: "Your Order is Updated", data: updateOrder })

        /*----------------------------------------------------------------------------------------------------------------------------*/

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=======================----------------->{ Exports }<--------=======================================//

module.exports = {
    createOrder,
    updateOrder
}


/**********++++++*********+++++++++************++++++++++***********++++++++*******+++++++++*********++++++***********/