import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    if (emailType === "VERIFY") {
      // Create a hashed token
      const hashedToken = await bcrypt.hash(userId.toString(), 10);

      // Update user with the verification token and expiry
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour in milliseconds
      });

      // Set up the email transporter
      let transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      // Generate the verification link
      const verificationLink = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;

      // Set up the email options with styled HTML
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Welcome to Our Service!</h2>
            <p style="font-size: 16px; color: #555;">Hi there,</p>
            <p style="font-size: 16px; color: #555;">
              Thank you for signing up! Please verify your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Verify Email
              </a>
            </div>
            <p style="font-size: 16px; color: #555; text-align: center;">
              Or copy and paste this URL into your browser:
            </p>
            <p style="font-size: 14px; color: #007bff; word-break: break-all; text-align: center;">
              <a href="${verificationLink}" style="color: #007bff; text-decoration: none;">
                ${verificationLink}
              </a>
            </p>
            <p style="font-size: 16px; color: #555;">If you did not sign up for this account, please ignore this email.</p>
            <p style="font-size: 16px; color: #555;">Best regards,<br>Your Company Name</p>
          </div>
        `,
      };

      // Send the email
      const mailresponse = await transport.sendMail(mailOptions);

      return mailresponse;
    }
  } catch (error) {
    console.log(error);
  }
};
