const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `SpotFinder <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP verification for signup",
      html: `<p>Dear User,</p>
             <p><strong>${otp}</strong> is your OTP for verifying your account on SpotFinder.</p>
             <p>Best regards,<br><strong>Team SpotFinder</strong></p>`,
    });
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// Function to send a review request email
const sendReviewRequestEmail = async (userEmail, userName, venueName, bookingId) => {
  try {
    const reviewFormLink = `http://yourfrontend.com/review/${bookingId}?email=${encodeURIComponent(userEmail)}&venue=${encodeURIComponent(venueName)}`;

    await transporter.sendMail({
      from: `SpotFinder <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Share Your Experience - Venue Booking Review",
      html: `
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Thank you for booking <b>${venueName}</b> with SpotFinder!</p>
        
        <!-- Fake Review Form -->
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td colspan="2">
              <p><strong>Rate Your Experience:</strong></p>
              <span style="font-size: 20px;">⭐️⭐️⭐️⭐️⭐️</span>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p><strong>Write a Review:</strong></p>
              <p style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">(Tap here to write)</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <a href="${reviewFormLink}" 
                 style="display: inline-block; background-color: blue; color: white; padding: 10px 20px; 
                 text-decoration: none; border-radius: 5px; font-weight: bold;">
                 Submit Your Review
              </a>
            </td>
          </tr>
        </table>
        
        <p>Best regards,<br><strong>Team SpotFinder</strong></p>`,
    });

    console.log("Review request email sent successfully");
  } catch (error) {
    console.error("Error sending review request email:", error);
  }
};

module.exports = { sendOTPEmail, sendReviewRequestEmail };
