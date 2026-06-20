const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: "noreply@evora.com",
        name: "Evora",
      },
      to: [{ email: userEmail }],
      subject: `Booking Confirmed: ${eventTitle}`,
      htmlContent: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Evora.</p>
      `,
    });

    console.log("Booking email sent");
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

    await apiInstance.sendTransacEmail({
      sender: {
        email: "surajsetia1304@gmail.com",
        name: "Evora",
      },
      to: [{ email: userEmail }],
      subject: title,
      htmlContent: `
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
