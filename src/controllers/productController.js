//=======================----------------->{ Imports }<-------------=======================================//

const productModel = require("../models/productModel")
const { uploadFile } = require("../aws/aws");
const {
    isValid,
    isValidRequestBody,
    isValidObjectId,
    stringRegex,
} = require("../middleware/validator");


//=======================----------------->{ Create Product }<------------------=======================================//

const createProduct = async (req, res) => {
    try {

        let data = req.body
        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = data
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidRequestBody(data)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter data to create Product" });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter title" });
        }
        if (!stringRegex.test(title)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter valid title" });
        }
        let checkTitle = await productModel.findOne({ title: title })
        if (checkTitle) {
            return res
                .status(400)
                .send({ status: false, message: "Title is already exist, use new title" });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValid(description)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter valid description" });
        }
        if (!stringRegex.test(description)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter valid description" });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (style) {
            if (!isValid(style)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter style" });
            }
            if (!stringRegex.test(style)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid style" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!price) {
            return res
                .status(400)
                .send({ status: false, message: "Enter Price of the Product" });
        }
        if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(price)) {
            return res.status(400).send({ status: false, message: "Enter valid price " })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (currencyId != null) {
            if (currencyId !== "INR") {
                return res
                    .status(400)
                    .send({ status: false, message: "CurrencyId should be in INR only" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (currencyFormat != null) {
            if (currencyFormat !== "₹") {
                return res
                    .status(400)
                    .send({ status: false, message: "CurrencyFormat should be in ₹ only" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!availableSizes) {
            return res.status(400).send({ status: false, message: "Enter available sizes" });
        }
        let sizes = availableSizes.toUpperCase().split(",")
        let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]

        if (sizes.some(x => !arr.includes(x.trim()))) {
            return res.status(400).send({ status: false, message: `Available sizes must be out of ${arr}` })
        }
        data['availableSizes'] = sizes
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (installments) {
            if (!/^[0-9]+$/.test(installments)) return res.status(400).send({ status: false, message: `Enter valid Installments` })
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let files = req.files;
        if (files && files.length > 0) {
            let uploadProductImage = await uploadFile(files[0]);
            data.productImage = uploadProductImage;
        }
        else {
            return res.status(400).send({ status: false, message: "Upload product Image" });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let productCreated = await productModel.create(data);
        /*----------------------------------------------------------------------------------------------------------------------------*/

        res.status(201).send({ status: true, message: "Product created Successfully", data: productCreated });

        /*----------------------------------------------------------------------------------------------------------------------------*/

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=======================----------------->{ GET Filtered Product }<---------------=======================================//

const getfilterProduct = async (req, res) => {
    try {

        let data = req.query;
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidRequestBody(data)) {

            const checkProduct = await productModel.find({ isDeleted: false });

            if (!checkProduct) {
                return res.status(404).send({ status: false, message: "No any Product found" });
            }

            return res.status(200).send({
                status: true,
                message: `Total ${checkProduct.length} Products found successfully...`,
                data: checkProduct,
            });
            /*-------------------------------------------------------------------------------------------------------------*/
        }
        else {

            let { name, size, priceGreaterThan, priceLessThan, priceSort } = data

            let filter = { isDeleted: false };
            /*-------------------------------------------------------------------------------------------------------------*/

            if (name != null) {
                if (!stringRegex.test(name)) {
                    return res
                        .status(400)
                        .send({ status: false, message: "Enter valid Name" });
                }
                filter.title = { $regex: name, $options: "i" };
            }
            /*-------------------------------------------------------------------------------------------------------------*/

            if (size != null) {
                let sizes = size.toUpperCase().split(",")
                let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]

                if (sizes.length > 1) {
                    return res.status(400).send({ status: false, message: `Available size must be only one` })
                }
                if (sizes.some(x => !arr.includes(x.trim()))) {
                    return res.status(400).send({ status: false, message: `Available sizes must be out of ${arr}` })
                }

                filter.availableSizes = size.toUpperCase()
            }
            /*-------------------------------------------------------------------------------------------------------------*/

            if (priceGreaterThan != null) {
                if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(priceGreaterThan)) {
                    return res
                        .status(400)
                        .send({ status: false, message: `Enter valid priceGreaterThan` });
                }
                filter.price = { $gt: priceGreaterThan };
            }

            if (priceLessThan != null) {
                if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(priceLessThan)) {
                    return res
                        .status(400)
                        .send({ status: false, message: `Enter valid priceLessThan` });
                }
                filter.price = { $lt: priceLessThan };
            }

            if (priceGreaterThan && priceLessThan) {
                filter["price"] = { $gt: priceGreaterThan, $lt: priceLessThan };
            }
            /*-------------------------------------------------------------------------------------------------------------*/

            if (priceSort != -1 && priceSort != 1) {
                return res
                    .status(400)
                    .send({ status: false, message: "Use 1 for Ascending or -1 for Descending Price lists" });
            }

            /*--------------------------------------------------------------------------------------------------------------------------*/

            let productList = await productModel.find(filter).sort({ price: priceSort });

            if (productList.length == 0) {
                return res
                    .status(404)
                    .send({ status: false, message: "No such any product Available" });
            }
            /*---------------------------------------------------------------------------------------------------------------------------*/

            return res
                .status(200)
                .send({ status: true, message: `Total ${productList.length} Products Found succesfully`, data: productList });

            /*----------------------------------------------------------------------------------------------------------------------------*/
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


//=======================----------------->{ GET Product }<-----------------=======================================//

const getProduct = async function (req, res) {
    try {

        const productId = req.params.productId;
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "ProductId is not correct" });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const product = await productModel.findOne({ _id: productId, isDeleted: false });

        if (!product) {
            return res.status(404).send({ status: false, message: `Product not found with this ${productId} id` });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        return res.status(200).send({ status: true, message: "Get Product details", data: product });

        /*----------------------------------------------------------------------------------------------------------------------------*/

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


//=======================----------------->{ Update Product }<----------------=======================================//

const updateProduct = async function (req, res) {
    try {

        let data = req.body;
        let ProductId = req.params.productId
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidObjectId(ProductId)) {
            return res
                .status(400)
                .send({ status: false, message: "ProductId is not correct" });
        }

        let findProduct = await productModel.findOne({ _id: ProductId, isDeleted: false })

        if (!findProduct) {
            return res.status(404).send({
                status: false,
                message: `Product not found with this ${ProductId} id`,
            });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = data;
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (title != null) {
            if (!stringRegex.test(title)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid title" });
            }
            let checkTitle = await productModel.findOne({ title: title })
            if (checkTitle) {
                return res
                    .status(400)
                    .send({ status: false, message: "Title is already exist, plz enter new title" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (description != null) {
            if (!stringRegex.test(description)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid description" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (price != null) {
            if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(price)) {
                return res.status(400).send({ status: false, message: "Enter valid price" })
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (currencyFormat != null) {
            if (currencyFormat !== "₹") {
                return res
                    .status(400)
                    .send({ status: false, message: "CurrencyFormat should be in '₹' only" });
            }
        }
        if (currencyId != null) {
            if (currencyId !== "INR") {
                return res
                    .status(400)
                    .send({ status: false, message: "CurrencyId should be in 'INR' only" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (style != null) {
            if (!stringRegex.test(style)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid style" });
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (availableSizes != null) {
            let sizes = availableSizes.toUpperCase().split(",")
            let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]

            if (sizes.some(x => !arr.includes(x.trim()))) {
                return res.status(400).send({ status: false, message: `Available sizes must be out of ${arr}` })
            }
            data['availableSizes'] = sizes
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (installments != null) {
            if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(installments)) {
                return res.status(400).send({ status: false, message: `Enter valid installments` })
            }
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let files = req.files;
        if ((files && files.length > 0)) {
            const productImage = await uploadFile(files[0])
            data.productImage = productImage
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: ProductId },
            data,
            { new: true }
        );
        updatedProduct.save();
        /*----------------------------------------------------------------------------------------------------------------------------*/

        return res.status(200).send({ status: true, message: "Product updated successfully", data: updatedProduct });

        /*----------------------------------------------------------------------------------------------------------------------------*/

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


//=======================----------------->{ Delete Product }<-------------=======================================//

const deleteProduct = async function (req, res) {
    try {

        let ProductId = req.params.productId
        /*----------------------------------------------------------------------------------------------------------------------------*/

        if (!isValidObjectId(ProductId)) {
            return res
                .status(400)
                .send({ status: false, message: "ProductId is not correct" });
        }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let Product = await productModel.findOne({ _id: ProductId })
        if (!Product) { return res.status(404).send({ status: false, message: "Product not found with this ProductId" }) }

        let Product1 = await productModel.findOne({ _id: ProductId, isDeleted: false })
        if (!Product1) { return res.status(400).send({ status: false, message: "Product is already Deleted" }) }
        /*----------------------------------------------------------------------------------------------------------------------------*/

        let check = await productModel.findOneAndUpdate({ _id: ProductId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        /*----------------------------------------------------------------------------------------------------------------------------*/

        return res.status(200).send({ status: true, message: "Product is Deleted Succesfully", data: check })

        /*----------------------------------------------------------------------------------------------------------------------------*/

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//=======================----------------->{ Exports }<---------------=======================================//

module.exports = { createProduct, getfilterProduct, getProduct, updateProduct, deleteProduct }


/**********++++++*********+++++++++************++++++++++***********++++++++*******+++++++++*********++++++***********/