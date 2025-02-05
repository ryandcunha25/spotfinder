const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service:"gmail",
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `SpotFinder`,
      to: email,
      subject: "OTP verification for signup",
      html: `<p>Dear User,</p>

      <p><strong>${otp}</strong> is your OTP for verifying your account on SpotFinder.</p>  
      <p>This OTP is valid for 5 minutes. Please do not share it with anyone for security reasons.</p>
      
      <p>If you did not request this OTP, please ignore this email.</p>

      <p>Best regards,<br>  
      <strong>Team SpotFinder</strong></p>`,
    });
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

module.exports = sendOTPEmail;
