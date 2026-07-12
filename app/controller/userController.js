const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOtpMail } = require("../utils/sendMail");
const otpModel = require("../models/otpModel");

class UserController {
  landingView(req, res) {
    res.render("landingpage");
  }
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
      await sendOtpMail(req, user);
      res.redirect(`/otp?email=${user.email}`);
    } catch (error) {
      console.log(error.message);
    }
  }

  async otpView(req, res) {
    const { email } = req.query;
    if (!email) {
      req.flash("error", "No email provided for verification");
      return res.redirect("/register");
    }
    res.render("otp", { email: email });
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        req.flash("error", "User doesn't exist");
        return res.redirect("/register");
      }
      const emailVerify = await otpModel.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerify) {
        req.flash("error", "Invalid OTP, please enter valid otp again!");
        return res.redirect(`/otp?email=${existingUser.email}`);
      }
      const currentTime = new Date();
      const expireTime = new Date(
        emailVerify.createdAt.getTime() + 15 * 60 * 1000,
      );

      if (currentTime > expireTime) {
        req.flash("error", "OTP has been expired");
        return res.redirect(`/otp?email=${existingUser.email}`);
      }
      existingUser.isVerified = true;
      await existingUser.save();

      await otpModel.deleteMany({ userId: existingUser._id });
      req.flash("success", "OTP verify successfully");

      const accessToken = jwt.sign(
        {
          id: existingUser._id,
          name: existingUser.name,
          role: existingUser.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });

      const refreshToken = jwt.sign(
        {
          id: existingUser._id,
          name: existingUser.name,
          role: existingUser.role,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "7d" },
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });

      if (existingUser.role === "Customer") {
        return res.redirect("/vehicle/dashboard");
      } else {
        return res.redirect("/mechanic/dashboard");
      }
    } catch (error) {
      console.log(error.message);
      return req.flash("error", "Something Went Wrong");
      return res.redirect("/register");
    }
  }

  async requestVerificationView(req, res) {
    res.render("requestVerification");
  }

  async sendNewOtp(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        req.flash("error", "No account found with that email.");
        return res.redirect("/request-verification");
      }

      if (user.isVerified) {
        req.flash("error", "This account is already verified. Please login.");
        return res.redirect("/login");
      }

      await otpModel.deleteMany({ userId: user._id });

      await sendOtpMail(req, user);
      res.redirect('/otp?email=' + user.email);
    } catch (error) {
      console.log(error.message);
      req.flash("error", "Something went wrong.");
      res.redirect("/request-verification");
    }
  }

  loginview(req, res) {
    res.render("Login", {
      errorMessage: req.flash("error"),
    });
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
      if (!existUser.isActive) {
        req.flash("error", "Can not login ,Your account is blocked by admin ");
        return res.redirect("/login");
      }
      if (!existUser.isVerified) {
        req.flash("error", "Account is not verified , Verify first");
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
      if (existUser.role === "Customer") {
        return res.redirect("/vehicle/dashboard");
      } else if (existUser.role === "Mechanic") {
        return res.redirect("/mechanic/dashboard");
      } else {
        return res.redirect("/admin/dashboard");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.redirect("/login");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new UserController();
