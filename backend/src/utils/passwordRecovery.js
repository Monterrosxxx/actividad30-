//Import
import nodemailer from "nodemailer";
import {config} from "../config.js";

//Email transporter configuration
const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.emailService.userEmail,
        pass: config.emailService.userPassword
    }
})

//Send recovery email
const sendRecoveryEmail = async (to, subject, text, html) => {
    try {
        const emailInfo = await emailTransporter.sendMail({
            from: '"Cinemark" <rjmj.007.009@gmail.com>',
            to,
            subject,
            text,
            html
        });
        return emailInfo

    }
    catch (error) {
        console.log("Email delivery failed");
    };
};

//HTML template for recovery email
const generateRecoveryHTML = (code) => {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color:rgb(29, 0, 102); padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f4f4f4; font-size: 24px; margin-bottom: 20px;">Password Recovery Request</h1>
        <p style="font-size: 16px; color: #dcdcdc; line-height: 1.5;">
          Hello there.
          We have received a password reset request for your account.
          Please use this verification code to proceed with the password change:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #ffffff; background-color:rgb(29, 0, 102); border-radius: 5px; border: 1px solidrgb(255, 255, 255);">
          ${code}
        </div>
        <p style="font-size: 14px; color: #f2f600; line-height: 1.5;">
          This verification code will remain valid for the next <strong>25 minutes</strong>. If you <strong>did not</strong> request this password reset, please disregard this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ffffff; margin: 20px 0;">
        <footer style="font-size: 12px; color: #f4f4f4;">
          For additional assistance, please contact our customer support team at
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="color:rgb(116, 192, 244); text-decoration: none;">Customer Support Portal</a>.
        </footer>
      </div>
    `;
  };

export {sendRecoveryEmail, generateRecoveryHTML};