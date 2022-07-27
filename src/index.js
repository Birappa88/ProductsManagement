const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./route/route");
const multer = require("multer");
const app = express();

app.use(bodyParser.json());

app.use(multer().any());

mongoose
  .connect(
    "mongodb+srv://Birappa:MangoDB@cluster0.m5phg.mongodb.net/group15Database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("mongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 2000, function () {
  console.log("Express app running on port " + (process.env.PORT || 2000));
});
