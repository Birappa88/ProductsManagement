const mongoose = require("mongoose");

const isValid = function(value){
    if(typeof value === "undefined" || value === null)
    return  false;
    if(typeof value === "string" && value.trim().length === 0)
    return false;
    return true;
};
const isValidRequestBody = function (requestBody){
    return Object.keys(requestBody).length > 0;

};
const isValidFiles = function(files){
    if(files && files.length > 0)
    return true;
}

const validFileRegex = /^.+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[pP][nN][gG])|(?:[jJ][pP][gG]))$/
const nameRegex = /^[a-zA-Z ]{2,30}$/
// const passwordRegex = /^(?=.[0-9])(?=.[A-Z])(?=.[a-z])(?=.[!@#$%^&?%|])[a-zA-Z0-9!@#$%^&?%|]{6,16}$/
const phoneRegex =  /^((\+91)?|91)?[6789][0-9]{9}$/;
const pincodeRegex = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/
const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/

module.exports = {isValid,isValidFiles,isValidRequestBody,validFileRegex,nameRegex,phoneRegex,pincodeRegex,emailRegex};