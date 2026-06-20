const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

// Force IPv4 instead of IPv6
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Evora.</p>
      `,
    });

    console.log("Email sent successfully to", userEmail);
  } catch (error) {
    console.error("Booking Email Error:", error);
  }
};

const sendOtpEmail = async (userEmail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify your Evora Account"
        : "Evora Booking Verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Evora account."
        : "Please use the following OTP to verify and confirm your event booking.";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
          <h2>${title}</h2>
          <p>${msg}</p>

          <div style="
            margin:20px auto;
            padding:15px;
            font-size:24px;
            font-weight:bold;
            background:#f4f4f4;
            width:max-content;
            letter-spacing:5px;
            border-radius:8px;
          ">
            ${otp}
          </div>

          <p style="color:#888;">
            This OTP expires in 5 minutes.
          </p>
        </div>
      `,
    });

    console.log(`OTP sent to ${userEmail}`);
  } catch (error) {
    console.error("OTP Email Error:", error);
  }
};

module.exports = {
  sendBookingEmail,
  sendOtpEmail,
};
