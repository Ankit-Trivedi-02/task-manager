const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: './backend/.env' });
const { connectDB } = require("./config/db");
const app = express();

// MongoDB connection
connectDB();

// Server listening on port 3000
app.listen(process.env.PORT, () => {
    console.log("Server started at PORT :", process.env.PORT);
});
