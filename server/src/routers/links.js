const express = require("express");
const links = express.Router();
const db = require("./../modules/db");
const { randomUUID } = require("crypto");

links.post("/add-link", (req, res) => {
  const { title, category, url, description, is_privet } = req.body;
  const usr = req.user.id;

  // Validate Data
  if (!title || !category || !url || typeof is_privet !== "boolean") {
    return res.status(400).json({
      success: false,
      msg: "Missing required data",
    });
  }

  // Check Category
  const checkCategory = `
        SELECT id
        FROM categories
        WHERE id = ? AND user_id = ?
        LIMIT 1
    `;

  db.query(checkCategory, [category, usr], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        msg: "Internal Server Error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Category Was Not Found",
      });
    }

    // Check Duplicate
    const checkDuplicate = `
            SELECT id, title, url, is_privet
            FROM links
            WHERE user_id = ?
            AND category_id = ?
            AND (title = ? OR url = ?)
            LIMIT 1
        `;

    db.query(checkDuplicate, [usr, category, title, url], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          msg: "Internal Server Error",
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          success: false,
          msg: "Title or URL already exists",
          result: result[0],
        });
      }

      // Insert Link
      const id = randomUUID();

      const insertLink = `
                    INSERT INTO links
                    (id, user_id, category_id, title, url, description, is_privet)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

      db.query(
        insertLink,
        [id, usr, category, title, url, description || null, is_privet],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              msg: "Internal Server Error",
            });
          }

          if (result.affectedRows > 0) {
            return res.status(201).json({
              success: true,
              msg: "Link Added Successfully",
              link_id: id,
            });
          }

          return res.status(500).json({
            success: false,
            msg: "Failed to add link",
          });
        },
      );
    });
  });
});

module.exports = links;
