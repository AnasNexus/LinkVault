const express = require("express");
const { randomUUID } = require("crypto");

const db = require("./../modules/db");
const categary = express.Router();

categary.post("/add-cat", (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400).json({
      success: false,
      msg: "Missing Data",
    });
  }

  const usr = req.user.id;
  const id = randomUUID();

  const sql = "SELECT * FROM `categories` WHERE `user_id`=? AND `name`=?";
  db.query(sql, [usr, name], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, msg: "Internal Server Error" });
    }
    if (result.length > 0) {
      return res
        .status(409)
        .json({ success: false, msg: "The Categary Already Exist" });
    }
    const sql =
      "INSERT INTO `categories`(`id`, `user_id`, `name`, `description`) VALUES (?,?,?,?)";
    db.query(sql, [id, usr, name, description], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, msg: "Internal Server Error" });
      }
      if (result.affectedRows > 0) {
        res.status(201).json({
          success: true,
        });
      } else {
        res.status(500).json({ success: false, msg: "Someting Went wrong !" });
      }
    });
  });
});

module.exports = categary;
