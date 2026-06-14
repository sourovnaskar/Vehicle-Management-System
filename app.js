const express = require("express");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const path = require("path");
const flash = require("connect-flash");
const connectDB = require("./app/config/db");
connectDB();

const app = express();
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.errorMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const router = require("./app/routes");
app.use(router);
const port = 8001;
app.listen(port, () => {
  console.log(`server running on : http://localhost:${port}`);
});
