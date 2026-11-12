require("dotenv").config()
const express = require("express")
const cors = require("cors")
const port = process.env.PORT

const app = express();

app.use(cors({
    origin:"*"
}));

// middlewere:
const db = require("./modules/db")
const auth = require("./modules/auth")
const start = require("./modules/StartServer")

start(app , port)
