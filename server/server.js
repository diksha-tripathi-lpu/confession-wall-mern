require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const confessionRoutes = require("./routes/confessionRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173",
  "https://confession-wall-mern.vercel.app"],
  credentials: true
}));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/confessionDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/confessions", confessionRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});