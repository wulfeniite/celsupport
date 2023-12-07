const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model");
const VerificationToken = require("../models/verificationToken.model");
const ResetToken = require("../models/resetToken.model");

const { generateToken, maitTransport } = require("../utils/mail");
const { createToken } = require("../utils/helper");

exports.createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      department: req.body.department,
      mobile: req.body.mobile || "",
    });

    const token = generateToken();

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: token,
    });

    await user.save();
    await verificationToken.save();

    maitTransport().sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Email Verification",
      html: `<h1>OTP: ${token}</h1>`,
    });

    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) throw new Error("No user found with given email!");

    if (await user.comparePassword(req.body.password)) {
      jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          mobile: user.mobile,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        process.env.JSON_WEB_TOKEN_KEY, //store it in .env file in actual projects
        { expiresIn: "14d" }, //expires in 14 days
        (err, token) => {
          if (err) {
            throw new Error("Error in generating login token!");
          }
          return res.json({
            status: "ok",
            token: token,
          });
        }
      );
    } else {
      throw new Error("Incorrect email/password!");
    }
  } catch (error) {
    return res.json({ status: "error", error: error.toString() });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    const token = await VerificationToken.findOne({ owner: userId });
    if (!token) throw new Error("OTP expired! Request a new one.");

    if (await token.compareToken(otp)) {
      user.isVerified = true;

      await user.save();
      await VerificationToken.findByIdAndDelete(token._id);

      maitTransport().sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Email Verified",
        html: `<h1>Email succesfully verified!</h1>`,
      });

      return res.json({ status: "ok" });
    } else {
      throw new Error("Incorrect OTP!");
    }
  } catch (error) {
    return res.json({ status: "error", error: error.toString() });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const token = generateToken();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    const tokenExists = await VerificationToken.findOne({ owner: userId });
    if (tokenExists) await VerificationToken.findByIdAndDelete(tokenExists._id);

    const verificationToken = new VerificationToken({
      owner: userId,
      token: token,
    });

    await verificationToken.save();

    maitTransport().sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Email Verification",
      html: `<h1>OTP: ${token}</h1>`,
    });

    return res.json({ status: "ok", message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ status: "error", error: error.toString() });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) throw new Error("No user found with given email!");

    if (await ResetToken.findOne({ owner: user._id })) {
      return res.json({
        status: "error",
        error: "Wait for 5 mins before making another request!",
      });
    }

    const token = await createToken();

    const resetToken = new ResetToken({ owner: user._id, token: token });
    await resetToken.save();

    resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&uid=${user._id}`;

    maitTransport().sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `<a href="${resetUrl}">Click here to reset password</a>`,
    });

    res.json({
      status: "ok",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    if (await user.comparePassword(password))
      throw new Error("New password can't be same as old one!");

    user.password = password;
    await user.save();

    await ResetToken.findOneAndDelete({ owner: user._id });

    maitTransport().sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Password Reset Successful",
      html: "<h1>Password reset successful!</h1>",
    });

    res.json({ status: "ok", message: "Password reset successful!" });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, password } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    if (!(await user.comparePassword(oldPassword)))
      throw new Error("Old password is incorrect!");
    if (await user.comparePassword(password))
      throw new Error("New password can't be same as old one!");

    user.password = password;
    await user.save();

    res.json({ status: "ok", message: "Password changed successfully!" });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user.isAdmin) throw new Error("Insufficient Authority!");

    const userList = await User.find({});
    res.json({ status: "ok", userList: userList });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    res.json({ status: "ok", user: user });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId, userToDeleteId } = req.body;

    const user = await User.findById(userId);
    if (!user.isAdmin) throw new Error("Insufficient Authority!");

    await User.findByIdAndDelete(userToDeleteId);
    res.json({ status: "ok", message: "User deleted successfully!" });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};
