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

// Emailing Owner Id
const EmailOwnerID = async (ownerId, email, name) => {
  try {
    await transporter.sendMail({
      from: `SpotFinder <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Assigned VenueOwner ID",
      html: `
     <div style="max-width: 600px; margin: auto; padding: 0; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <!-- Header with gradient background -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Welcome to SpotFinder</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 16px;">Your Venue Management Journey Begins</p>
      </div>
    
    <!-- Email Content -->
    <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
            Dear <strong style="color: #2d3748;">${name}</strong>,
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;">
            Thank you for registering as a venue owner on our platform. Your unique Owner ID has been assigned. 
            Please keep this ID secure as it will be required for accessing your account and managing your venue bookings.
        </p>

        <!-- ID Card -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display: inline-block; background-color: #ffffff; padding: 12px 20px; border-radius: 6px; margin-bottom: 15px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#667eea"/>
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#764ba2"/>
                </svg>
                <span style="font-size: 14px; color: #4a5568; font-weight: 500;">OWNER ID</span>
            </div>
            <p style="font-size: 28px; font-weight: 700; color: #2d3748; margin: 10px 0; letter-spacing: 1px;">${ownerId}</p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;">
            To get started, please log in to your account and complete your venue profile setup.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;">
                Access Your Dashboard
            </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 5px;">
            Need help or have questions? Our support team is here for you:
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin: 0;">
            ✉️ <a href="mailto:support@spotfinder.com" style="color: #667eea; text-decoration: none;">@spotfinder.2025@gmail.com</a> | 
            📞 +1 (555) 123-4567
        </p>
    </div>
    
      <!-- Footer -->
      <div style="padding: 20px; text-align: center; background-color: #f7fafc; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0;">
          
          <p style="margin: 0; font-size: 13px; color: #a0aec0;">
              © 2025 SpotFinder. All rights reserved.<br>
              This is an automated message - please do not reply directly.
          </p>
      </div>
  </div>
  `,
    });
    console.log("Owner Id mailed successfully");
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // const frontendUrl = process.env.FRONTEND_URL;
    const frontendUrl =  "https://spotfinder-chi.vercel.app";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    
    await transporter.sendMail({
      from: `SpotFinder <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
      <div style="max-width: 600px; margin: auto; padding: 0; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Header with gradient background -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Password Reset</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 16px;">SpotFinder Account Security</p>
        </div>
      
        <!-- Email Content -->
        <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
                We received a request to reset your SpotFinder account password.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;">
                Click the button below to reset your password. This link will expire in 1 hour.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; 
                   font-weight: 500; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                   transition: all 0.3s ease;">
                   Reset Password
                </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;">
                If you didn't request this password reset, you can safely ignore this email. 
                Your password won't be changed until you access the link above and create a new one.
            </p>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                <p style="font-size: 14px; color: #718096; margin-bottom: 5px;">
                    <strong>Didn't request this change?</strong>
                </p>
                <p style="font-size: 14px; color: #718096; margin: 0;">
                    If you didn't request a password reset, please contact our support team immediately.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; background-color: #f7fafc; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #a0aec0;">
                © 2025 SpotFinder. All rights reserved.<br>
                This is an automated message - please do not reply directly.
            </p>
        </div>
      </div>
      `,
    });

    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error; // Re-throw the error to handle it in the calling function
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

module.exports = { sendOTPEmail, sendReviewRequestEmail, EmailOwnerID, sendPasswordResetEmail };
