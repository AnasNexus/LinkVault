
// Load Environment Variables
require("dotenv").config();

// Import Required Modules
const express = require("express");
const cors = require("cors");

// Initialize Server Port
const port = process.env.PORT;

// Initialize Express Application
const app = express();

// Configure CORS Middleware
app.use(cors({
    origin: "*"
}));

// Configure Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Application Modules
const auth = require("./modules/auth");
const start = require("./modules/StartServer");
const AuthAPI = require("./routers/auth");
const user = require("./routers/user");

// Register API Routes
app.use("/api/auth", AuthAPI);
app.use("/api/user" ,auth, user)
// Start Express Server
start(app, port);
