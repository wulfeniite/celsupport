const nodemailer = require("nodemailer");
require("dotenv").config();

exports.generateToken = () => {
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

exports.maitTransport = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
