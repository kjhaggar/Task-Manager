require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("./database/mongoose");
let indexRouter = require("./routes/index");
const passport = require("passport");
require("./passport-config");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.session_secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/", indexRouter);
app.get("/", function (req, res) {
  res.send("App is Running");
});

app.listen(3000, () => console.log("Server connected on port 3000"));
