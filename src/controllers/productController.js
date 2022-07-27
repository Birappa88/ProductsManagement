const productModel = require("../models/productModel")
const bcrypt = require("bcrypt");
const { uploadFile } = require("../aws/aws");
const {
    isValid,
    isValidFiles,
    isValidRequestBody,
    isValidObjectId,
    isValidSizes,
    validFileRegex,
    nameRegex,
    passwordRegex,
    phoneRegex,
    pincodeRegex,
    emailRegex,
} = require("../middleware/validator");

const createProduct = async (req, res) => {
    let data = req.body
    let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = data

    if (!isValidRequestBody(data)) {
        return res
            .status(400)
            .send({ status: false, message: "Plz Enter Some input" });
    }
    if (!isValid(title)) {
        return res
            .status(400)
            .send({ status: false, message: "Plz Enter the valid title" });
    }
    if (!nameRegex.test(title)) {
        return res
            .status(400)
            .send({ status: false, message: "plz enter  the valid title" });
    }

    if (!isValid(description)) {
        return res
            .status(400)
            .send({ status: false, message: "Plz Enter the valid description" });
    }
    if (!nameRegex.test(description)) {
        return res
            .status(400)
            .send({ status: false, message: "plz enter  the valid description" });
    }
    if (style) {
        if (!isValid(style)) {
            return res
                .status(400)
                .send({ status: false, message: "Plz Enter the valid style" });
        }
        if (!nameRegex.test(style)) {
            return res
                .status(400)
                .send({ status: false, message: "plz enter  the valid style" });
        }
    }

    if (!price) {
        return res
            .status(400)
            .send({ status: false, message: "plz enter Price of the Product" });
    }

    if (!currencyId) {
        return res
            .status(400)
            .send({ status: false, message: "plz enter the currencyId" });
    }

    if (currencyId !== "INR") {
        return res
            .status(400)
            .send({ status: false, message: "currencyId should be in INR" });
    }

    if (!currencyFormat) {
        return res
            .status(400)
            .send({ status: false, message: "plz enter the currencyFormat" });
    }

    if (currencyFormat !== "₹") {
        return res
            .status(400)
            .send({ status: false, message: "currencyFormat should be in ₹" });
    }
    if (!availableSizes) {
        return res
            .status(400)
            .send({ status: false, message: "plz enter Price of the Product" });
    }
    // if (!["S", "XS","M","X", "L","XXL", "XL"].includes(availableSizes)) {
    //     return res
    //         .status(400) 
    //         .send({ status: false, message: "Plz Enter the valid availableSizes" });
    // }
    // console.log(typeof(installments))
    // if (installments) {
    //     if (typeof(installments) !== "number") {
    //         return res
    //             .status(400)
    //             .send({ status: false, message: "installments should be in Number" });
    //     }
    // }

    let files = req.files;
    if (files && files.length > 0) {
        let uploadProductImage = await uploadFile(files[0]);
        data.productImage = uploadProductImage;
    } else {
        return res
            .status(400)
            .send({ status: false, message: "please upload the profile Image " });
    }

    let productCreated = await productModel.create(data);

    res.status(201).send({
        status: true,
        message: "Product cerated Successfully",
        data: productCreated,
    });
}

//********GET Product ***************/
const getProduct = async function (req, res) {
    try {
        const productId = req.params.productId;
        if (!productId) {
            return res
                .status(400)
                .send({ status: false, message: "plz enter  productId params" });
        }
        if (!isValidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "productId is incorrect" });
        }

        const product = await productModel.findOne({ _id: productId });

        if (!product) {
            return res.status(404).send({
                status: false,
                message: `Product not found with this ${productId} id`,
            });
        }
        return res
            .status(200)
            .send({ status: true, message: "user profile details", data: product });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


//************PUT or Updated *******************/

const updateProduct = async function (req, res) {
    try {
        let data = req.body;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "plz input data" });
        }
        let { fname, lname, email, phone } = data;
        //updated profileImage
        const files = req.files;
        let profileImage;
        if (isValidFiles(files)) {
            const profilePicture = await uploadFile(files[0]);
            profileImage = profilePicture;
        }
        if (fname) {
            if (!nameRegex.test(fname)) {
                return res
                    .status(400)
                    .send({ status: false, message: "plz enter  the valid fname" });
            }
        }
        if (lname) {
            if (!nameRegex.test(lname)) {
                return res
                    .status(400)
                    .send({ status: false, message: "plz enter  the valid lname" });
            }
        }
        if (email) {
            if (!emailRegex.test(email)) {
                return res
                    .status(400)
                    .send({ status: false, message: "plz enter  the valid Email" });
            }
        }

        const newData = { fname, lname, email, phone, password, profileImage };
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: req.userId },
            newData,
            { new: true }
        );
        updatedUser.save();
        return res
            .status(200)
            .send({ status: true, message: "User updated", data: updatedUser });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createProduct, getProduct, updateProduct }