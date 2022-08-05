//=======================----------------->{ Import }<-------------=======================================//

const mongoose = require("mongoose")

//=======================----------------->{ Product Schema }<-------------=======================================//

const productSchema = new mongoose.Schema(
    {
        title:          { type: String, required: true, unique: true, trim : true },
        description:    { type: String, required: true, trim : true },
        price:          { type: Number, required: true, trim : true },
        currencyId:     { type: String, required: true, trim : true, default : "INR" },
        currencyFormat: { type: String, required: true, trim : true, default : "₹" },
        productImage:   { type: String, required: true, trim : true },
        isFreeShipping: { type: Boolean, default: false },
        style:          { type: String , trim : true },
        installments:   { type: Number , trim : true },
        availableSizes: { type:[String] },
        deletedAt:      { type: Date, default : null },
        isDeleted:      { type: Boolean, default: false }

    },
    { timestamps: true }
)

//=======================----------------->{ Export }<-------------=======================================//

module.exports = mongoose.model("product", productSchema);
  

/**********+++++*********+++++++++**********+++++++***********++++++++*******+++++++++*********++++++***********/