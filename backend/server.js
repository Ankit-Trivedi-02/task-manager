const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: './backend/.env' });
const { connectDB } = require("./config/db");
const userRoutes=require("../backend/routes/userRoutes")
const app = express();
const cookieParser = require('cookie-parser');

// MongoDB connection
connectDB();

//middle wares

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());


//adding routes 
app.use("/api/users",userRoutes)

// Server listening on port 3000
app.listen(process.env.PORT, () => {
    console.log("Server started at PORT :", process.env.PORT);
});
