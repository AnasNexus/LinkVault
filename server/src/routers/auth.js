// Initialization Require Module
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Import db.js file
const db = require("./../modules/db");
// Initialization jwt secret from .env file
const secret = process.env.JWT_SECRET;
// Initialization AuthAPI Varuable
const AuthAPI = express.Router();
// Login And Register Routes


AuthAPI.post("/login", (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            msg: "Missing Data"
        });
    }

    const sql = "SELECT * FROM `users` WHERE `username`=? OR `email`=?";

    db.query(sql, [username, username], async (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                msg: "Invalid username or password"
            });
        }

        try {
            const user = result[0];

            const is_match = await bcrypt.compare(
                password,
                user.password
            );

            if (!is_match) {
                return res.status(401).json({
                    success: false,
                    msg: "Invalid username or password"
                });
            }

            const usr = {
                id: user.id,
                email: user.email,
                username: user.username
            };

            const token = jwt.sign(
                usr,
                secret,
                { expiresIn: "24h" }
            );

            return res.status(200).json({
                success: true,
                token
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                msg: "Internal Server Error"
            });
        }
    });
});


AuthAPI.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body || {};

        // Validate Data
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Missing Data"
            });
        }

        // Validate Password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                msg: "Password must be at least 8 characters"
            });
        }

        // Check Existing User
        const checkSQL = `
            SELECT id FROM users
            WHERE username = ? OR email = ?
        `;

        db.query(checkSQL, [username, email], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    msg: "Internal Server Error"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    success: false,
                    msg: "Username or Email already exists"
                });
            }

            // Hash Password
            bcrypt.hash(password, 12, (error, hashedPassword) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        success: false,
                        msg: "Password Processing Error"
                    });
                }

                // Generate UUID
                const { randomUUID } = require("crypto");
                const id = randomUUID();

                // Insert User
                const insertSQL = `
                    INSERT INTO users (id, username, email, password)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertSQL,
                    [id, username, email, hashedPassword],
                    (error) => {
                        if (error) {
                            console.error(error);

                            return res.status(500).json({
                                success: false,
                                msg: "Registration Failed"
                            });
                        }
                        const usr = {
                            username :username,
                            emain:email,
                            id:UUID
                        }
                        const token = jwt.sign(usr , secret , {expiresIn:"24h"})
                        return res.status(201).json({
                            success: true,
                            msg: "Account Created Successfully",
                            token:token
                        });
                    }
                );
            });
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
});


// Export Module to Access It in src/app.js
module.exports = AuthAPI;