//=======================----------------->{ Imports }<-------------=======================================//

const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

//=======================----------------->{ Order Shema }<-------------=======================================//

const orderSchema = new mongoose.Schema(
    {
        userId:        { type: ObjectId, required: true, trim: true, ref: "user" },
        items: [{
            productId: { type: ObjectId, required: true, trim: true, ref: "product" },
            quantity:  { type: Number,   required: true, trim: true, min: 1 }
        }],
        totalPrice:    { type: Number,   required: true, trim: true },
        totalItems:    { type: Number,   required: true, trim: true },
        totalQuantity: { type: Number,   required: true, trim: true },
        status:        { type: String,   default: 'pending', lowercase: true, enum: ['pending', 'completed', 'cancelled'], trim: true },
        cancellable:   { type: Boolean,  default: true },
        isDeleted:     { type: Boolean,  default: false },
        deletedAt:     { type: Date }
    },
    { timestamps: true }
)

//=======================----------------->{ Export }<-------------=======================================//

module.exports = mongoose.model("order", orderSchema);


/**********+++++*********+++++++++**********+++++++***********++++++++*******+++++++++*********++++++***********/