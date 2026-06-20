const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

// Force IPv4
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP SERVER READY");
  }
});
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: `"Evora" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Evora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
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

    const mailOptions = {
      from: `"Evora" <${process.env.SMTP_USER}>`,
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
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${userEmail}`);
  } catch (error) {
    console.error("OTP Email Error:", error);
  }
};

module.exports = {
  sendBookingEmail,
  sendOtpEmail,
};
