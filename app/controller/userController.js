const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class UserController {
  registerView(req, res) {
    res.render("Register", {
      errorMessage: req.flash("error"),
    });
  }

  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (confirmPassword !== password) {
        req.flash("error", "Password is not same");
        return res.redirect("/register");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash("error", "Email-id already exist");
        return res.redirect("/register");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashPassword,
      });
      await user.save();
      res.redirect("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  loginview(req, res) {
    res.render("Login");
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const existUser = await User.findOne({ email });
      if (!existUser) {
        req.flash("error", "Email adress doen't exist");
        return res.redirect("/login");
      }
      const isMatched = await bcrypt.compare(password, existUser.password);
      if (!isMatched) {
        req.flash("error", "Password is invalid");
        return res.redirect("/login");
      }
      const accessToken = jwt.sign(
        {
          id: existUser._id,
          name: existUser.name,
          role: existUser.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });

      const refreshToken = jwt.sign(
        {
          id: existUser._id,
          name: existUser.name,
          role: existUser.role,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "7d" },
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
       if (existUser.role === "user") {
          return res.redirect("/user/list");
        } else {
          return res.redirect("/list");
        }
    } catch (error) {}
  }
}

module.exports = new UserController();
