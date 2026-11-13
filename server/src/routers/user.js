const express = require("express");
const user = express.Router();
user.post("/me" , (req , res) => {
    const data = req.user;

    console.log(data)
})
module.exports = user;
